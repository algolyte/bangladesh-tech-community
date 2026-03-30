import fs from "node:fs";
import path from "node:path";

import { ensureDir, writeJson } from "@/lib/fs";
import { generatedDashboardDir, generatedDevelopersDir } from "@/lib/paths";
import type { NormalizedDeveloper } from "@/lib/schema";
import { toIsoTimestamp } from "@/lib/utils";

type Bucket = {
  label: string;
  count: number;
};

function countBy(items: string[]): Bucket[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

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
  ensureDir(generatedDashboardDir);

  const dashboard = {
    summary: {
      total_developers: developers.length,
      total_roles: new Set(developers.map((developer) => developer.submitted.primary_role)).size,
      total_skills: new Set(developers.flatMap((developer) => developer.computed.top_skills)).size,
      open_to_opportunities: developers.filter(
        (developer) => developer.submitted.availability === "open_to_opportunities"
      ).length,
      remote_friendly: developers.filter((developer) => developer.submitted.remote).length,
      profiles_with_github: developers.filter((developer) => developer.submitted.links.github).length,
      profiles_with_portfolio: developers.filter((developer) => developer.submitted.links.portfolio).length
    },
    roles: countBy(developers.map((developer) => developer.submitted.primary_role)).slice(0, 12),
    skills: countBy(developers.flatMap((developer) => developer.computed.top_skills)).slice(0, 20),
    availability: countBy(developers.map((developer) => developer.submitted.availability)),
    experience_bands: countBy(developers.map((developer) => developer.computed.experience_band)),
    locations: countBy(developers.map((developer) => developer.submitted.location)).slice(0, 12),
    github: {
      average_activity_score: developers.length
        ? Math.round(
            developers.reduce(
              (sum, developer) => sum + (developer.enriched.github?.recent_activity_score ?? 0),
              0
            ) / developers.length
          )
        : 0,
      recently_active: developers.filter((developer) => {
        const lastPush = developer.enriched.github?.last_push_at;
        return lastPush && Date.now() - new Date(lastPush).getTime() < 90 * 86_400_000;
      }).length
    },
    completeness: {
      average: developers.length
        ? Math.round(
            developers.reduce((sum, developer) => sum + developer.computed.profile_completeness, 0) /
              developers.length
          )
        : 0,
      bands: [
        {
          label: "80-100%",
          count: developers.filter((developer) => developer.computed.profile_completeness >= 80).length
        },
        {
          label: "60-79%",
          count: developers.filter(
            (developer) =>
              developer.computed.profile_completeness >= 60 &&
              developer.computed.profile_completeness < 80
          ).length
        },
        {
          label: "0-59%",
          count: developers.filter((developer) => developer.computed.profile_completeness < 60).length
        }
      ]
    },
    recent_additions: developers
      .slice()
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 6)
      .map((developer) => ({
        slug: developer.slug,
        name: developer.submitted.name,
        headline: developer.submitted.headline,
        updated_at: developer.updated_at
      })),
    updated_at: toIsoTimestamp()
  };

  writeJson(path.join(generatedDashboardDir, "dashboard.json"), dashboard);
  console.log("Wrote dashboard.json");
}

main();
