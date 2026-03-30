import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/developers", label: "Developers" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contribute", label: "Contribute" }
];

export function SiteHeader() {
  return (
    <header className="shell pt-6">
      <div className="surface flex items-center justify-between rounded-full px-5 py-3 shadow-soft">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Bangladesh Tech Community
        </Link>
        <nav className="flex items-center gap-4 text-sm text-black/70">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
