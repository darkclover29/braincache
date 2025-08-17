export type InterviewPage = { id: string; title: string; content: string }
export type InterviewSection = { id: string; title: string; icon: string; pages: InterviewPage[] }
export function md(lines: string[]): string { return lines.join("\n"); }
export const INTERVIEW: InterviewSection[] = [
  { id: "cs", title: "CS Fundamentals", icon: "🧠", pages: [
    { id: "os-qa", title: "Operating Systems Q&A", content: md([
      "## OS Q&A",
      "<details><summary>Q. Process vs Thread?</summary><div>",
      "A **process** has its own address space; a **thread** shares the process address space/resources.",
      "</div></details>",
      "<details><summary>Q. Context switch?</summary><div>",
      "Save registers; switch kernel stack/address space if needed; TLB effects.",
      "</div></details>",
      "<details><summary>Q. Deadlock conditions?</summary><div>",
      "Mutual exclusion, hold-and-wait, no preemption, circular wait.",
      "</div></details>"
    ])},
    { id: "dbms-qa", title: "DBMS Q&A", content: md([
      "## DBMS Q&A",
      "<details><summary>Q. ACID?</summary><div>",
      "Atomicity, Consistency, Isolation, Durability.",
      "</div></details>",
      "<details><summary>Q. MVCC?</summary><div>",
      "Readers get snapshots; writers create new versions; reduces blocking.",
      "</div></details>"
    ])}
  ]},
  { id: "java", title: "Java", icon: "☕", pages: [
    { id: "basics-qa", title: "OOP & Basics (Q&A)", content: md([
      "## Java Basics",
      "<details><summary>Q. Abstract class vs Interface?</summary><div>",
      "Interfaces can have default/static methods; abstract classes hold state/constructors.",
      "</div></details>"
    ])},
    { id: "collections-qa", title: "Collections (Q&A)", content: md([
      "## Collections",
      "<details><summary>Q. HashMap internals?</summary><div>",
      "Index via (hash & mask); collisions bins; treeify after threshold.",
      "</div></details>"
    ])}
  ]},
  { id: "react", title: "React", icon: "⚛️", pages: [
    { id: "react-qa", title: "React (Q&A)", content: md([
      "## React Q&A",
      "<details><summary>Q. Why keys?</summary><div>",
      "Stable keys help reconciliation; avoid index when order changes.",
      "</div></details>"
    ])}
  ]},
  { id: "spring-boot", title: "Spring Boot", icon: "🍃", pages: [
    { id: "spring-qa", title: "Spring Boot (Q&A)", content: md([
      "## Spring Boot Q&A",
      "<details><summary>Q. RestController vs Controller?</summary><div>",
      "@RestController = @Controller + @ResponseBody (JSON by default).",
      "</div></details>"
    ])}
  ]},
  { id: "sql", title: "SQL", icon: "🗄️", pages: [
    { id: "sql-qa", title: "SQL (Q&A)", content: md([
      "## SQL Q&A",
      "<details><summary>Q. Index selection?</summary><div>",
      "Prefer high-selectivity, covering indexes; avoid wrapping columns in functions.",
      "</div></details>"
    ])}
  ]}
]
