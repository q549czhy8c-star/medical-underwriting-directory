# Medical Underwriting Directory Web Application

## Project Overview

This project is an interactive medical underwriting directory for insurance and reinsurance workflows. It helps underwriters collect disease names, public risk concerns, private reinsurer requirements, and Life / CI offer references across different disease stages.

The application is intentionally built as a static local-first web app for the first release. Public medical sources can be stored in the repository, while private reinsurer manual content is uploaded locally in the browser and should not be committed to GitHub.

## Key Features

- Bilingual interface: English and Traditional Chinese.
- Multi-dimensional filters: age group, gender, body system, severity/stage, and keyword search.
- Diagnosis reference cards: causes, risk concerns, treatments, requirements, Life offers, and CI offers.
- Manual editing: underwriters can update requirements, decision references, and AI suggestion holding fields.
- Private data vault: local upload for JSON, CSV, Markdown, or text extracts from reinsurer manuals.
- Versioning: app version, schema version, audit trail, and JSON snapshot export.
- Public source registry: stores risk-context references from public sources such as CDC, NICE, WHO, and ACS.

## Local Usage

Open `index.html` in a browser.

No build step is required for this version.

## Suggested Private Upload Formats

### JSON

```json
[
  {
    "diagnosis_name": "Coronary Artery Disease",
    "category_body_part": "cardiovascular",
    "age_group": ["middle_age", "older_adult"],
    "gender": "unisex",
    "severity": "post_revascularization",
    "risk_concern": "Mortality risk depends on vessel disease, LVEF, symptoms, smoking, diabetes, and time since event.",
    "requirements": "Cardiology report, angiogram, ECG, lipid profile, medications, exercise tolerance.",
    "life": "+100% to individual consideration",
    "ci": "Postpone or decline depending on manual wording"
  }
]
```

### CSV

```csv
diagnosis_name,category_body_part,age_group,gender,severity,risk_concern,requirements,life,ci
Coronary Artery Disease,cardiovascular,middle_age|older_adult,unisex,post_revascularization,Risk depends on LVEF and symptoms,Cardiology report,+100%,Postpone
```

### Markdown

Markdown and text files are imported as private manual extracts. The current parser stores the full file text in requirements and the first section as risk context. A later extraction agent can convert these notes into structured diagnosis rows after you log in to the reinsurer manuals.

## System Architecture

1. `index.html`: Application shell and modal form structure.
2. `styles.css`: Responsive interface styling.
3. `app.js`: Local storage database, filtering, editing, upload parsing, export, and version audit logic.
4. `data/sample-diagnoses.js`: Public seed dataset and public source registry.
5. `docs/`: Schema and implementation notes for future agents.

## Data Governance

Do not commit reinsurer manual content unless you have explicit permission to publish it. Private extracts should remain in browser storage or local encrypted storage. Public GitHub repositories should only contain public-source summaries, schema, and placeholder examples.

## Versioning

- Current app version: `0.1.0`
- Current schema version: `2026-05-28.1`
- Version history is tracked in `CHANGELOG.md`.
- Runtime edits are logged in local storage and included in exported snapshots.

## Disclaimer

This tool is a workflow aid for insurance underwriting research. It is not medical advice, legal advice, or a substitute for approved insurer/reinsurer underwriting manuals.
