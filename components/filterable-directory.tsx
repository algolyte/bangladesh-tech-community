"use client";

import { useMemo, useState } from "react";

import { DeveloperCard } from "@/components/developer-card";

type DirectoryIndex = {
  filters: {
    roles: string[];
    availability: string[];
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

export function FilterableDirectory({ index }: { index: DirectoryIndex }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [availability, setAvailability] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [githubOnly, setGitHubOnly] = useState(false);
  const [portfolioOnly, setPortfolioOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return index.developers.filter((developer) => {
      const haystack = [
        developer.name,
        developer.headline,
        developer.primary_role,
        developer.location,
        ...developer.top_skills
      ]
        .join(" ")
        .toLowerCase();

      if (normalizedQuery && !haystack.includes(normalizedQuery)) {
        return false;
      }
      if (role && developer.primary_role !== role) {
        return false;
      }
      if (availability && developer.availability !== availability) {
        return false;
      }
      if (remoteOnly && !developer.remote) {
        return false;
      }
      if (githubOnly && !developer.has_github) {
        return false;
      }
      if (portfolioOnly && !developer.has_portfolio) {
        return false;
      }
      return true;
    });
  }, [availability, githubOnly, index.developers, portfolioOnly, query, remoteOnly, role]);

  return (
    <div className="space-y-8">
      <div className="surface rounded-3xl p-6 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr,1fr]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, role, skill, or location"
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none placeholder:text-black/35"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none"
          >
            <option value="">All roles</option>
            {index.filters.roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none"
          >
            <option value="">All availability</option>
            {index.filters.availability.map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="pill cursor-pointer gap-2">
            <input type="checkbox" checked={remoteOnly} onChange={() => setRemoteOnly((value) => !value)} />
            Remote only
          </label>
          <label className="pill cursor-pointer gap-2">
            <input type="checkbox" checked={githubOnly} onChange={() => setGitHubOnly((value) => !value)} />
            GitHub only
          </label>
          <label className="pill cursor-pointer gap-2">
            <input type="checkbox" checked={portfolioOnly} onChange={() => setPortfolioOnly((value) => !value)} />
            Portfolio only
          </label>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((developer) => (
          <DeveloperCard key={developer.slug} developer={developer} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="surface rounded-3xl p-10 text-center text-black/55 shadow-soft">
          No profiles matched the current filters.
        </div>
      ) : null}
    </div>
  );
}
