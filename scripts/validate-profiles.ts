import { loadAllProfiles } from "@/lib/profiles";

function main(): void {
  const profiles = loadAllProfiles();
  console.log(`Validated ${profiles.length} profile files.`);
}

main();
