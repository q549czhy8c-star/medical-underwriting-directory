# Data Schema

The canonical browser record is stored in local storage under `muw.records.v1`.

See `AI_AGENT_GUIDE.md` for the full JSON shape.

## Version Fields

- `appVersion`: interface and behavior version.
- `schemaVersion`: data structure version.
- `last_updated`: per-record ISO timestamp.
- `updated_by`: last actor to update the record.

## Public vs Private

- `source_type: "public_seed"` means the record can be committed publicly.
- `source_type: "private"` means the record may contain user-uploaded reinsurer manual content and should not be committed publicly.

## Source Registry

Public sources are stored in `data/sample-diagnoses.js` under `publicSources`. Diagnosis records reference them through `source_ids`.
