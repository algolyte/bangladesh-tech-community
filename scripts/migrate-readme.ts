import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import { profilesDir } from "@/lib/paths";
import { parseGitHubUsername, slugify } from "@/lib/utils";
import type { SubmittedProfileInput } from "@/lib/schema";

type LegacyEntry = {
  name: string;
  headline: string;
  primary_role: string;
  experience_years: number;
  location: string;
  availability: string;
  remote: boolean;
  skills: string[];
  github: string | null;
  linkedin: string | null;
};

const AVAILABILITY_SET = new Set([
  "available_now",
  "open_to_opportunities",
  "available_in_2_weeks",
  "not_available",
  "unknown"
]);

function getField(section: string, label: string): string | null {
  const re = new RegExp(`^- \\*\\*${label}\\*\\*: (.+)$`, "m");
  const match = section.match(re);
  return match?.[1]?.trim() ?? null;
}

function parseEntry(rawSection: string): LegacyEntry | null {
  const lines = rawSection.split("\n");
  const firstLine = lines[0]?.trim();
  if (!firstLine?.startsWith("### ")) {
    return null;
  }

  const name = firstLine.replace(/^###\s+/, "").trim();
  const headline = getField(rawSection, "Headline") ?? "";
  const primaryRole = getField(rawSection, "Primary Role") ?? "";
  const experienceRaw = getField(rawSection, "Experience") ?? "0";
  const location = getField(rawSection, "Location") ?? "Dhaka, Bangladesh";
  const availability = (getField(rawSection, "Availability") ?? "unknown").trim();
  const remote = (getField(rawSection, "Remote") ?? "No").toLowerCase() === "yes";
  const skillsRaw = getField(rawSection, "Skills") ?? "";
  const github = getField(rawSection, "GitHub");
  const linkedin = getField(rawSection, "LinkedIn");

  if (!name || !headline || !primaryRole || !skillsRaw) {
    return null;
  }

  const experienceMatch = experienceRaw.match(/[0-9]+(?:\.[0-9]+)?/);
  const experienceYears = experienceMatch ? Number(experienceMatch[0]) : 0;
  const skills = skillsRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    name,
    headline,
    primary_role: primaryRole,
    experience_years: experienceYears,
    location,
    availability,
    remote,
    skills,
    github: github?.startsWith("http") ? github : null,
    linkedin: linkedin?.startsWith("http") ? linkedin : null
  };
}

function normalizeAvailability(input: string): SubmittedProfileInput["availability"] {
  const value = input.trim();
  if (AVAILABILITY_SET.has(value)) {
    return value as SubmittedProfileInput["availability"];
  }
  return "unknown";
}

function buildProfile(entry: LegacyEntry): SubmittedProfileInput {
  const today = new Date().toISOString().slice(0, 10);
  const username = parseGitHubUsername(entry.github)?.toLowerCase() ?? null;

  return {
    version: 1,
    name: entry.name,
    email: null,
    headline: entry.headline,
    bio: null,
    primary_role: entry.primary_role,
    secondary_roles: [],
    experience_years: entry.experience_years,
    location: entry.location,
    country: entry.location.includes("Bangladesh") ? "Bangladesh" : "Unknown",
    timezone: "Asia/Dhaka",
    availability: normalizeAvailability(entry.availability),
    preferred_work_type: entry.remote ? "remote" : "onsite",
    remote: entry.remote,
    skills: entry.skills,
    current_company: null,
    links: {
      github: entry.github,
      linkedin: entry.linkedin,
      portfolio: null,
      gitlab: null,
      stackoverflow: null,
      blog: null
    },
    profile_status: "active",
    last_updated_by_user: today
  };
}

function toFileName(entry: LegacyEntry): string {
  const username = parseGitHubUsername(entry.github)?.toLowerCase() ?? null;
  const slug = username ?? slugify(entry.name);
  return `${slug}.yml`;
}

function parseLegacyReadme(readme: string): LegacyEntry[] {
  return readme
    .split(/^###\s+/m)
    .slice(1)
    .map((chunk) => `### ${chunk}`)
    .map(parseEntry)
    .filter((item): item is LegacyEntry => Boolean(item));
}

function main(): void {
  const readmePath = path.join(process.cwd(), "README.md");
  if (!fs.existsSync(readmePath)) {
    throw new Error("README.md not found.");
  }

  const readme = fs.readFileSync(readmePath, "utf8");
  const entries = parseLegacyReadme(readme);
  if (entries.length === 0) {
    console.log("No legacy README profile entries found. Nothing to migrate.");
    return;
  }

  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const fileName = toFileName(entry);
    const filePath = path.join(profilesDir, fileName);

    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }

    const profile = buildProfile(entry);
    fs.writeFileSync(
      filePath,
      yaml.dump(profile, { lineWidth: 120, noRefs: true, quotingType: '"' }),
      "utf8"
    );
    created += 1;
  }

  console.log(`README migration completed. Created ${created} files, skipped ${skipped} existing files.`);
}

main();
