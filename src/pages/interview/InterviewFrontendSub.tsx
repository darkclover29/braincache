import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFrontendTopics } from "../../content/interviewIndex";
import { useDrawer } from "../../state/DrawerContext";

type SubId = "html" | "css" | "javascript";

const TITLES: Record<SubId, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

export default function InterviewFrontendSub() {
  const { subId = "html" } = useParams<{ subId: SubId }>();
  const drawer = useDrawer();

  const topics = useMemo(() => getFrontendTopics(subId), [subId]);
  const links = useMemo(
    () =>
      topics.map(t => ({
        title: t.title,
        href: `/interview/section/frontend/topic/${t.slug}`,
      })),
    [topics]
  );

  useEffect(() => {
    drawer.setInterviewLinks(links);
    drawer.setSections(links);
    drawer.setToc([]);
  }, [links, drawer]);

  return (
    <div>
      <div className="md:hidden mb-3 flex gap-2">
        <button className="chip" onClick={() => drawer.open("interview")}>Interview</button>
        <button className="chip" onClick={() => drawer.open("sections")}>Sections</button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{TITLES[subId]}</h1>

      {topics.length === 0 ? (
        <div className="card p-4 text-foreground/80">No topics found in {TITLES[subId]}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {topics.map(t => (
            <Link
              key={t.slug}
              to={`/interview/section/frontend/topic/${t.slug}`}
              className="card hover:shadow-md transition"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="icon-blob">📘</div>
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-foreground/70 text-sm">Questions & answers</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link to="/interview/section/frontend" className="btn">← Back to Frontend</Link>
      </div>
    </div>
  );
}
