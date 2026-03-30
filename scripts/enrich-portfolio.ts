import path from "node:path";

import { ensureDir, writeJson } from "@/lib/fs";
import { generatedEnrichedPortfolioDir } from "@/lib/paths";
import { loadAllProfiles } from "@/lib/profiles";
import type { PortfolioEnrichment } from "@/lib/schema";
import { toIsoTimestamp } from "@/lib/utils";

function extractMeta(html: string, attribute: string, value: string): string | null {
  const regex = new RegExp(
    `<meta[^>]+${attribute}=["']${value}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  return html.match(regex)?.[1] ?? null;
}

function extractCanonical(html: string): string | null {
  return (
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] ??
    null
  );
}

function extractTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
}

function extractExternalLinks(html: string, originHost: string): string[] {
  const matches = [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => {
      try {
        return new URL(href).hostname !== originHost;
      } catch {
        return false;
      }
    });

  return [...new Set(matches)].slice(0, 10);
}

async function buildPortfolioEnrichment(url: string): Promise<PortfolioEnrichment> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "bangladesh-tech-community-bot/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Portfolio request failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const host = new URL(url).hostname;
  const keywords =
    extractMeta(html, "name", "keywords")
      ?.split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .slice(0, 10) ?? [];

  return {
    url,
    title: extractTitle(html),
    description:
      extractMeta(html, "name", "description") ?? extractMeta(html, "property", "og:description"),
    canonical_url: extractCanonical(html),
    og_image: extractMeta(html, "property", "og:image"),
    keywords,
    external_links: extractExternalLinks(html, host)
  };
}

async function main(): Promise<void> {
  const profiles = loadAllProfiles();
  ensureDir(generatedEnrichedPortfolioDir);

  for (const { profile } of profiles) {
    const portfolioUrl = profile.links.portfolio;
    const outputPath = path.join(generatedEnrichedPortfolioDir, `${profile.slug}.json`);

    if (!portfolioUrl) {
      writeJson(outputPath, {
        slug: profile.slug,
        status: "skipped",
        synced_at: null,
        error: "No portfolio URL provided.",
        data: null
      });
      continue;
    }

    try {
      const data = await buildPortfolioEnrichment(portfolioUrl);
      writeJson(outputPath, {
        slug: profile.slug,
        status: "ok",
        synced_at: toIsoTimestamp(),
        error: null,
        data
      });
      console.log(`Enriched portfolio for ${profile.slug}`);
    } catch (error) {
      writeJson(outputPath, {
        slug: profile.slug,
        status: "error",
        synced_at: null,
        error: error instanceof Error ? error.message : "Unknown portfolio enrichment error",
        data: null
      });
      console.error(`Portfolio enrichment failed for ${profile.slug}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
