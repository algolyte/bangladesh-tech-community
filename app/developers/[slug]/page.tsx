import Link from "next/link";
import { notFound } from "next/navigation";

import { BarList } from "@/components/bar-list";
import { getAllDevelopers, getDeveloper, getRelatedDevelopers } from "@/lib/site-data";
import { readTimeLabel } from "@/lib/utils";

export function generateStaticParams() {
  return getAllDevelopers().map((developer) => ({ slug: developer.slug }));
}

export const dynamicParams = false;

export default async function DeveloperDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const developer = getDeveloper(slug);

  if (!developer) {
    notFound();
  }

  const related = getRelatedDevelopers(slug);
  const github = developer.enriched.github;
  const portfolio = developer.enriched.portfolio;

  return (
    <div className="shell py-12">
      <section className="surface rounded-[2rem] p-8 shadow-soft sm:p-10">
        <p className="eyebrow">{developer.submitted.primary_role}</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-5xl font-semibold tracking-tight">
              {developer.submitted.name}
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-black/65">{developer.submitted.headline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {developer.submitted.links.github ? (
              <a href={developer.submitted.links.github} className="pill" target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
            {developer.submitted.links.linkedin ? (
              <a href={developer.submitted.links.linkedin} className="pill" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            ) : null}
            {developer.submitted.links.portfolio ? (
              <a href={developer.submitted.links.portfolio} className="pill" target="_blank" rel="noreferrer">
                Portfolio
              </a>
            ) : null}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <p className="text-sm text-black/50">Location</p>
            <p className="mt-2 text-lg font-semibold">{developer.submitted.location}</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-black/50">Experience</p>
            <p className="mt-2 text-lg font-semibold">{developer.submitted.experience_years} years</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-black/50">Availability</p>
            <p className="mt-2 text-lg font-semibold">
              {developer.submitted.availability.replace(/_/g, " ")}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-black/50">Profile completeness</p>
            <p className="mt-2 text-lg font-semibold">{developer.computed.profile_completeness}%</p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-8">
          <div className="surface rounded-[2rem] p-8 shadow-soft">
            <p className="eyebrow">Submitted Data</p>
            <h2 className="section-title mt-4">Contributor-provided information</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {developer.submitted.skills.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
            {developer.submitted.current_company ? (
              <p className="mt-6 text-sm text-black/65">
                Current company:{" "}
                {developer.submitted.current_company.url ? (
                  <a
                    className="font-medium underline"
                    href={developer.submitted.current_company.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {developer.submitted.current_company.name}
                  </a>
                ) : (
                  developer.submitted.current_company.name
                )}
              </p>
            ) : null}
          </div>

          <div className="surface rounded-[2rem] p-8 shadow-soft">
            <p className="eyebrow">GitHub Summary</p>
            <h2 className="section-title mt-4">Public activity snapshot</h2>
            {github ? (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="metric-card">
                    <p className="text-sm text-black/50">Public repos</p>
                    <p className="mt-2 text-xl font-semibold">{github.public_repos}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-black/50">Followers</p>
                    <p className="mt-2 text-xl font-semibold">{github.followers}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-black/50">Top languages</p>
                    <p className="mt-2 text-sm font-semibold">{github.top_languages.join(", ") || "Unknown"}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-black/50">Activity score</p>
                    <p className="mt-2 text-xl font-semibold">{github.recent_activity_score}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-black/65">Detected GitHub skills</p>
                  <div className="flex flex-wrap gap-2">
                    {developer.computed.detected_skills.map((skill) => (
                      <span key={skill} className="pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <p className="mb-4 text-sm font-medium text-black/65">Top repositories</p>
                  <div className="space-y-4">
                    {github.top_repositories.map((repo) => (
                      <a
                        key={repo.html_url}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-black/10 bg-white/75 p-4 transition hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">{repo.name}</p>
                            <p className="mt-1 text-sm text-black/55">{repo.description || "No description."}</p>
                          </div>
                          <div className="text-right text-xs text-black/45">
                            <p>{repo.language || "Unknown"}</p>
                            <p>{repo.stargazers_count} stars</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-black/55">No GitHub enrichment data available yet.</p>
            )}
          </div>

          <div className="surface rounded-[2rem] p-8 shadow-soft">
            <p className="eyebrow">Portfolio Summary</p>
            <h2 className="section-title mt-4">Lightweight metadata only</h2>
            {portfolio ? (
              <div className="mt-6 space-y-4 text-sm text-black/65">
                <p><span className="font-medium text-black">Title:</span> {portfolio.title || "Unknown"}</p>
                <p><span className="font-medium text-black">Description:</span> {portfolio.description || "Unknown"}</p>
                <p><span className="font-medium text-black">Canonical URL:</span> {portfolio.canonical_url || "Unknown"}</p>
                {portfolio.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.keywords.map((keyword) => (
                      <span key={keyword} className="pill">
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-sm text-black/55">No portfolio metadata available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="surface rounded-[2rem] p-8 shadow-soft">
            <p className="eyebrow">At A Glance</p>
            <h2 className="section-title mt-4">Signals around this profile</h2>
            <div className="mt-6">
              <BarList
                items={[
                  { label: "Submitted skills", count: developer.submitted.skills.length },
                  { label: "Detected GitHub skills", count: developer.computed.detected_skills.length },
                  { label: "Secondary roles", count: developer.submitted.secondary_roles.length },
                  { label: "Sync notes", count: developer.sync.notes.length }
                ]}
              />
            </div>
            <p className="mt-6 text-sm text-black/45">
              Last updated {readTimeLabel(developer.updated_at)} UTC
            </p>
          </div>

          <div className="surface rounded-[2rem] p-8 shadow-soft">
            <p className="eyebrow">Related Profiles</p>
            <h2 className="section-title mt-4">Developers with overlapping skills</h2>
            <div className="mt-6 space-y-4">
              {related.length > 0 ? (
                related.map((candidate) => (
                  <Link
                    key={candidate.slug}
                    href={`/developers/${candidate.slug}`}
                    className="block rounded-2xl border border-black/10 bg-white/75 p-4 transition hover:bg-white"
                  >
                    <p className="font-semibold">{candidate.submitted.name}</p>
                    <p className="mt-1 text-sm text-black/55">{candidate.submitted.headline}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-black/55">No related profiles found yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
