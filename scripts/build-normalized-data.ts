import fs from "node:fs";
import path from "node:path";

import { ensureDir, removeGeneratedJsonFiles, writeJson } from "@/lib/fs";
import { computeProfileCompleteness, computeTopSkills, detectRoleKeywords, getExperienceBand } from "@/lib/metrics";
import {
  generatedDevelopersDir,
  generatedEnrichedGitHubDir,
  generatedEnrichedPortfolioDir
} from "@/lib/paths";
import { loadAllProfiles } from "@/lib/profiles";
import type {
  GitHubEnrichment,
  NormalizedDeveloper,
  PortfolioEnrichment,
  SyncStatus
} from "@/lib/schema";
import { normalizeSkillList } from "@/lib/skills";
import { toIsoTimestamp } from "@/lib/utils";

type EnrichmentWrapper<T> = {
  slug: string;
  status: SyncStatus;
  synced_at: string | null;
  error: string | null;
  data: T | null;
};

function readEnrichment<T>(dirPath: string, slug: string): EnrichmentWrapper<T> | null {
  const filePath = path.join(dirPath, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as EnrichmentWrapper<T>;
}

function buildDeveloperIndex(developers: NormalizedDeveloper[]) {
  return {
    updated_at: toIsoTimestamp(),
    total: developers.length,
    filters: {
      roles: [...new Set(developers.map((developer) => developer.submitted.primary_role))].sort(),
      availability: [...new Set(developers.map((developer) => developer.submitted.availability))].sort(),
      locations: [...new Set(developers.map((developer) => developer.submitted.location))].sort(),
      skills: [...new Set(developers.flatMap((developer) => developer.computed.top_skills))].sort()
    },
    developers: developers.map((developer) => ({
      slug: developer.slug,
      name: developer.submitted.name,
      headline: developer.submitted.headline,
      primary_role: developer.submitted.primary_role,
      location: developer.submitted.location,
      country: developer.submitted.country,
      experience_years: developer.submitted.experience_years,
      experience_band: developer.computed.experience_band,
      availability: developer.submitted.availability,
      remote: developer.submitted.remote,
      top_skills: developer.computed.top_skills,
      profile_completeness: developer.computed.profile_completeness,
      has_github: Boolean(developer.submitted.links.github),
      has_portfolio: Boolean(developer.submitted.links.portfolio),
      github_activity_score: developer.enriched.github?.recent_activity_score ?? null,
      updated_at: developer.updated_at
    }))
  };
}

function main(): void {
  const loadedProfiles = loadAllProfiles();
  ensureDir(generatedDevelopersDir);
  removeGeneratedJsonFiles(generatedDevelopersDir);

  const developers: NormalizedDeveloper[] = loadedProfiles.map(({ profile }) => {
    const github = readEnrichment<GitHubEnrichment>(generatedEnrichedGitHubDir, profile.slug);
    const portfolio = readEnrichment<PortfolioEnrichment>(
      generatedEnrichedPortfolioDir,
      profile.slug
    );

    const githubData = github?.data ?? null;
    const portfolioData = portfolio?.data ?? null;
    const detectedSkills = normalizeSkillList(githubData?.detected_skills ?? []);

    const normalized: NormalizedDeveloper = {
      slug: profile.slug,
      slug_source: profile.slug_source,
      submitted: profile,
      enriched: {
        github: githubData,
        portfolio: portfolioData
      },
      computed: {
        top_skills: computeTopSkills(profile.skills, detectedSkills),
        detected_skills: detectedSkills,
        profile_completeness: computeProfileCompleteness(profile, githubData, Boolean(portfolioData)),
        experience_band: getExperienceBand(profile.experience_years),
        role_keywords: detectRoleKeywords(profile.primary_role, profile.secondary_roles)
      },
      sync: {
        github_last_synced_at: github?.synced_at ?? null,
        portfolio_last_synced_at: portfolio?.synced_at ?? null,
        github_status: github?.status ?? "pending",
        portfolio_status: portfolio?.status ?? "pending",
        notes: [github?.error, portfolio?.error].filter(Boolean) as string[]
      },
      updated_at: toIsoTimestamp()
    };

    writeJson(path.join(generatedDevelopersDir, `${profile.slug}.json`), normalized);
    return normalized;
  });

  const index = buildDeveloperIndex(
    developers.sort((a, b) => a.submitted.name.localeCompare(b.submitted.name))
  );
  writeJson(path.join(generatedDevelopersDir, "..", "developers.index.json"), index);
  console.log(`Wrote ${developers.length} normalized developer records.`);
}

main();
