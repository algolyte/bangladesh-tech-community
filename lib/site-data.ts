import fs from "node:fs";
import path from "node:path";

import {
  generatedDashboardDir,
  generatedDevelopersDir,
  generatedDir
} from "@/lib/paths";
import type { NormalizedDeveloper } from "@/lib/schema";
import { computeRelatedDevelopers } from "@/lib/metrics";

type DevelopersIndex = {
  updated_at: string;
  total: number;
  filters: {
    roles: string[];
    availability: string[];
    locations: string[];
    skills: string[];
  };
  developers: Array<{
    slug: string;
    name: string;
    headline: string;
    primary_role: string;
    location: string;
    country: string;
    experience_years: number;
    experience_band: string;
    availability: string;
    remote: boolean;
    top_skills: string[];
    profile_completeness: number;
    has_github: boolean;
    has_portfolio: boolean;
    github_activity_score: number | null;
    updated_at: string;
  }>;
};

type DashboardData = {
  summary: Record<string, number>;
  roles: Array<{ label: string; count: number }>;
  skills: Array<{ label: string; count: number }>;
  availability: Array<{ label: string; count: number }>;
  experience_bands: Array<{ label: string; count: number }>;
  locations: Array<{ label: string; count: number }>;
  github: {
    average_activity_score: number;
    recently_active: number;
  };
  completeness: {
    average: number;
    bands: Array<{ label: string; count: number }>;
  };
  recent_additions: Array<{
    slug: string;
    name: string;
    headline: string;
    updated_at: string;
  }>;
  updated_at: string;
};

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getDevelopersIndex(): DevelopersIndex {
  return readJson(path.join(generatedDir, "developers.index.json"), {
    updated_at: "",
    total: 0,
    filters: {
      roles: [],
      availability: [],
      locations: [],
      skills: []
    },
    developers: []
  });
}

export function getAllDevelopers(): NormalizedDeveloper[] {
  if (!fs.existsSync(generatedDevelopersDir)) {
    return [];
  }

  return fs
    .readdirSync(generatedDevelopersDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) =>
      JSON.parse(fs.readFileSync(path.join(generatedDevelopersDir, file), "utf8"))
    ) as NormalizedDeveloper[];
}

export function getDeveloper(slug: string): NormalizedDeveloper | null {
  const filePath = path.join(generatedDevelopersDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as NormalizedDeveloper;
}

export function getDashboardData(): DashboardData {
  return readJson(path.join(generatedDashboardDir, "dashboard.json"), {
    summary: {
      total_developers: 0,
      total_roles: 0,
      total_skills: 0,
      open_to_opportunities: 0,
      remote_friendly: 0,
      profiles_with_github: 0,
      profiles_with_portfolio: 0
    },
    roles: [],
    skills: [],
    availability: [],
    experience_bands: [],
    locations: [],
    github: {
      average_activity_score: 0,
      recently_active: 0
    },
    completeness: {
      average: 0,
      bands: []
    },
    recent_additions: [],
    updated_at: ""
  });
}

export function getRelatedDevelopers(slug: string): NormalizedDeveloper[] {
  const developers = getAllDevelopers();
  const current = developers.find((developer) => developer.slug === slug);
  if (!current) {
    return [];
  }

  return computeRelatedDevelopers(current, developers);
}
