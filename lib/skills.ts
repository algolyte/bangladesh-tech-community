import { uniqueSorted } from "@/lib/utils";

const canonicalSkillMap = new Map<string, string>([
  ["node js", "Node.js"],
  ["nodejs", "Node.js"],
  ["express js", "Express"],
  ["react js", "React"],
  ["restapis", "REST APIs"],
  ["microservice", "Microservices"],
  ["microservices", "Microservices"],
  ["elastic search", "Elasticsearch"],
  ["opensearch", "OpenSearch"],
  ["spring boot", "Spring Boot"],
  ["asp.net mvc", "ASP.NET MVC"],
  ["asp.net core", "ASP.NET Core"],
  ["cicd", "CI/CD"],
  ["devops", "DevOps"],
  ["problem solving", "Problem Solving"]
]);

export function normalizeSkill(skill: string): string {
  const trimmed = skill.trim().replace(/\.$/, "");
  const canonical = canonicalSkillMap.get(trimmed.toLowerCase());
  return canonical ?? trimmed;
}

export function normalizeSkillList(skills: string[]): string[] {
  return uniqueSorted(skills.map(normalizeSkill).filter(Boolean));
}
