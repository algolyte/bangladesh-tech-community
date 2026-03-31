import path from "node:path";

import { generatedSubmittedDir } from "@/lib/paths";
import { loadAllProfiles } from "@/lib/profiles";
import { ensureDir } from "@/lib/fs";
import { writeRawGeneratedJson } from "@/scripts/_shared";

function main(): void {
  const loadedProfiles = loadAllProfiles();
  ensureDir(generatedSubmittedDir);

  const profiles = loadedProfiles.map(({ fileName, profile }) => {
    const { slug, slug_source, ...submitted } = profile;
    return {
      file_name: fileName,
      slug,
      slug_source,
      submitted
    };
  });

  writeRawGeneratedJson(path.join(generatedSubmittedDir, "profiles.json"), profiles);
  console.log(`Wrote ${profiles.length} submitted profiles.`);
}

main();
