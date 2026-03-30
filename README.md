# Bangladesh Tech Community

Static developer directory and public ecosystem dashboard for Bangladeshi tech professionals.

- Browse the site: `/developers`, `/dashboard`, `/contribute`
- Source of truth: `profiles/*.yml`
- Generated data: `generated/`
- Contributor guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Data flow: [docs/data-flow.md](docs/data-flow.md)
- Server cron guide: [docs/server-cron.md](docs/server-cron.md)

## How It Works

1. Contributors add or update one file in `profiles/`.
2. Validation and enrichment scripts build deterministic JSON artifacts in `generated/`.
3. The Next.js site reads generated data and renders a static directory and dashboard.

## Community Snapshot

- Total developer profiles: 19
- Source files: `profiles/*.yml`
- Directory page: `/developers`

## Generated Data

Generated files are written to `generated`.
