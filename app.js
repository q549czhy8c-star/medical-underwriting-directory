const STORAGE_KEY = "muw.records.v1";
const AUDIT_KEY = "muw.audit.v1";
const SETTINGS_KEY = "muw.settings.v1";

const i18n = {
  en: {
    productEyebrow: "Medical Underwriting",
    appTitle: "Risk & Offer Directory",
    filters: "Filters",
    reset: "Reset",
    search: "Search",
    searchPlaceholder: "Diagnosis, risk, requirement...",
    ageGroup: "Age Group",
    gender: "Gender",
    bodySystem: "Body System",
    severity: "Severity / Stage",
    privateVault: "Private Data Vault",
    privateVaultCopy: "Upload local reinsurer manual extracts as JSON, CSV, or Markdown. Files stay in browser storage unless you export them.",
    uploadPrivate: "Upload private file",
    exportSnapshot: "Export Snapshot",
    clearPrivate: "Clear Private",
    versioning: "Versioning",
    directory: "Diagnosis Directory",
    addDiagnosis: "Add Diagnosis",
    medicalContext: "Medical Context",
    riskConcern: "Risk Concern",
    offers: "Life / CI Offers",
    ratingDetails: "Rating Details",
    addOffer: "Add Offer",
    manualEdit: "Manual Underwriting Update",
    requirements: "Requirements",
    decisionReference: "Decision Reference",
    lifeRating: "Life Rating",
    ciRating: "CI Rating",
    aiSuggestion: "AI Suggestion Holding Area",
    updatedBy: "Updated By",
    close: "Close",
    saveVersion: "Save Version",
    all: "All",
    records: "records",
    causes: "Causes",
    risks: "Risks",
    treatments: "Treatments",
    publicSources: "Public Sources",
    sourceNote: "Source Note",
    life: "Life",
    ci: "CI",
    notes: "Notes",
    stage: "Stage",
    private: "Private",
    public_seed: "Public Seed",
    imported: "Imported",
    noRecords: "No matching diagnosis records.",
    saved: "Saved version",
    uploaded: "Uploaded private file",
    cleared: "Cleared private vault",
    created: "Created local diagnosis",
    sourceDisclaimer: "Public sources support risk context only; reinsurer manuals remain private and must be uploaded locally.",
    privateManualNotice: "Private manual source text. Chinese translation is not generated automatically yet.",
    sourceDetails: "Source Details"
  },
  zh: {
    productEyebrow: "醫療核保",
    appTitle: "風險與核保 Offer 目錄",
    filters: "篩選",
    reset: "重設",
    search: "搜尋",
    searchPlaceholder: "疾病、風險、核保要求...",
    ageGroup: "年齡層",
    gender: "性別",
    bodySystem: "身體系統",
    severity: "程度 / 階段",
    privateVault: "私有資料庫",
    privateVaultCopy: "可上傳本地 reinsurer manual 摘要，支援 JSON、CSV、Markdown。檔案只存在瀏覽器儲存，除非你自行匯出。",
    uploadPrivate: "上傳私有檔案",
    exportSnapshot: "匯出快照",
    clearPrivate: "清除私有資料",
    versioning: "版本記錄",
    directory: "疾病目錄",
    addDiagnosis: "新增疾病",
    medicalContext: "醫學背景",
    riskConcern: "風險關注",
    offers: "Life / CI Offer",
    ratingDetails: "評級詳情",
    addOffer: "新增 Offer",
    manualEdit: "手動核保更新",
    requirements: "核保要求",
    decisionReference: "核保結果參考",
    lifeRating: "Life 評級",
    ciRating: "CI 評級",
    aiSuggestion: "AI 建議暫存區",
    updatedBy: "更新者",
    close: "關閉",
    saveVersion: "儲存版本",
    all: "全部",
    records: "筆記錄",
    causes: "成因",
    risks: "風險",
    treatments: "治療",
    publicSources: "公開來源",
    sourceNote: "來源備註",
    life: "Life",
    ci: "CI",
    notes: "備註",
    stage: "階段",
    private: "私有",
    public_seed: "公開種子資料",
    imported: "已匯入",
    noRecords: "沒有符合條件的疾病記錄。",
    saved: "已儲存版本",
    uploaded: "已上傳私有檔案",
    cleared: "已清除私有資料",
    created: "已新增本地疾病",
    sourceDisclaimer: "公開來源只支援風險背景；reinsurer manual 仍屬私有，必須以本地上傳方式處理。",
    privateManualNotice: "私有 manual 原文內容。中文翻譯尚未自動生成。",
    sourceDetails: "來源資料"
  }
};

