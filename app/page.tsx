import Link from "next/link";

import { BarList } from "@/components/bar-list";
import { StatCard } from "@/components/stat-card";
import { getDashboardData, getDevelopersIndex } from "@/lib/site-data";
import { readTimeLabel } from "@/lib/utils";

export default function HomePage() {
  const dashboard = getDashboardData();
  const index = getDevelopersIndex();

  return (
    <div className="shell py-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="surface rounded-[2rem] p-8 shadow-soft sm:p-12">
          <p className="eyebrow">Open Directory</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            Structured profiles for Bangladeshi developers, built for public discovery.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
            Contributors submit one YAML profile. The repo validates it, enriches public GitHub and
            portfolio metadata, and ships a static directory plus ecosystem dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/developers" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Explore developers
            </Link>
            <Link href="/contribute" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
              Add your profile
            </Link>
          </div>
          <p className="mt-6 text-sm text-black/45">
            Last updated {readTimeLabel(dashboard.updated_at)} UTC
          </p>
        </div>
        <div className="grid gap-4">
          <StatCard label="Developers" value={dashboard.summary.total_developers} />
          <StatCard label="Distinct roles" value={dashboard.summary.total_roles} />
          <StatCard label="Tracked skills" value={dashboard.summary.total_skills} />
          <StatCard
            label="Open to opportunities"
            value={dashboard.summary.open_to_opportunities}
            hint={`${dashboard.summary.remote_friendly} remote-friendly profiles`}
          />
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Role Distribution</p>
          <h2 className="section-title mt-4">Where the community is strongest</h2>
          <div className="mt-8">
            <BarList items={dashboard.roles} max={8} />
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Skill Signals</p>
          <h2 className="section-title mt-4">Top technologies across submitted and detected data</h2>
          <div className="mt-8">
            <BarList items={dashboard.skills} max={8} />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        <div className="surface rounded-[2rem] p-8 shadow-soft lg:col-span-2">
          <p className="eyebrow">How It Works</p>
          <h2 className="section-title mt-4">Lean workflow, static output, no database</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-display text-xl font-semibold">1. Submit YAML</p>
              <p className="mt-3 text-sm leading-7 text-black/65">
                Each developer adds one file in <span className="font-mono">profiles/</span>. GitHub
                username is the default slug.
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold">2. Enrich public data</p>
              <p className="mt-3 text-sm leading-7 text-black/65">
                GitHub and portfolio metadata are fetched daily or on demand. LinkedIn is stored only.
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold">3. Ship static pages</p>
              <p className="mt-3 text-sm leading-7 text-black/65">
                Generated JSON powers the directory and dashboard through static Next.js routes.
              </p>
            </div>
          </div>
        </div>
        <div className="surface rounded-[2rem] p-8 shadow-soft">
          <p className="eyebrow">Coverage</p>
          <h2 className="section-title mt-4">Current snapshot</h2>
          <div className="mt-8 space-y-4 text-sm text-black/65">
            <p>{dashboard.summary.profiles_with_github} profiles include GitHub.</p>
            <p>{dashboard.summary.profiles_with_portfolio} profiles include portfolio links.</p>
            <p>{dashboard.github.recently_active} profiles show public GitHub activity in the last 90 days.</p>
            <p>{index.total} developers are searchable on the public directory.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
