// src/content/interviewIndex.ts
import yaml from "js-yaml";

// Normalize for Windows paths
const norm = (p: string) => p.replace(/\\/g, "/");

// TWO globs (robust for dev + Netlify)
const abs = import.meta.glob("/src/interview/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const rel = import.meta.glob("../interview/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const files: Record<string, string> = {};
for (const [k, v] of Object.entries(abs)) files[norm(k)] = v;
for (const [k, v] of Object.entries(rel)) files[norm(k)] = v;

// ----- Hardcoded main categories -----
export const HARDCODED_SECTIONS = [
  { id: "foundations", title: "CS Fundamentals" },
  { id: "java", title: "Java" },
  { id: "frontend", title: "Frontend" }, // will show HTML/CSS/JavaScript subcards
  { id: "spring-boot", title: "Spring Boot" },
  { id: "sql", title: "SQL" },
] as const;

export type InterviewTopic = {
  id: string;
  title: string;
  slug: string;
  sectionId: string;     // e.g., "java", "frontend", "sql"
  subId?: string;        // for frontend only: "html" | "css" | "javascript"
  sectionTitle: string;
  content: string;
};

export type InterviewSection = {
  id: string;
  title: string;
  topics: InterviewTopic[];
};

const pretty = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").replace(/\b\w/g, m => m.toUpperCase()).trim();

function parseFrontmatter(raw: string): { data: any; body: string } {
  const fm = /^---\n([\s\S]*?)\n---\n?/;
  const m = fm.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = yaml.load(m[1]) || {};
  const body = raw.slice(m[0].length);
  return { data, body };
}

// Build topics from folder structure
// Structure expectations:
//   src/interview/java/<topic>.md          => sectionId=java
//   src/interview/foundations/<topic>.md   => sectionId=foundations
//   src/interview/spring-boot/<topic>.md   => sectionId=spring-boot
//   src/interview/sql/<topic>.md           => sectionId=sql
//   src/interview/frontend/html/<t>.md     => sectionId=frontend, subId=html
//   src/interview/frontend/css/<t>.md      => sectionId=frontend, subId=css
//   src/interview/frontend/javascript/<t>.md => sectionId=frontend, subId=javascript
const ALL_TOPICS: InterviewTopic[] = Object.entries(files).map(([pathRaw, raw]) => {
  const path = norm(pathRaw);
  const parts = path.split("/");
  const ivx = parts.lastIndexOf("interview");

  // default fallbacks
  let sectionId = "general";
  let subId: string | undefined;
  let filename = "index.md";

  if (ivx >= 0) {
    sectionId = (parts[ivx + 1] || "general").toLowerCase();
    // frontend nested
    if (sectionId === "frontend") {
      subId = (parts[ivx + 2] || "").toLowerCase(); // html/css/javascript
      filename = parts[ivx + 3] || "index.md";
    } else {
      filename = parts[ivx + 2] || "index.md";
    }
  }

  const slug = filename.replace(/\.md$/i, "");
  const { data, body } = parseFrontmatter(raw);
  const title = (data as any)?.title || pretty(slug);
  const id = (data as any)?.id || slug;

  const sectionTitle =
    HARDCODED_SECTIONS.find(s => s.id === sectionId)?.title || pretty(sectionId);

  return { id, title, slug, sectionId, subId, sectionTitle, content: body };
});

// Group ALL topics by sectionId
const SECTION_MAP = new Map<string, InterviewSection>();
for (const base of HARDCODED_SECTIONS) {
  SECTION_MAP.set(base.id, { id: base.id, title: base.title, topics: [] });
}
for (const t of ALL_TOPICS) {
  const bucket = SECTION_MAP.get(t.sectionId) || SECTION_MAP.get("foundations")!;
  bucket.topics.push(t);
}
for (const s of SECTION_MAP.values()) {
  s.topics.sort((a, b) => a.title.localeCompare(b.title));
}

export const INTERVIEW_SECTIONS: InterviewSection[] = [
  SECTION_MAP.get("foundations")!,
  SECTION_MAP.get("java")!,
  SECTION_MAP.get("frontend")!,
  SECTION_MAP.get("spring-boot")!,
  SECTION_MAP.get("sql")!,
];

// Helpers
export function getInterviewSections(): InterviewSection[] {
  return INTERVIEW_SECTIONS;
}
export function getInterviewSection(sectionId: string): InterviewSection | undefined {
  return INTERVIEW_SECTIONS.find(s => s.id === sectionId);
}
export function getInterviewTopicsInSection(sectionId: string): InterviewTopic[] {
  return getInterviewSection(sectionId)?.topics ?? [];
}

// Frontend-specific: filter by subId (html/css/javascript)
export function getFrontendTopics(subId: "html" | "css" | "javascript"): InterviewTopic[] {
  return (SECTION_MAP.get("frontend")?.topics ?? []).filter(t => t.subId === subId);
}

// Find a specific topic (supports frontend namespaces)
export function getInterviewTopic(sectionId: string, topicSlug: string): InterviewTopic | undefined {
  if (sectionId === "frontend") {
    // topicSlug may be "html-grid" etc; still match by slug
    return (SECTION_MAP.get("frontend")?.topics ?? []).find(t => t.slug === topicSlug || t.id === topicSlug);
  }
  return (SECTION_MAP.get(sectionId)?.topics ?? []).find(t => t.slug === topicSlug || t.id === topicSlug);
}