const optionLabels = {
  age: {
    child: { en: "Child", zh: "兒童" },
    young_adult: { en: "Young Adult", zh: "青年" },
    middle_age: { en: "Middle Age", zh: "中年" },
    older_adult: { en: "Older Adult", zh: "老年" }
  },
  gender: {
    unisex: { en: "Unisex", zh: "通用" },
    male: { en: "Male", zh: "男" },
    female: { en: "Female", zh: "女" }
  },
  system: {
    medical_manual: { en: "Manual Extract", zh: "Manual 摘錄" },
    cardiovascular: { en: "Cardiovascular", zh: "心血管" },
    endocrine: { en: "Endocrine", zh: "內分泌" },
    respiratory: { en: "Respiratory", zh: "呼吸" },
    oncology: { en: "Oncology", zh: "腫瘤" },
    digestive: { en: "Digestive", zh: "消化" },
    musculoskeletal: { en: "Musculoskeletal", zh: "骨骼肌肉" },
    neurological: { en: "Neurological", zh: "神經" },
    renal: { en: "Renal", zh: "腎臟" }
  }
};

let state = {
  lang: "en",
  records: [],
  selectedId: null,
  filters: {
    query: "",
    age: "all",
    gender: "all",
    system: "all",
    severity: "all"
  },
  audit: []
};

const $ = (selector) => document.querySelector(selector);

function init() {
  const settings = readJson(SETTINGS_KEY, {});
  state.lang = settings.lang || "en";
  document.documentElement.classList.toggle("dark", settings.theme === "dark");
  state.records = readJson(STORAGE_KEY, window.MUW_DATA.diagnoses);
  state.audit = readJson(AUDIT_KEY, [
    {
      action: "App initialized",
      timestamp: new Date().toISOString(),
      version: window.MUW_DATA.appVersion
    }
  ]);

  bindEvents();
  renderStaticText();
  renderFilters();
  renderSources();
  render();
}

function bindEvents() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      saveSettings();
      renderStaticText();
      renderFilters();
      renderSources();
      render();
    });
  });

  $("#themeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    saveSettings();
  });

  $("#resetFilters").addEventListener("click", () => {
    state.filters = { query: "", age: "all", gender: "all", system: "all", severity: "all" };
    $("#searchInput").value = "";
    renderFilters();
    render();
  });

  $("#searchInput").addEventListener("input", (event) => {
    state.filters.query = event.target.value.trim().toLowerCase();
    render();
  });

  ["age", "gender", "system", "severity"].forEach((key) => {
    $(`#${key}Filter`).addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      render();
    });
  });

  $("#addRecord").addEventListener("click", createRecord);
  $("#addOffer").addEventListener("click", () => appendOfferRow({ stage: "", life: "", ci: "", notes: "" }));
  $("#saveRecord").addEventListener("click", saveSelectedRecord);
  $("#privateUpload").addEventListener("change", handleUpload);
  $("#exportData").addEventListener("click", exportSnapshot);
  $("#clearPrivate").addEventListener("click", clearPrivateData);
}

function renderStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  $("#appVersion").textContent = `v${window.MUW_DATA.appVersion}`;
}

function renderFilters() {
  const ageOptions = uniqueFromRecords("age_group").flat();
  setOptions($("#ageFilter"), [{ value: "all", label: t("all") }].concat(unique(ageOptions).map((value) => ({
    value,
    label: labelFor("age", value)
  }))), state.filters.age);

  setOptions($("#genderFilter"), [{ value: "all", label: t("all") }].concat(uniqueFromRecords("gender").map((value) => ({
    value,
    label: labelFor("gender", value)
  }))), state.filters.gender);

  setOptions($("#systemFilter"), [{ value: "all", label: t("all") }].concat(uniqueFromRecords("category_body_part").map((value) => ({
    value,
    label: labelFor("system", value)
  }))), state.filters.system);

  setOptions($("#severityFilter"), [{ value: "all", label: t("all") }].concat(uniqueFromRecords("severity").map((value) => ({
    value,
    label: humanize(value)
  }))), state.filters.severity);
}

