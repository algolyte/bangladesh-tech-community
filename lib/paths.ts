import path from "node:path";

export const rootDir = process.cwd();
export const profilesDir = path.join(rootDir, "profiles");
export const generatedDir = path.join(rootDir, "generated");
export const generatedSubmittedDir = path.join(generatedDir, "submitted");
export const generatedEnrichedGitHubDir = path.join(generatedDir, "enriched", "github");
export const generatedEnrichedPortfolioDir = path.join(generatedDir, "enriched", "portfolio");
export const generatedDevelopersDir = path.join(generatedDir, "developers");
export const generatedDashboardDir = path.join(generatedDir, "dashboard");
