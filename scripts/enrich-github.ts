import fs from "node:fs";
import path from "node:path";

import { ensureDir, writeJson } from "@/lib/fs";
import { generatedEnrichedGitHubDir } from "@/lib/paths";
import { loadAllProfiles } from "@/lib/profiles";
import type { GitHubEnrichment, GitHubRepo } from "@/lib/schema";
import { parseGitHubUsername, toIsoTimestamp } from "@/lib/utils";

type GitHubUserResponse = {
  login: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
};

type GitHubRepositoryResponse = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string | null;
  fork: boolean;
  topics?: string[];
  languages_url: string;
};

const curatedTopicMap = new Map<string, string>([
  ["aws", "AWS"],
  ["azure", "Azure"],
  ["csharp", "C#"],
  ["cpp", "C++"],
  ["django", "Django"],
  ["docker", "Docker"],
  ["dotnet", ".NET"],
  ["express", "Express"],
  ["fastapi", "FastAPI"],
  ["flask", "Flask"],
  ["go", "Go"],
  ["java", "Java"],
  ["javascript", "JavaScript"],
  ["kafka", "Kafka"],
  ["kotlin", "Kotlin"],
  ["kubernetes", "Kubernetes"],
  ["mongodb", "MongoDB"],
  ["mysql", "MySQL"],
  ["nestjs", "NestJS"],
  ["nextjs", "Next.js"],
  ["nodejs", "Node.js"],
  ["opensearch", "OpenSearch"],
  ["postgresql", "PostgreSQL"],
  ["python", "Python"],
  ["quarkus", "Quarkus"],
  ["rabbitmq", "RabbitMQ"],
  ["react", "React"],
  ["redis", "Redis"],
  ["spring", "Spring"],
  ["spring-boot", "Spring Boot"],
  ["tailwindcss", "Tailwind CSS"],
  ["typescript", "TypeScript"]
]);

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

function scoreRepoActivity(repo: GitHubRepositoryResponse): number {
  const pushedAt = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;
  const daysAgo = pushedAt ? Math.max(0, (Date.now() - pushedAt) / 86_400_000) : 365;
  const recencyWeight = Math.max(5, 100 - daysAgo);
  return recencyWeight + repo.stargazers_count * 3 + repo.forks_count * 2;
}

async function buildGitHubEnrichment(username: string): Promise<GitHubEnrichment> {
  const user = await fetchJson<GitHubUserResponse>(`https://api.github.com/users/${username}`);
  const repos = await fetchJson<GitHubRepositoryResponse[]>(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  );

  const nonForkRepos = repos.filter((repo) => !repo.fork);
  const sortedRepos = [...nonForkRepos].sort((a, b) => scoreRepoActivity(b) - scoreRepoActivity(a));
  const topRepositories = sortedRepos.slice(0, 6);

  const languageWeights = new Map<string, number>();
  const detectedSkills = new Set<string>();

  for (const repo of topRepositories) {
    if (repo.language) {
      languageWeights.set(
        repo.language,
        (languageWeights.get(repo.language) ?? 0) + scoreRepoActivity(repo)
      );
      detectedSkills.add(repo.language);
    }

    for (const topic of repo.topics ?? []) {
      const canonicalTopic = curatedTopicMap.get(topic.toLowerCase());
      if (canonicalTopic) {
        detectedSkills.add(canonicalTopic);
      }
    }
  }

  const topLanguages = [...languageWeights.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([language]) => language)
    .slice(0, 8);

  const lastPushAt =
    sortedRepos.map((repo) => repo.pushed_at).filter(Boolean).sort().reverse()[0] ?? null;

  const recentActivityScore = Math.min(
    100,
    Math.round(sortedRepos.slice(0, 10).reduce((sum, repo) => sum + scoreRepoActivity(repo), 0) / 10)
  );

  const normalizedTopRepos: GitHubRepo[] = topRepositories.map((repo) => ({
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    pushed_at: repo.pushed_at,
    topics: repo.topics ?? []
  }));

  return {
    username: user.login.toLowerCase(),
    name: user.name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    company: user.company,
    blog: user.blog,
    location: user.location,
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    top_languages: topLanguages,
    detected_skills: [...detectedSkills].sort((a, b) => a.localeCompare(b)).slice(0, 12),
    recent_activity_score: recentActivityScore,
    last_push_at: lastPushAt,
    top_repositories: normalizedTopRepos
  };
}

async function main(): Promise<void> {
  const profiles = loadAllProfiles();
  ensureDir(generatedEnrichedGitHubDir);

  for (const { profile } of profiles) {
    const username = parseGitHubUsername(profile.links.github);
    const outputPath = path.join(generatedEnrichedGitHubDir, `${profile.slug}.json`);

    if (!username) {
      writeJson(outputPath, {
        slug: profile.slug,
        status: "skipped",
        synced_at: null,
        error: "No GitHub profile URL provided.",
        data: null
      });
      continue;
    }

    try {
      const data = await buildGitHubEnrichment(username);
      writeJson(outputPath, {
        slug: profile.slug,
        status: "ok",
        synced_at: toIsoTimestamp(),
        error: null,
        data
      });
      console.log(`Enriched GitHub for ${profile.slug}`);
    } catch (error) {
      const previous =
        fs.existsSync(outputPath)
          ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
          : null;
      writeJson(outputPath, {
        slug: profile.slug,
        status: previous?.data ? "ok" : "error",
        synced_at: previous?.synced_at ?? null,
        error: error instanceof Error ? error.message : "Unknown GitHub enrichment error",
        data: previous?.data ?? null
      });
      console.error(`GitHub enrichment failed for ${profile.slug}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