function renderSources() {
  $("#sourceStrip").innerHTML = window.MUW_DATA.publicSources.map((source) => `
    <article class="source-card">
      <p class="eyebrow">${t("sourceNote")}</p>
      <a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>
      <p class="muted">${escapeHtml(localText(source.note))}</p>
    </article>
  `).join("");
}

function render() {
  const records = filteredRecords();
  $("#resultMeta").textContent = `${records.length} ${t("records")}`;
  $("#privateCount").textContent = state.records.filter((record) => record.source_type === "private").length;
  renderCards(records);
  renderAudit();
}

function renderCards(records) {
  if (!records.length) {
    $("#cardGrid").innerHTML = `<p class="muted">${t("noRecords")}</p>`;
    return;
  }

  $("#cardGrid").innerHTML = records.map((record) => {
    const offers = record.offers || [];
    return `
      <button class="diagnosis-card" type="button" data-record-id="${record.id}">
        <div class="card-title">
          <div>
            <p class="eyebrow">${labelFor("system", record.category_body_part)}</p>
            <h3>${escapeHtml(localText(record.diagnosis_name))}</h3>
          </div>
          <span class="status-pill">${escapeHtml(t(record.source_type) || humanize(record.source_type))}</span>
        </div>
        <div class="tag-row">
          ${(record.age_group || []).map((age) => `<span class="tag">${labelFor("age", age)}</span>`).join("")}
          <span class="tag">${labelFor("gender", record.gender)}</span>
          <span class="tag">${humanize(record.severity)}</span>
        </div>
        <p class="summary">${escapeHtml(compactText(localText(record.base_data.risks), 340))}</p>
        <div class="offer-preview">
          ${offers.slice(0, 2).map((offer) => `
            <div><strong>${escapeHtml(offer.stage)}</strong><span>${escapeHtml(compactText(`${offer.life} / ${offer.ci}`, 160))}</span></div>
          `).join("")}
        </div>
      </button>
    `;
  }).join("");

  document.querySelectorAll("[data-record-id]").forEach((button) => {
    button.addEventListener("click", () => openRecord(button.dataset.recordId));
  });
}

function openRecord(id) {
  const record = state.records.find((item) => item.id === id);
  if (!record) return;
  state.selectedId = id;

  $("#modalTitle").textContent = localText(record.diagnosis_name);
  $("#modalSourceType").textContent = `${t(record.source_type) || record.source_type} • ${new Date(record.last_updated).toLocaleString()}`;

  const sourceMeta = sourceMetaText(record);
  $("#medicalContext").innerHTML = [
    sourceMeta ? infoBox(t("sourceDetails"), sourceMeta, "compact-info") : "",
    infoBox(t("causes"), localText(record.base_data.causes), "compact-info"),
    infoBox(t("treatments"), localText(record.base_data.treatments), "compact-info")
  ].filter(Boolean).join("");

  const sourceBoxes = (record.source_ids || []).map((id) => window.MUW_DATA.publicSources.find((source) => source.id === id)).filter(Boolean);
  $("#riskConcern").innerHTML = [
    record.source_type === "private" ? infoBox(t("sourceNote"), t("privateManualNotice"), "compact-info") : "",
    infoBox(t("risks"), localText(record.base_data.risks), "long-info"),
    infoBox(t("publicSources"), sourceBoxes.map((source) => `${source.name}: ${source.url}`).join("\n") || t("sourceDisclaimer"), "compact-info")
  ].filter(Boolean).join("");

  $("#offerTable").innerHTML = renderRatingDetails(record);

  $("#requirementsInput").value = record.underwriting_rules.requirements || "";
  $("#decisionInput").value = record.underwriting_rules.decisions_reference || "";
  $("#aiSuggestionInput").value = record.underwriting_rules.ai_suggestions || "";
  $("#updatedByInput").value = record.updated_by || "Human";

  $("#recordDialog").showModal();
}

