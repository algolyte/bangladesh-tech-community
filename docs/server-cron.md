# Server Cron Usage

This repository is designed to run on a Linux server with a simple cron-based sync loop.

## Example Commands

```bash
git pull origin main
npm ci
npm run sync
npm run build:web
```

The static site output is written to `out/`.

## Serve Exported Output

Because this project uses Next.js static export mode, serve the generated `out/` directory instead of `next start`.

```bash
npx serve@latest out -l 3000
```

## Environment

Create `.env` from `.env.example` and set:

- `GITHUB_TOKEN`: optional but recommended for GitHub API rate limits.
- `SYNC_BASE_URL`: optional placeholder for future deploy hooks.

## Script

Use `scripts/deploy-example.sh` as a starting point.

## Example Cron Entry

```cron
30 2 * * * cd /srv/bangladesh-tech-community && /usr/bin/env bash scripts/deploy-example.sh >> /var/log/bangladesh-tech-community.log 2>&1
```
