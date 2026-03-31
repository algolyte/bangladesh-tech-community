import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import { profilesDir } from "@/lib/paths";
import { submittedProfileInputSchema, type SubmittedProfile } from "@/lib/schema";
import { DEFAULT_COUNTRY, DEFAULT_TIMEZONE } from "@/lib/constants";
import { parseGitHubUsername, slugify } from "@/lib/utils";

export type LoadedProfileFile = {
  filePath: string;
  fileName: string;
  raw: unknown;
  profile: SubmittedProfile;
};

export function listProfileFiles(): string[] {
  if (!fs.existsSync(profilesDir)) {
    return [];
  }

  return fs
    .readdirSync(profilesDir)
    .filter((fileName) => fileName.endsWith(".yml") && !fileName.startsWith("_"))
    .sort();
}

export function loadProfileFile(fileName: string): LoadedProfileFile {
  const filePath = path.join(profilesDir, fileName);
  const rawContent = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(rawContent);
  const parsedObject =
    parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const submitted = submittedProfileInputSchema.parse({
    country: DEFAULT_COUNTRY,
    timezone: DEFAULT_TIMEZONE,
    preferred_work_type: "flexible",
    profile_status: "active",
    last_updated_by_user: new Date().toISOString().slice(0, 10),
    current_company: null,
    bio: null,
    secondary_roles: [],
    links: {
      github: null,
      linkedin: null,
      portfolio: null,
      gitlab: null,
      stackoverflow: null,
      blog: null
    },
    ...parsedObject
  });

  const githubUsername = parseGitHubUsername(submitted.links.github)?.toLowerCase() ?? null;
  const computedSlug = githubUsername ?? slugify(submitted.name);
  const computedSlugSource: "github" | "name" = githubUsername ? "github" : "name";

  const basename = fileName.replace(/\.yml$/, "");
  if (computedSlug !== basename) {
    throw new Error(
      `${fileName}: filename must match computed slug "${computedSlug}".`
    );
  }

  const profile: SubmittedProfile = {
    ...submitted,
    slug: computedSlug,
    slug_source: computedSlugSource
  };

  return {
    filePath,
    fileName,
    raw: parsedObject,
    profile
  };
}

export function loadAllProfiles(): LoadedProfileFile[] {
  const files = listProfileFiles();
  const loaded = files.map(loadProfileFile);
  const seenSlugs = new Set<string>();

  for (const item of loaded) {
    if (seenSlugs.has(item.profile.slug)) {
      throw new Error(`Duplicate slug detected: ${item.profile.slug}`);
    }
    seenSlugs.add(item.profile.slug);
  }

  return loaded;
}