function renderOfferRows(offers) {
  $("#offerTable").innerHTML = `
    <div class="offer-row header">
      <span>${t("stage")}</span><span>${t("life")}</span><span>${t("ci")}</span><span>${t("notes")}</span>
    </div>
  `;
  offers.forEach(appendOfferRow);
}

function appendOfferRow(offer) {
  const template = $("#offerRowTemplate").content.cloneNode(true);
  template.querySelector('[data-offer="stage"]').value = offer.stage || "";
  template.querySelector('[data-offer="life"]').value = offer.life || "";
  template.querySelector('[data-offer="ci"]').value = offer.ci || "";
  template.querySelector('[data-offer="notes"]').value = offer.notes || "";
  $("#offerTable").append(template);
}

function saveSelectedRecord() {
  const record = state.records.find((item) => item.id === state.selectedId);
  if (!record) return;

  const offerRows = Array.from(document.querySelectorAll("#offerTable .offer-row:not(.header)"));
  const offers = offerRows.map((row) => ({
    stage: row.querySelector('[data-offer="stage"]').value.trim(),
    life: row.querySelector('[data-offer="life"]').value.trim(),
    ci: row.querySelector('[data-offer="ci"]').value.trim(),
    notes: row.querySelector('[data-offer="notes"]').value.trim()
  })).filter((offer) => offer.stage || offer.life || offer.ci || offer.notes);

  record.underwriting_rules.requirements = $("#requirementsInput").value.trim();
  record.underwriting_rules.decisions_reference = $("#decisionInput").value.trim();
  record.underwriting_rules.ai_suggestions = $("#aiSuggestionInput").value.trim();
  record.updated_by = $("#updatedByInput").value.trim() || "Human";
  record.offers = offerRows.length ? offers : record.offers;
  record.last_updated = new Date().toISOString();

  persist();
  addAudit(`${t("saved")}: ${localText(record.diagnosis_name)}`);
  $("#recordDialog").close();
  render();
}

function createRecord() {
  const now = new Date().toISOString();
  const record = {
    id: `dx-local-${crypto.randomUUID()}`,
    category_body_part: "cardiovascular",
    age_group: ["middle_age"],
    gender: "unisex",
    severity: "new",
    diagnosis_name: { en: "New Diagnosis", zh: "新增疾病" },
    source_type: "private",
    source_ids: [],
    base_data: {
      causes: { en: "Add causes.", zh: "請補充成因。" },
      risks: { en: "Add risk concern.", zh: "請補充風險關注。" },
      treatments: { en: "Add treatment context.", zh: "請補充治療背景。" }
    },
    underwriting_rules: {
      requirements: "",
      decisions_reference: "",
      ai_suggestions: ""
    },
    offers: [{ stage: "Draft", life: "", ci: "", notes: "" }],
    updated_by: "Human",
    last_updated: now
  };
  state.records.unshift(record);
  persist();
  addAudit(`${t("created")}: ${localText(record.diagnosis_name)}`);
  renderFilters();
  render();
  openRecord(record.id);
}

async function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  const imported = parsePrivateFile(file.name, text);
  state.records = imported.concat(state.records);
  persist();
  addAudit(`${t("uploaded")}: ${file.name} (${imported.length})`);
  renderFilters();
  render();
  event.target.value = "";
}

function parsePrivateFile(name, text) {
  const extension = name.split(".").pop().toLowerCase();
  if (extension === "json") {
    const json = JSON.parse(text);
    const rows = Array.isArray(json) ? json : json.diagnoses || [];
    return rows.map(normalizeImportedRecord);
  }
  if (extension === "csv") {
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((value) => value.trim());
    return lines.map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return normalizeImportedRecord(Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
    });
  }
  return [normalizeImportedRecord({
    diagnosis_name: name.replace(/\.(md|markdown|txt)$/i, ""),
    risks: text.slice(0, 1600),
    requirements: text
  })];
}

