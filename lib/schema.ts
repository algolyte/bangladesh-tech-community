import { z } from "zod";

export const availabilityValues = [
  "available_now",
  "open_to_opportunities",
  "available_in_2_weeks",
  "not_available",
  "unknown"
] as const;

export const slugSourceValues = ["github", "name"] as const;

const nullableUrlSchema = z
  .string()
  .trim()
  .url()
  .or(z.literal("").transform(() => null))
  .nullable()
  .transform((value) => value ?? null);

const nullableEmailSchema = z
  .string()
  .trim()
  .email()
  .or(z.literal("").transform(() => null))
  .nullable()
  .transform((value) => value ?? null);

export const companySchema = z
  .object({
    name: z.string().trim().min(1),
    url: nullableUrlSchema.optional().default(null)
  })
  .nullable()
  .default(null);

export const linksSchema = z.object({
  github: nullableUrlSchema.optional().default(null),
  linkedin: nullableUrlSchema.optional().default(null),
  portfolio: nullableUrlSchema.optional().default(null),
  gitlab: nullableUrlSchema.optional().default(null),
  stackoverflow: nullableUrlSchema.optional().default(null),
  blog: nullableUrlSchema.optional().default(null)
});

export const submittedProfileSchema = z.object({
  version: z.literal(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slug_source: z.enum(slugSourceValues),
  name: z.string().trim().min(2),
  email: nullableEmailSchema.optional().default(null),
  headline: z.string().trim().min(2),
  primary_role: z.string().trim().min(2),
  secondary_roles: z.array(z.string().trim().min(1)).default([]),
  experience_years: z.number().min(0),
  location: z.string().trim().min(2),
  country: z.string().trim().min(2),
  timezone: z.string().trim().min(2),
  availability: z.enum(availabilityValues),
  remote: z.boolean(),
  skills: z.array(z.string().trim().min(1)).min(1),
  current_company: companySchema,
  links: linksSchema
});

export type SubmittedProfile = z.infer<typeof submittedProfileSchema>;

export type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string | null;
  topics: string[];
};

export type GitHubEnrichment = {
  username: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  top_languages: string[];
  detected_skills: string[];
  recent_activity_score: number;
  last_push_at: string | null;
  top_repositories: GitHubRepo[];
};

export type PortfolioEnrichment = {
  url: string;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  keywords: string[];
  external_links: string[];
};

export type SyncStatus = "ok" | "skipped" | "error" | "pending";

export type NormalizedDeveloper = {
  slug: string;
  slug_source: "github" | "name";
  submitted: SubmittedProfile;
  enriched: {
    github: GitHubEnrichment | null;
    portfolio: PortfolioEnrichment | null;
  };
  computed: {
    top_skills: string[];
    detected_skills: string[];
    profile_completeness: number;
    experience_band: string;
    role_keywords: string[];
  };
  sync: {
    github_last_synced_at: string | null;
    portfolio_last_synced_at: string | null;
    github_status: SyncStatus;
    portfolio_status: SyncStatus;
    notes: string[];
  };
  updated_at: string;
};
