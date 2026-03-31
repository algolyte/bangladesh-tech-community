# Data Flow

`profiles/*.yml` is the source of truth for all contributor-submitted profile data.

## Pipeline

1. `npm run validate`  
   Validates YAML files against the schema and filename/computed-slug rules.
2. `npm run build:submitted`  
   Produces `generated/submitted/profiles.json`.
3. `npm run enrich:github`  
   Fetches public GitHub metadata into `generated/enriched/github/*.json`.
4. `npm run enrich:portfolio`  
   Fetches lightweight portfolio metadata into `generated/enriched/portfolio/*.json`.
5. `npm run build:data`  
   Produces normalized developer records in `generated/developers/*.json` and `generated/developers.index.json`.
6. `npm run build:dashboard`  
   Produces `generated/dashboard/dashboard.json`.
7. `npm run generate:readme`  
   Rebuilds the visitor-facing README directory snapshot from generated data.

## Rules

- LinkedIn URLs are validated and stored only. They are never scraped.
- Slug and slug source are computed automatically from GitHub URL (fallback: slugified name).
- Submitted data and enriched data remain separate.
- Generated files are deterministic and safe to rebuild anywhere.
- Missing fields stay missing instead of being guessed.