function normalizeImportedRecord(row) {
  const now = new Date().toISOString();
  const name = row.diagnosis_name || row.name || row.diagnosis || "Private Manual Extract";
  if (row.base_data || row.underwriting_rules || row.private_meta) {
    return {
      id: row.id || `dx-private-${crypto.randomUUID()}`,
      category_body_part: row.category_body_part || row.system || "medical_manual",
      age_group: Array.isArray(row.age_group) ? row.age_group : String(row.age_group || "middle_age").split("|"),
      gender: row.gender || "unisex",
      severity: row.severity || row.stage || "manual_extract",
      diagnosis_name: typeof name === "object" ? ensureLocalized(name) : toLocalized(name),
      source_type: "private",
      source_ids: Array.isArray(row.source_ids) ? row.source_ids : [],
      base_data: {
        causes: ensureLocalized(row.base_data?.causes || row.causes || ""),
        risks: ensureLocalized(row.base_data?.risks || row.risks || row.risk_concern || ""),
        treatments: ensureLocalized(row.base_data?.treatments || row.treatments || "")
      },
      underwriting_rules: {
        requirements: row.underwriting_rules?.requirements || row.requirements || "",
        decisions_reference: row.underwriting_rules?.decisions_reference || row.decisions_reference || row.decision || "",
        ai_suggestions: row.underwriting_rules?.ai_suggestions || row.ai_suggestions || ""
      },
      offers: normalizeOffers(row.offers, row),
      raw_sections: row.raw_sections || {},
      updated_by: row.updated_by || "Human",
      last_updated: row.last_updated || now,
      private_meta: row.private_meta || {}
    };
  }

  return {
    id: row.id || `dx-private-${crypto.randomUUID()}`,
    category_body_part: row.category_body_part || row.system || "cardiovascular",
    age_group: Array.isArray(row.age_group) ? row.age_group : String(row.age_group || "middle_age").split("|"),
    gender: row.gender || "unisex",
    severity: row.severity || row.stage || "manual_extract",
    diagnosis_name: typeof name === "object" ? ensureLocalized(name) : toLocalized(name),
    source_type: "private",
    source_ids: [],
    base_data: {
      causes: ensureLocalized(row.causes || ""),
      risks: ensureLocalized(row.risks || row.risk_concern || ""),
      treatments: ensureLocalized(row.treatments || "")
    },
    underwriting_rules: {
      requirements: row.requirements || "",
      decisions_reference: row.decisions_reference || row.decision || "",
      ai_suggestions: row.ai_suggestions || ""
    },
    offers: normalizeOffers(row.offers, row),
    updated_by: row.updated_by || "Human",
    last_updated: row.last_updated || now
  };
}

function clearPrivateData() {
  state.records = state.records.filter((record) => record.source_type !== "private");
  persist();
  addAudit(t("cleared"));
  renderFilters();
  render();
}

