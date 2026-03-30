# Contributing

This repository is a static directory of Bangladeshi tech professionals. The source of truth is now:

`profiles/*.yml`

## Quick start

1. Fork the repository.
2. Create a new branch.
3. Copy `profiles/_template.yml` to `profiles/<your-github-username>.yml`.
4. Fill in your information.
5. Run `npm install` and `npm run validate`.
6. Open a pull request.

## Profile rules

- One contributor profile per file.
- Filename must match `slug`.
- If you have a GitHub profile, use your GitHub username as the filename and slug.
- If you do not have GitHub, use a slugified version of your name and set `slug_source: name`.
- `version: 1` is required.
- `availability` must be one of:
  - `available_now`
  - `open_to_opportunities`
  - `available_in_2_weeks`
  - `not_available`
  - `unknown`
- `skills` must be an array of strings.
- `experience_years` must be numeric.
- LinkedIn URLs are validated but never scraped.

## What gets enriched automatically

- GitHub username, public profile metadata, public repos, languages, repo activity, and detected GitHub skills.
- Portfolio title, meta description, canonical URL, OG image, and a few lightweight link signals.

## What does not get scraped

- LinkedIn
- Private repositories
- Deep portfolio crawling

## Local commands

```bash
npm run validate
npm run build:submitted
npm run enrich:github
npm run enrich:portfolio
npm run build:data
npm run build:dashboard
npm run sync
```

## Generated files

Do not edit generated JSON by hand unless a maintainer explicitly asks for it.

- `generated/developers/<slug>.json`
- `generated/developers.index.json`
- `generated/dashboard/dashboard.json`

## Notes for maintainers

- Keep manual submitted data and machine-enriched data separate.
- Preserve missing or ambiguous legacy values honestly.
- Avoid adding infrastructure that makes contribution harder.
