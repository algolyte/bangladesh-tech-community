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

function buildDeveloperMarkdown(developer: NormalizedDeveloper): string {
  const github = developer.submitted.links.github
    ? `- **GitHub**: ${developer.submitted.links.github}`
    : "- **GitHub**: Not provided";
  const linkedin = developer.submitted.links.linkedin
    ? `- **LinkedIn**: ${developer.submitted.links.linkedin}`
    : "- **LinkedIn**: Not provided";

  return [
    `### ${developer.submitted.name}`,
    `- **Headline**: ${developer.submitted.headline}`,
    `- **Primary Role**: ${developer.submitted.primary_role}`,
    `- **Experience**: ${developer.submitted.experience_years} years`,
    `- **Location**: ${developer.submitted.location}`,
    `- **Availability**: ${developer.submitted.availability}`,
    `- **Remote**: ${developer.submitted.remote ? "Yes" : "No"}`,
    `- **Skills**: ${developer.submitted.skills.join(", ")}`,
    github,
    linkedin
  ].join("\n");
}

function main(): void {
  const developers = loadDevelopers().sort((a, b) =>
    a.submitted.name.localeCompare(b.submitted.name)
  );

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

## Current Directory

${developers.map(buildDeveloperMarkdown).join("\n\n")}

## Generated Data

Generated files are written to \`${path.relative(process.cwd(), generatedDir)}\`.
`;

  fs.writeFileSync(path.join(process.cwd(), "README.md"), readme.trim() + "\n", "utf8");
  console.log("README.md updated.");
}

main();
