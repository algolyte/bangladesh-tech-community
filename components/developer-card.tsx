import Link from "next/link";

type DeveloperCardProps = {
  developer: {
    slug: string;
    name: string;
    headline: string;
    primary_role: string;
    location: string;
    experience_years: number;
    availability: string;
    remote: boolean;
    top_skills: string[];
    profile_completeness: number;
    has_github: boolean;
    has_portfolio: boolean;
  };
};

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Link
      href={`/developers/${developer.slug}`}
      className="surface group block rounded-3xl p-6 shadow-soft transition hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-black/50">{developer.primary_role}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {developer.name}
          </h3>
          <p className="mt-2 text-sm text-black/65">{developer.headline}</p>
        </div>
        <div className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium">
          {developer.profile_completeness}%
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {developer.top_skills.slice(0, 5).map((skill) => (
          <span key={skill} className="pill">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-black/60">
        <p>{developer.location}</p>
        <p>{developer.experience_years} years</p>
        <p>{developer.availability.replace(/_/g, " ")}</p>
        <p>{developer.remote ? "Remote friendly" : "On-site only"}</p>
      </div>
      <div className="mt-6 flex gap-2 text-xs text-black/50">
        {developer.has_github ? <span className="pill">GitHub</span> : null}
        {developer.has_portfolio ? <span className="pill">Portfolio</span> : null}
      </div>
    </Link>
  );
}
