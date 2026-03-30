export function SiteFooter() {
  return (
    <footer className="shell py-12 text-sm text-black/60">
      <div className="surface rounded-3xl px-6 py-5">
        Open source, file-based, contributor-friendly. Profiles are manually submitted in
        <span className="mx-1 rounded bg-black/5 px-2 py-1 font-mono text-xs">profiles/*.yml</span>
        and enriched from public GitHub and portfolio metadata only.
      </div>
    </footer>
  );
}
