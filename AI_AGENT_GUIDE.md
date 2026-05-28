# AI Agent Data Update and Maintenance Guide

Welcome, AI agent. This project separates public medical risk context from private reinsurer manual data. Follow these rules strictly.

## Mission

Maintain structured medical underwriting records by updating public base data, assisting with private manual extraction after user login, and preserving human expert decisions.

## Data Boundaries

- Public data may include summaries from open sources such as CDC, NICE, WHO, ACS, peer-reviewed papers, and official clinical guidelines.
- Private reinsurer manual data must remain local unless the user explicitly authorizes storage or publication.
- Never push private manual extracts to a public repository.

## Update Workflow

1. Read the existing diagnosis record and schema.
2. Check whether the update concerns public medical context or private underwriting rules.
3. For public context, add source IDs to `source_ids` and update `base_data`.
4. For private reinsurer manual content, write only to local/private records unless the user confirms publication rights.
5. Do not overwrite human-authored `underwriting_rules`.
6. Put machine-generated suggestions in `underwriting_rules.ai_suggestions`.
7. Update `updated_by` and `last_updated`.
8. Add a human-readable version/audit note.

## Schema Requirements

Each diagnosis should follow this shape:

```json
{
  "id": "String UUID",
  "category_body_part": "String",
  "age_group": ["child", "young_adult", "middle_age", "older_adult"],
  "gender": "unisex | male | female",
  "severity": "String",
  "diagnosis_name": { "en": "String", "zh": "String" },
  "source_type": "public_seed | private",
  "source_ids": ["String"],
  "base_data": {
    "causes": { "en": "String", "zh": "String" },
    "risks": { "en": "String", "zh": "String" },
    "treatments": { "en": "String", "zh": "String" }
  },
  "underwriting_rules": {
    "requirements": "String",
    "decisions_reference": "String",
    "ai_suggestions": "String"
  },
  "offers": [
    {
      "stage": "String",
      "life": "String",
      "ci": "String",
      "notes": "String"
    }
  ],
  "updated_by": "Human | AI_Agent_V1 | PublicSeed",
  "last_updated": "ISO timestamp"
}
```

## Writing Style

- Use professional insurance medicine wording.
- Focus risk concerns on mortality, morbidity, recurrence, complications, and claim probability.
- Avoid absolute underwriting decisions unless a specific authorized manual supports them.
- Keep bilingual fields aligned in meaning.
- Prefer concise Markdown-compatible text for long notes.

## Private Manual Extraction Plan

When the user logs in and provides manual access:

1. Extract disease names, requirements, Life offers, CI offers, stage definitions, and manual effective dates.
2. Store extracted rows as private local JSON first.
3. Ask the user to review before merging into the local database.
4. Keep source attribution private, for example `source_type: "private"` and an internal manual name.
5. Export a snapshot only when the user requests it.

## Safety Rules

- Human edits have priority over AI suggestions.
- Do not fabricate reinsurer requirements.
- Do not summarize private manuals into a public GitHub repository without explicit permission.
- Use public source citations for public risk context.
