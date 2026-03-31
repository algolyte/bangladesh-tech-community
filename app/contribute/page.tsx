export default function ContributePage() {
  return (
    <div className="shell py-12">
      <section className="surface rounded-[2rem] p-8 shadow-soft sm:p-10">
        <p className="eyebrow">Contribute</p>
        <h1 className="section-title mt-4">Add one YAML file and let the pipeline do the rest</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-black/65">
          Profiles live in <span className="font-mono">profiles/*.yml</span>. The filename should
          match your GitHub username whenever you have one. Slug fields are computed automatically
          from your GitHub URL (or your name if no GitHub URL exists). GitHub and portfolio metadata
          are fetched automatically. LinkedIn is stored only and never scraped.
        </p>
        <div className="mt-8 rounded-3xl border border-black/10 bg-black/5 p-6">
          <pre className="overflow-x-auto text-sm leading-7 text-black/75">
{`version: 1
name: Your Name
headline: Senior Software Engineer
bio: Short summary about your background
primary_role: Backend Engineer
secondary_roles: []
experience_years: 5
location: Dhaka, Bangladesh
country: Bangladesh
timezone: Asia/Dhaka
availability: open_to_opportunities
preferred_work_type: remote
remote: true
skills:
  - TypeScript
  - Node.js
profile_status: active
last_updated_by_user: 2026-03-31
links:
  github: https://github.com/your-github-username
  linkedin: https://www.linkedin.com/in/your-profile
  portfolio:
  gitlab:
  stackoverflow:
  blog:`}
          </pre>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold">1. Copy the template</p>
            <p className="mt-3 text-sm leading-7 text-black/65">
              Start from <span className="font-mono">profiles/_template.yml</span> and name your file
              after your GitHub username. Do not include slug fields in YAML.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">2. Validate locally</p>
            <p className="mt-3 text-sm leading-7 text-black/65">
              Run <span className="font-mono">npm run validate</span> before opening your pull request.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">3. Open a PR</p>
            <p className="mt-3 text-sm leading-7 text-black/65">
              CI validates profile files, rebuilds generated JSON, and keeps the site data consistent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
