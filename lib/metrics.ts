import type {
  GitHubEnrichment,
  NormalizedDeveloper,
  SubmittedProfile
} from "@/lib/schema";
import { normalizeSkillList } from "@/lib/skills";
import { uniqueSorted } from "@/lib/utils";

export function getExperienceBand(experienceYears: number): string {
  if (experienceYears < 1) {
    return "0-1 years";
  }
  if (experienceYears < 3) {
    return "1-3 years";
  }
  if (experienceYears < 5) {
    return "3-5 years";
  }
  if (experienceYears < 8) {
    return "5-8 years";
  }
  return "8+ years";
}

export function computeProfileCompleteness(
  submitted: SubmittedProfile,
  github: GitHubEnrichment | null,
  hasPortfolioMetadata: boolean
): number {
  const checks = [
    Boolean(submitted.name),
    Boolean(submitted.headline),
    Boolean(submitted.primary_role),
    submitted.skills.length > 0,
    Boolean(submitted.location),
    Boolean(submitted.links.github),
    Boolean(submitted.links.linkedin),
    Boolean(submitted.links.portfolio),
    submitted.experience_years > 0,
    Boolean(github),
    hasPortfolioMetadata
  ];

  const score = (checks.filter(Boolean).length / checks.length) * 100;
  return Math.round(score);
}

export function computeTopSkills(
  submittedSkills: string[],
  detectedSkills: string[]
): string[] {
  return uniqueSorted([...normalizeSkillList(submittedSkills), ...detectedSkills]).slice(
    0,
    8
  );
}

export function detectRoleKeywords(primaryRole: string, secondaryRoles: string[]): string[] {
  const words = [...primaryRole.split(/[^\w+.#-]+/), ...secondaryRoles.join(" ").split(/[^\w+.#-]+/)]
    .map((word) => word.trim())
    .filter((word) => word.length > 2);

  return uniqueSorted(words.map((word) => word.replace(/\.$/, ""))).slice(0, 10);
}

export function computeRelatedDevelopers(
  current: NormalizedDeveloper,
  others: NormalizedDeveloper[]
): NormalizedDeveloper[] {
  const skillSet = new Set(current.computed.top_skills);

  return [...others]
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const overlap = candidate.computed.top_skills.filter((skill) => skillSet.has(skill)).length;
      return { candidate, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.candidate.submitted.name.localeCompare(b.candidate.submitted.name))
    .slice(0, 3)
    .map((item) => item.candidate);
}
