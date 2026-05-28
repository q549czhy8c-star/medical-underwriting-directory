import fs from "node:fs";
import path from "node:path";

const baseDir = path.resolve("private-data");
const sourceFile = path.join(baseDir, "hannover_extracted_records.private.json");
const outputFile = path.join(baseDir, "hannover_app_import.private.json");
const manifestFile = path.join(baseDir, "checkpoints", "hannover_manifest.private.json");

const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function sentenceSplit(value) {
  return clean(value)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bulletize(items, maxItems = 7) {
  const seen = new Set();
  const bullets = [];
  for (const item of items) {
    const normalized = clean(item).replace(/^-\s*/, "").replace(/\s+-$/, "");
    if (!normalized || normalized.length < 8) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    bullets.push(`- ${normalized}`);
    if (bullets.length >= maxItems) break;
  }
  return bullets.join("\n");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findLabelIndex(text, label) {
  const pattern = new RegExp(`(^|\\s|-\\s*)${escapeRegExp(label)}(\\s|$)`, "i");
  const match = pattern.exec(text);
  if (!match) return -1;
  return match.index + match[1].length;
}

function findSection(text, startLabels, endLabels) {
  const normalized = clean(text);
  const starts = startLabels
    .map((label) => ({ label, index: findLabelIndex(normalized, label) }))
    .filter((entry) => entry.index >= 0)
    .sort((a, b) => a.index - b.index);
  if (!starts.length) return "";

  const start = starts[0].index + starts[0].label.length;
  const after = normalized.slice(start).trim();
  const endIndexes = endLabels
    .map((label) => findLabelIndex(after, label))
    .filter((index) => index > 0)
    .sort((a, b) => a - b);
  return clean(endIndexes.length ? after.slice(0, endIndexes[0]) : after).replace(/^-\s*/, "");
}

function extractRiskSummary(record) {
  const raw = record.risk_information || "";
  const narrative = findSection(raw, ["Narrative"], [
    "Symptoms",
    "Treatment",
    "Treatment/Medications",
    "Clinical course",
    "Risk profile",
    "Risk classification",
    "Tests",
    "Underwriting Information",
    "Life",
    "CI"
  ]);
  const riskProfile = findSection(raw, ["Risk profile", "Risk classification"], [
    "Tests",
    "Underwriting Information",
    "Life",
    "CI",
    "TPD",
    "IP"
  ]);
  const sourceText = [narrative, riskProfile].filter(Boolean).join(" ");
  const bullets = bulletize(sentenceSplit(sourceText), 8);
  return bullets || bulletize(sentenceSplit(raw), 8) || "- Review source manual text.";
}

function extractTreatment(record) {
  const treatment = findSection(record.risk_information || "", ["Treatment/Medications", "Treatment"], [
    "Clinical course",
    "Risk profile",
    "Risk classification",
    "Tests",
    "Underwriting Information",
    "Life",
    "CI"
  ]);
  return bulletize(sentenceSplit(treatment), 6) || "";
}

function extractRequirements(record) {
  const underwriting = findSection(record.risk_information || "", ["Underwriting Information", "Underwriting information"], [
    "Life",
    "CI",
    "TPD",
    "IP",
    "Additional Rating"
  ]);
  const tests = findSection(record.risk_information || "", ["Tests"], [
    "Underwriting Information",
    "Life",
    "CI",
    "TPD",
    "IP"
  ]);
  const bullets = bulletize(sentenceSplit([underwriting, tests].filter(Boolean).join(" ")), 8);
  return bullets || "- Refer to manual rating tables and obtain medical evidence as indicated.";
}

function parseDisplay(record) {
  return {
    diagnosisName: record.diagnosis_name || record.target_topic || record.alias_name || record.display_name,
    code: record.code || "",
    aliasName: record.alias_name || ""
  };
}

function normalizeForApp(record) {
  const parsed = parseDisplay(record);
  const riskSummary = extractRiskSummary(record);
  const treatment = extractTreatment(record);
  const requirements = extractRequirements(record);

  return {
    id: record.id,
    category_body_part: "medical_manual",
    age_group: ["middle_age"],
    gender: "unisex",
    severity: "manual_extract",
    diagnosis_name: {
      en: parsed.diagnosisName,
      zh: parsed.diagnosisName
    },
    source_type: "private",
    source_ids: [],
    base_data: {
      causes: { en: "", zh: "" },
      risks: { en: riskSummary, zh: riskSummary },
      treatments: { en: treatment, zh: treatment }
    },
    underwriting_rules: {
      requirements,
      decisions_reference: ["Life Rating:", record.life_rating || "", "", "CI Rating:", record.ci_rating || ""].join("\n"),
      ai_suggestions: ""
    },
    offers: [
      {
        stage: "Manual extract",
        life: record.life_rating || "",
        ci: record.ci_rating || "",
        notes: `Hannover Re Ascent option ${record.option_value}`
      }
    ],
    raw_sections: record.raw_sections || {},
    updated_by: "HumanExtractChrome",
    last_updated: record.extracted_at,
    private_meta: {
      reinsurer: record.reinsurer,
      source_system: record.source_system,
      option_value: record.option_value,
      display_name: record.display_name,
      code: parsed.code,
      alias_name: parsed.aliasName,
      target_topic: record.target_topic,
      batch_id: record.batch_id
    }
  };
}

const diagnoses = source.records.map(normalizeForApp);
const output = {
  appVersion: "0.1.3",
  schemaVersion: "2026-05-28.3-private",
  exportedAt: new Date().toISOString(),
  diagnoses
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

if (fs.existsSync(manifestFile)) {
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  manifest.files.app_import = "private-data/hannover_app_import.private.json";
  manifest.private_import_builder = {
    script: "scripts/build-private-import.mjs",
    schemaVersion: output.schemaVersion,
    updated_at: output.exportedAt,
    record_count: diagnoses.length
  };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
}

console.log(JSON.stringify({
  output: "private-data/hannover_app_import.private.json",
  record_count: diagnoses.length,
  schemaVersion: output.schemaVersion,
  first: {
    diagnosis: diagnoses[0]?.diagnosis_name?.en,
    risk_preview: diagnoses[0]?.base_data?.risks?.en?.split("\n").slice(0, 3),
    requirements_preview: diagnoses[0]?.underwriting_rules?.requirements?.split("\n").slice(0, 3)
  }
}, null, 2));
