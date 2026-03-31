import fs from "node:fs";
import path from "node:path";

import { generatedDir, generatedDevelopersDir } from "@/lib/paths";
import type { NormalizedDeveloper } from "@/lib/schema";

function loadDevelopers(): NormalizedDeveloper[] {
  return fs
    .readdirSync(generatedDevelopersDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) =>
      JSON.parse(fs.readFileSync(path.join(generatedDevelopersDir, file), "utf8"))
    ) as NormalizedDeveloper[];
}

function main(): void {
  const developers = loadDevelopers();
  const totalDevelopers = developers.length;

  const readme = `# Bangladesh Tech Community

Static developer directory and public ecosystem dashboard for Bangladeshi tech professionals.

- Browse the site: \`/developers\`, \`/dashboard\`, \`/contribute\`
- Source of truth: \`profiles/*.yml\`
- Generated data: \`generated/\`
- Contributor guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Data flow: [docs/data-flow.md](docs/data-flow.md)
- Server cron guide: [docs/server-cron.md](docs/server-cron.md)

## How It Works

1. Contributors add or update one file in \`profiles/\`.
2. Validation and enrichment scripts build deterministic JSON artifacts in \`generated/\`.
3. The Next.js site reads generated data and renders a static directory and dashboard.

## Contributor Format

- Create \`profiles/<github-username>.yml\` when you have a GitHub profile.
- Do not add \`slug\` or \`slug_source\` manually. They are computed automatically.
- If \`links.github\` is missing, slug falls back to slugified \`name\`.
- LinkedIn URLs are stored and validated only. They are never scraped.

## Community Snapshot

- Total developer profiles: ${totalDevelopers}
- Source files: \`profiles/*.yml\`
- Directory page: \`/developers\`

## Generated Data

Generated files are written to \`${path.relative(process.cwd(), generatedDir)}\`.
`;

  fs.writeFileSync(path.join(process.cwd(), "README.md"), readme.trim() + "\n", "utf8");
  console.log("README.md updated.");
}

main();
