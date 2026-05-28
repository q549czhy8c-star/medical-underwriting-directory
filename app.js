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
    addOffer: "Add Offer",
    manualEdit: "Manual Underwriting Update",
    requirements: "Requirements",
    decisionReference: "Decision Reference",
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
    sourceDisclaimer: "Public sources support risk context only; reinsurer manuals remain private and must be uploaded locally."
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
    addOffer: "新增 Offer",
    manualEdit: "手動核保更新",
    requirements: "核保要求",
    decisionReference: "核保結果參考",
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
    sourceDisclaimer: "公開來源只支援風險背景；reinsurer manual 仍屬私有，必須以本地上傳方式處理。"
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
        <p class="summary">${escapeHtml(localText(record.base_data.risks))}</p>
        <div class="offer-preview">
          ${offers.slice(0, 2).map((offer) => `
            <div><strong>${escapeHtml(offer.stage)}</strong><span>${escapeHtml(offer.life)} / ${escapeHtml(offer.ci)}</span></div>
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

  $("#medicalContext").innerHTML = [
    ["causes", record.base_data.causes],
    ["treatments", record.base_data.treatments]
  ].map(([label, value]) => infoBox(t(label), localText(value))).join("");

  const sourceBoxes = (record.source_ids || []).map((id) => window.MUW_DATA.publicSources.find((source) => source.id === id)).filter(Boolean);
  $("#riskConcern").innerHTML = [
    infoBox(t("risks"), localText(record.base_data.risks)),
    infoBox(t("publicSources"), sourceBoxes.map((source) => `${source.name}: ${source.url}`).join("\n") || t("sourceDisclaimer"))
  ].join("");

  $("#requirementsInput").value = record.underwriting_rules.requirements || "";
  $("#decisionInput").value = record.underwriting_rules.decisions_reference || "";
  $("#aiSuggestionInput").value = record.underwriting_rules.ai_suggestions || "";
  $("#updatedByInput").value = record.updated_by || "Human";

  renderOfferRows(record.offers || []);
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

  const offers = Array.from(document.querySelectorAll("#offerTable .offer-row:not(.header)")).map((row) => ({
    stage: row.querySelector('[data-offer="stage"]').value.trim(),
    life: row.querySelector('[data-offer="life"]').value.trim(),
    ci: row.querySelector('[data-offer="ci"]').value.trim(),
    notes: row.querySelector('[data-offer="notes"]').value.trim()
  })).filter((offer) => offer.stage || offer.life || offer.ci || offer.notes);

  record.underwriting_rules.requirements = $("#requirementsInput").value.trim();
  record.underwriting_rules.decisions_reference = $("#decisionInput").value.trim();
  record.underwriting_rules.ai_suggestions = $("#aiSuggestionInput").value.trim();
  record.updated_by = $("#updatedByInput").value.trim() || "Human";
  record.offers = offers;
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
  return {
    id: row.id || `dx-private-${crypto.randomUUID()}`,
    category_body_part: row.category_body_part || row.system || "cardiovascular",
    age_group: Array.isArray(row.age_group) ? row.age_group : String(row.age_group || "middle_age").split("|"),
    gender: row.gender || "unisex",
    severity: row.severity || row.stage || "manual_extract",
    diagnosis_name: typeof name === "object" ? name : { en: name, zh: name },
    source_type: "private",
    source_ids: [],
    base_data: {
      causes: toLocalized(row.causes || ""),
      risks: toLocalized(row.risks || row.risk_concern || ""),
      treatments: toLocalized(row.treatments || "")
    },
    underwriting_rules: {
      requirements: row.requirements || "",
      decisions_reference: row.decisions_reference || row.decision || "",
      ai_suggestions: row.ai_suggestions || ""
    },
    offers: row.offers || [
      { stage: row.stage || "Manual extract", life: row.life || "", ci: row.ci || "", notes: row.notes || "" }
    ],
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

function infoBox(label, value) {
  return `<div class="info-box"><strong>${escapeHtml(label)}</strong><p class="muted">${escapeHtml(value || "-").replace(/\n/g, "<br>")}</p></div>`;
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
  return typeof value === "object" ? value : { en: value, zh: value };
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

init();
