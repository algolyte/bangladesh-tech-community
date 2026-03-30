import Link from "next/link";

import { BarList } from "@/components/bar-list";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/site-data";
import { readTimeLabel } from "@/lib/utils";

export default function DashboardPage() {
  const dashboard = getDashboardData();

  return (
    <div className="shell py-12">
      <section>
        <p className="eyebrow">Public Dashboard</p>
        <h1 className="section-title mt-4">A public snapshot of the Bangladeshi developer ecosystem in this repo</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-black/65">
          This dashboard summarizes submitted profile data and deterministic enrichment from public
          GitHub and portfolio metadata. It is descriptive, not a ranking system.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Developers" value={dashboard.summary.total_developers} />
        <StatCard label="Remote-friendly" value={dashboard.summary.remote_friendly} />
        <StatCard label="Profiles with GitHub" value={dashboard.summary.profiles_with_github} />
        <StatCard label="Average completeness" value={`${dashboard.completeness.average}%`} />
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Roles</p>
          <h2 className="section-title mt-4">Role distribution</h2>
          <div className="mt-8">
            <BarList items={dashboard.roles} max={10} />
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Skills</p>
          <h2 className="section-title mt-4">Top skills</h2>
          <div className="mt-8">
            <BarList items={dashboard.skills} max={10} />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Availability</p>
          <div className="mt-6">
            <BarList items={dashboard.availability} />
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Experience Bands</p>
          <div className="mt-6">
            <BarList items={dashboard.experience_bands} />
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Locations</p>
          <div className="mt-6">
            <BarList items={dashboard.locations} max={8} />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">GitHub Activity</p>
          <h2 className="section-title mt-4">Public repo signal</h2>
          <div className="mt-8 space-y-4 text-sm text-black/65">
            <p>Average activity score: {dashboard.github.average_activity_score}</p>
            <p>Recently active profiles: {dashboard.github.recently_active}</p>
            <p>Last refreshed: {readTimeLabel(dashboard.updated_at)} UTC</p>
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Recent Additions</p>
          <h2 className="section-title mt-4">Profiles recently touched by the sync pipeline</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {dashboard.recent_additions.map((developer) => (
              <Link
                key={developer.slug}
                href={`/developers/${developer.slug}`}
                className="rounded-2xl border border-black/10 bg-white/75 p-4 transition hover:bg-white"
              >
                <p className="font-semibold">{developer.name}</p>
                <p className="mt-1 text-sm text-black/55">{developer.headline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
