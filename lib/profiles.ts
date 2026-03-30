import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import { profilesDir } from "@/lib/paths";
import { submittedProfileSchema, type SubmittedProfile } from "@/lib/schema";
import { DEFAULT_COUNTRY, DEFAULT_TIMEZONE } from "@/lib/constants";
import { isLinkedInUrl, parseGitHubUsername, slugify } from "@/lib/utils";

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
  const profile = submittedProfileSchema.parse({
    country: DEFAULT_COUNTRY,
    timezone: DEFAULT_TIMEZONE,
    current_company: null,
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

  const basename = fileName.replace(/\.yml$/, "");
  if (profile.slug !== basename) {
    throw new Error(
      `${fileName}: slug "${profile.slug}" must match filename "${basename}".`
    );
  }

  const githubUsername = parseGitHubUsername(profile.links.github);
  if (profile.slug_source === "github" && !githubUsername) {
    throw new Error(`${fileName}: slug_source is github but links.github is missing or invalid.`);
  }

  if (githubUsername && profile.slug !== githubUsername.toLowerCase()) {
    throw new Error(
      `${fileName}: slug "${profile.slug}" must equal the GitHub username "${githubUsername.toLowerCase()}".`
    );
  }

  if (profile.slug_source === "name") {
    const expected = slugify(profile.name);
    if (profile.slug !== expected) {
      throw new Error(
        `${fileName}: slug_source is name, so slug must equal "${expected}".`
      );
    }
  }

  if (!isLinkedInUrl(profile.links.linkedin)) {
    throw new Error(`${fileName}: LinkedIn URL must use a linkedin.com hostname.`);
  }

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
