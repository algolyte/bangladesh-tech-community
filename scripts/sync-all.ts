import { execFileSync } from "node:child_process";

const commands = [
  ["node", ["--import", "tsx", "scripts/validate-profiles.ts"]],
  ["node", ["--import", "tsx", "scripts/build-submitted-json.ts"]],
  ["node", ["--import", "tsx", "scripts/enrich-github.ts"]],
  ["node", ["--import", "tsx", "scripts/enrich-portfolio.ts"]],
  ["node", ["--import", "tsx", "scripts/build-normalized-data.ts"]],
  ["node", ["--import", "tsx", "scripts/build-dashboard-data.ts"]],
  ["node", ["--import", "tsx", "scripts/generate-readme.ts"]]
] as const;

for (const [command, args] of commands) {
  execFileSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
}
