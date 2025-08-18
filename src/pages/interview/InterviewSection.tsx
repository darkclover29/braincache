import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInterviewTopicsInSection,
  getInterviewSection,
} from "../../content/interviewIndex";
import { useDrawer } from "../../state/DrawerContext";

export default function InterviewSection() {
  const { sectionId = "" } = useParams<{ sectionId: string }>();
  const drawer = useDrawer();
  const section = getInterviewSection(sectionId);

  const topics = useMemo(() => getInterviewTopicsInSection(sectionId), [sectionId]);

  const links = useMemo(
    () =>
      topics.map(t => ({
        title: t.title,
        href: `/interview/section/${sectionId}/topic/${t.slug}`,
      })),
    [topics, sectionId]
  );

  useEffect(() => {
    drawer.setInterviewLinks(links);
    drawer.setSections(links);
    drawer.setToc([]);
  }, [links, drawer]);

  const isFrontend = sectionId === "frontend";

  return (
    <div>
      <div className="md:hidden mb-3 flex gap-2">
        <button className="chip" onClick={() => drawer.open("interview")}>Interview</button>
        <button className="chip" onClick={() => drawer.open("sections")}>Sections</button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        {section?.title ?? "Interview Section"}
      </h1>

      {isFrontend ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link to="/interview/section/frontend/sub/html" className="card hover:shadow-md transition">
            <div className="p-4">
              <div className="icon-blob">⌨️</div>
              <div className="font-semibold">HTML</div>
              <div className="text-foreground/70 text-sm">Elements, semantics, forms, a11y</div>
            </div>
          </Link>
          <Link to="/interview/section/frontend/sub/css" className="card hover:shadow-md transition">
            <div className="p-4">
              <div className="icon-blob">🎨</div>
              <div className="font-semibold">CSS</div>
              <div className="text-foreground/70 text-sm">Flexbox, Grid, layout, animations</div>
            </div>
          </Link>
          <Link to="/interview/section/frontend/sub/javascript" className="card hover:shadow-md transition">
            <div className="p-4">
              <div className="icon-blob">🧠</div>
              <div className="font-semibold">JavaScript</div>
              <div className="text-foreground/70 text-sm">Core JS, async, DOM, patterns</div>
            </div>
          </Link>
        </div>
      ) : topics.length === 0 ? (
        <div className="card p-4 text-foreground/80">No topics found in this section.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {topics.map(t => (
            <Link
              key={t.slug}
              to={`/interview/section/${sectionId}/topic/${t.slug}`}
              className="card hover:shadow-md transition"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="icon-blob">📘</div>
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-foreground/70 text-sm">Topic-wise questions with explanations</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
