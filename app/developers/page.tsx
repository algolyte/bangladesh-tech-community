import { FilterableDirectory } from "@/components/filterable-directory";
import { getDevelopersIndex } from "@/lib/site-data";

export default function DevelopersPage() {
  const index = getDevelopersIndex();

  return (
    <div className="shell py-12">
      <section className="mb-10">
        <p className="eyebrow">Developer Directory</p>
        <h1 className="section-title mt-4">Search the community by role, skill, or location</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-black/65">
          Generated from structured YAML profiles with deterministic enrichment from public GitHub and
          portfolio metadata.
        </p>
      </section>
      <FilterableDirectory index={index} />
    </div>
  );
}
