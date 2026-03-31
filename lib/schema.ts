import { z } from "zod";

export const availabilityValues = [
  "available_now",
  "open_to_opportunities",
  "available_in_2_weeks",
  "not_available",
  "unknown"
] as const;

export const slugSourceValues = ["github", "name"] as const;
export const preferredWorkTypeValues = ["remote", "hybrid", "onsite", "flexible"] as const;
export const profileStatusValues = ["active", "inactive"] as const;

function hasHostname(url: string, matcher: (hostname: string) => boolean): boolean {
  try {
    const parsed = new URL(url);
    return matcher(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

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

const nullableGitHubUrlSchema = nullableUrlSchema.refine((value) => {
  if (!value) {
    return true;
  }
  return hasHostname(value, (hostname) => hostname === "github.com" || hostname === "www.github.com");
}, "GitHub URL must use github.com.");

const nullableLinkedInUrlSchema = nullableUrlSchema.refine((value) => {
  if (!value) {
    return true;
  }
  return hasHostname(value, (hostname) => hostname === "linkedin.com" || hostname.endsWith(".linkedin.com"));
}, "LinkedIn URL must use linkedin.com.");

const dateOnlySchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.");

export const companySchema = z
  .object({
    name: z.string().trim().min(1),
    url: nullableUrlSchema.optional().default(null)
  })
  .nullable()
  .default(null);

export const linksSchema = z.object({
  github: nullableGitHubUrlSchema.optional().default(null),
  linkedin: nullableLinkedInUrlSchema.optional().default(null),
  portfolio: nullableUrlSchema.optional().default(null),
  gitlab: nullableUrlSchema.optional().default(null),
  stackoverflow: nullableUrlSchema.optional().default(null),
  blog: nullableUrlSchema.optional().default(null)
});

export const submittedProfileInputSchema = z.object({
  version: z.literal(1),
  name: z.string().trim().min(2),
  email: nullableEmailSchema.optional().default(null),
  headline: z.string().trim().min(2),
  bio: z.string().trim().min(2).nullable().optional().default(null),
  primary_role: z.string().trim().min(2),
  secondary_roles: z.array(z.string().trim().min(1)).default([]),
  experience_years: z.number().min(0),
  location: z.string().trim().min(2),
  country: z.string().trim().min(2),
  timezone: z.string().trim().min(2),
  availability: z.enum(availabilityValues),
  preferred_work_type: z.enum(preferredWorkTypeValues),
  remote: z.boolean(),
  skills: z.array(z.string().trim().min(1)).min(1),
  current_company: companySchema,
  links: linksSchema,
  profile_status: z.enum(profileStatusValues),
  last_updated_by_user: dateOnlySchema
});

export type SubmittedProfileInput = z.infer<typeof submittedProfileInputSchema>;
export type SubmittedProfile = SubmittedProfileInput & {
  slug: string;
  slug_source: "github" | "name";
};

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
  submitted: SubmittedProfileInput;
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
