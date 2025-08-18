import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getInterviewSections, HARDCODED_SECTIONS } from "../../content/interviewIndex";

// Accent color per section id
const ACCENTS: Record<string, string> = {
  foundations: "accent-teal",
  java: "accent-amber",
  frontend: "accent-purple",
  "spring-boot": "accent-green",
  sql: "accent-cyan",
};

export default function InterviewHome() {
  const sections = useMemo(() => getInterviewSections(), []);
  const sectionMap = Object.fromEntries(sections.map(s => [s.id, s]));

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Interview Prep</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HARDCODED_SECTIONS.map(s => {
          const data = sectionMap[s.id] || { topics: [] };
          const accent = ACCENTS[s.id] || "accent-blue";
          const preview = data.topics.slice(0, 3);

          return (
            <Link
              key={s.id}
              to={`/interview/section/${s.id}`}
              className={`card interview-card ${accent} hover:shadow-md transition`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="icon-blob">💡</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{s.title}</div>
                    <div className="text-foreground/70">Topic-wise questions with answers</div>
                  </div>
                </div>

                {preview.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preview.map(t => (
                      <span key={t.slug} className="pill">{t.title}</span>
                    ))}
                    {data.topics.length > preview.length && (
                      <span className="pill muted">+{data.topics.length - preview.length} more</span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span className="stat">{data.topics.length} pages</span>
                  <span className="stat">Q&amp;A</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
