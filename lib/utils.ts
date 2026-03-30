export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function uniqueSorted<T>(items: T[]): T[] {
  return Array.from(new Set(items)).sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

export function parseGitHubUsername(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
      return null;
    }

    const [username] = parsed.pathname.split("/").filter(Boolean);
    if (!username) {
      return null;
    }

    if (!/^[A-Za-z0-9-]+$/.test(username)) {
      return null;
    }

    return username;
  } catch {
    return null;
  }
}

export function isLinkedInUrl(url: string | null | undefined): boolean {
  if (!url) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return /(^|\.)linkedin\.com$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

export function titleCase(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function toIsoTimestamp(value = new Date()): string {
  return value.toISOString();
}

export function readTimeLabel(timestamp: string | null): string {
  if (!timestamp) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(new Date(timestamp));
}
