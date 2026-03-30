import fs from "node:fs";

import { ensureDir, writeJson } from "@/lib/fs";
import { GENERATED_NOTICE } from "@/lib/constants";

export function writeGeneratedJson(filePath: string, data: unknown): void {
  writeJson(filePath, {
    _generated_notice: GENERATED_NOTICE,
    ...((typeof data === "object" && data !== null && !Array.isArray(data))
      ? (data as Record<string, unknown>)
      : { data })
  });
}

export function writeRawGeneratedJson(filePath: string, data: unknown): void {
  writeJson(filePath, data);
}

export function ensureCleanDir(dirPath: string): void {
  ensureDir(dirPath);
}

export function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}