function exportSnapshot() {
  const payload = {
    appVersion: window.MUW_DATA.appVersion,
    schemaVersion: window.MUW_DATA.schemaVersion,
    exportedAt: new Date().toISOString(),
    publicSources: window.MUW_DATA.publicSources,
    audit: state.audit,
    diagnoses: state.records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `medical-underwriting-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function filteredRecords() {
  return state.records.filter((record) => {
    const haystack = JSON.stringify(record).toLowerCase();
    return (!state.filters.query || haystack.includes(state.filters.query)) &&
      (state.filters.age === "all" || (record.age_group || []).includes(state.filters.age)) &&
      (state.filters.gender === "all" || record.gender === state.filters.gender || record.gender === "unisex") &&
      (state.filters.system === "all" || record.category_body_part === state.filters.system) &&
      (state.filters.severity === "all" || record.severity === state.filters.severity);
  });
}

function addAudit(action) {
  state.audit.unshift({
    action,
    timestamp: new Date().toISOString(),
    version: window.MUW_DATA.appVersion
  });
  state.audit = state.audit.slice(0, 30);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(state.audit));
}

function renderAudit() {
  $("#auditList").innerHTML = state.audit.slice(0, 8).map((item) => `
    <li><strong>${escapeHtml(item.version)}</strong> ${escapeHtml(item.action)}<br>${new Date(item.timestamp).toLocaleString()}</li>
  `).join("");
}

function infoBox(label, value, className = "") {
  return `<div class="info-box ${className}"><strong>${escapeHtml(label)}</strong><p class="muted">${escapeHtml(value || "-").replace(/\n/g, "<br>")}</p></div>`;
}

function renderRatingDetails(record) {
  const primaryOffer = (record.offers || [])[0] || {};
  const lifeFallback = primaryOffer.life || extractDecisionSection(record.underwriting_rules.decisions_reference, "Life Rating:");
  const ciFallback = primaryOffer.ci || extractDecisionSection(record.underwriting_rules.decisions_reference, "CI Rating:");
  const lifeTables = record.raw_sections?.life_rating?.tables || [];
  const ciTables = record.raw_sections?.ci_rating?.tables || [];

  return `
    <div class="rating-panel">
      <div class="rating-panel-heading">
        <h4>${escapeHtml(t("lifeRating"))}</h4>
      </div>
      ${lifeTables.length ? renderManualTables(lifeTables) : infoBox(t("lifeRating"), lifeFallback, "long-info")}
    </div>
    <div class="rating-panel">
      <div class="rating-panel-heading">
        <h4>${escapeHtml(t("ciRating"))}</h4>
      </div>
      ${ciTables.length ? renderManualTables(ciTables) : infoBox(t("ciRating"), ciFallback, "long-info")}
    </div>
  `;
}

function renderManualTables(tables) {
  return tables.map((table) => {
    const rows = (table.rows || []).filter((row) => row.some((cell) => String(cell || "").trim()));
    if (!rows.length) return "";
    const [head, ...body] = rows;
    const hasHeader = head.length > 1 && head.slice(1).some(Boolean);
    const headerHtml = hasHeader ? `<thead><tr>${head.map((cell) => `<th>${escapeHtml(cell || "")}</th>`).join("")}</tr></thead>` : "";
    const bodyRows = hasHeader ? body : rows;
    return `
      <div class="manual-table-wrap">
        <table class="manual-rating-table">
          ${headerHtml}
          <tbody>
            ${bodyRows.map((row) => `
              <tr>
                ${row.map((cell, index) => `<td class="${index === 0 ? "rating-condition" : ""}">${escapeHtml(cell || "")}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }).join("");
}

function setOptions(select, options, selected) {
  select.innerHTML = options.map((option) => `<option value="${option.value}">${escapeHtml(option.label)}</option>`).join("");
  select.value = selected;
}

function uniqueFromRecords(key) {
  return unique(state.records.map((record) => record[key]).filter(Boolean));
}

function unique(values) {
  return Array.from(new Set(values)).sort();
}

function labelFor(group, value) {
  return optionLabels[group]?.[value]?.[state.lang] || humanize(value);
}

function localText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[state.lang] || value.en || value.zh || "";
}

function toLocalized(value) {
  return typeof value === "object" ? ensureLocalized(value) : { en: value, zh: value };
}

function ensureLocalized(value) {
  if (!value) return { en: "", zh: "" };
  if (typeof value === "string") return { en: value, zh: value };
  const en = value.en || value.zh || "";
  const zh = value.zh || value.en || "";
  return { ...value, en, zh };
}

function normalizeOffers(offers, row) {
  if (Array.isArray(offers) && offers.length) {
    return offers.map((offer) => ({
      stage: offer.stage || row.stage || "Manual extract",
      life: offer.life || "",
      ci: offer.ci || "",
      notes: offer.notes || ""
    }));
  }
  return [
    { stage: row.stage || "Manual extract", life: row.life || "", ci: row.ci || "", notes: row.notes || "" }
  ];
}

function compactText(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text || "-";
  return `${text.slice(0, maxLength - 1)}...`;
}

function sourceMetaText(record) {
  if (!record.private_meta) return "";
  return [
    record.private_meta.reinsurer,
    record.private_meta.source_system,
    record.private_meta.display_name,
    record.private_meta.option_value ? `option ${record.private_meta.option_value}` : ""
  ].filter(Boolean).join("\n");
}

function extractDecisionSection(value, heading) {
  const text = String(value || "");
  const start = text.indexOf(heading);
  if (start === -1) return "";
  const rest = text.slice(start + heading.length).trim();
  const nextHeading = heading === "Life Rating:" ? rest.indexOf("CI Rating:") : -1;
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading).trim();
}

function humanize(value) {
  return String(value || "").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function t(key) {
  return i18n[state.lang][key] || i18n.en[key] || key;
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    lang: state.lang,
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light"
  }));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.MUW_TEST = {
  normalizeImportedRecord,
  parsePrivateFile
};

init();
