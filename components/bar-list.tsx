type BarListProps = {
  items: Array<{ label: string; count: number }>;
  max?: number;
};

export function BarList({ items, max }: BarListProps) {
  const topItems = typeof max === "number" ? items.slice(0, max) : items;
  const highest = topItems[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      {topItems.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-black/80">{item.label}</span>
            <span className="text-black/50">{item.count}</span>
          </div>
          <div className="h-2 rounded-full bg-black/8">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-ember to-orange-300"
              style={{ width: `${(item.count / highest) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
