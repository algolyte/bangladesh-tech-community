type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="metric-card">
      <p className="text-sm text-black/55">{label}</p>
      <p className="mt-3 font-display text-4xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-sm text-black/55">{hint}</p> : null}
    </div>
  );
}
