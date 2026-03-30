import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function removeGeneratedJsonFiles(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath)) {
    const absolutePath = path.join(dirPath, entry);
    const stat = fs.statSync(absolutePath);
    if (stat.isDirectory()) {
      removeGeneratedJsonFiles(absolutePath);
      continue;
    }
    if (entry.endsWith(".json")) {
      fs.unlinkSync(absolutePath);
    }
  }
}
