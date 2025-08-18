import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getInterviewTopic, getInterviewTopicsInSection } from "../../content/interviewIndex";
import MarkdownRenderer, { extractHeadings } from "../../components/MarkdownRenderer";
import { useDrawer } from "../../state/DrawerContext";

export default function InterviewPage() {
  const { sectionId = "", topicId = "" } = useParams<{ sectionId: string; topicId: string }>();
  const [content, setContent] = useState<string>("");
  const drawer = useDrawer();

  const topic = getInterviewTopic(sectionId, topicId);

  useEffect(() => {
    setContent(topic?.content ?? "");
  }, [topic?.content]);

  // headings for "On this page"
  const headings = useMemo(() => extractHeadings(content), [content]);

  // sibling topics for "Sections"
  const sectionLinks = useMemo(
    () =>
      getInterviewTopicsInSection(sectionId).map((t) => ({
        title: t.title,
        href: `/interview/section/${sectionId}/topic/${t.slug}`,
      })),
    [sectionId]
  );

  useEffect(() => {
    drawer.setToc(headings);
    drawer.setInterviewLinks(sectionLinks);
    drawer.setSections(sectionLinks); // optional mirror
  }, [headings, sectionLinks, drawer]);

  if (!topic) return <div>Topic not found.</div>;

  return (
    <div>
      <div className="md:hidden mb-3 flex gap-2">
        <button className="chip" onClick={() => drawer.open("interview")}>Interview</button>
        <button className="chip" onClick={() => drawer.open("toc")}>On this page</button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{topic.title}</h1>
      <div className="card p-5">
        <MarkdownRenderer content={content} />
      </div>

      <div className="mt-4">
        <Link to={`/interview/section/${sectionId}`} className="btn">← Back to section</Link>
      </div>
    </div>
  );
}
