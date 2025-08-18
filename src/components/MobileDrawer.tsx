import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDrawer } from "../state/DrawerContext";
import { DOMAINS } from "../content/contentIndex";
import ThemeSwitcher from "./ThemeSwitcher";
import Logo from "./Logo";

export default function MobileDrawer() {
  const {
    isOpen,
    tab,
    close,
    open,
    sections,
    toc,
    interviewLinks,
  } = useDrawer();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 w-80 max-w-[85%] z-50 bg-card border-r border-border rounded-r-2xl shadow-lg flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "tween", duration: 0.2 }}
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <Logo size="sm" />
                <span className="font-semibold">BrainCache</span>
              </div>
              <button className="btn" onClick={close} aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="px-3 py-2 border-b border-border flex gap-2">
              <button
                className={`chip ${tab === "nav" ? "chip-active" : ""}`}
                onClick={() => open("nav")}
              >
                Nav
              </button>
              <button
                className={`chip ${tab === "sections" ? "chip-active" : ""}`}
                onClick={() => open("sections")}
              >
                Sections
              </button>
              <button
                className={`chip ${tab === "toc" ? "chip-active" : ""}`}
                onClick={() => open("toc")}
              >
                On this page
              </button>
              <button
                className={`chip ${tab === "interview" ? "chip-active" : ""}`}
                onClick={() => open("interview")}
              >
                Interview
              </button>
            </div>

            {/* Body */}
            <div className="p-3 overflow-auto flex-1">
              {tab === "nav" && (
                <div className="space-y-3">
                  <nav className="flex flex-col gap-2">
                    <Link to="/" className="btn" onClick={close}>
                      Home
                    </Link>
                    <Link to="/study" className="btn" onClick={close}>
                      Study Areas
                    </Link>
                    <Link to="/interview" className="btn" onClick={close}>
                      Interview Prep
                    </Link>
                  </nav>
                  <div className="mt-2">
                    <div className="text-xs uppercase text-foreground/60 mb-1">
                      Browse domains
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-[46vh] overflow-auto">
                      {DOMAINS.map((d) => (
                        <Link
                          key={d.id}
                          to={`/domain/${d.id}`}
                          className="px-3 py-2 rounded hover:bg-muted"
                          onClick={close}
                        >
                          {d.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "sections" && (
                <div className="grid grid-cols-1 gap-1">
                  {sections.length === 0 ? (
                    <div className="text-foreground/60">No sections here.</div>
                  ) : (
                    sections.map((s, i) =>
                      s.href ? (
                        <Link
                          key={s.href + i}
                          to={s.href}
                          className="px-3 py-2 rounded hover:bg-muted"
                          onClick={close}
                        >
                          {s.title}
                        </Link>
                      ) : (
                        <div key={s.title + i} className="px-3 py-2">
                          {s.title}
                        </div>
                      )
                    )
                  )}
                </div>
              )}

              {tab === "toc" && (
                <ul className="space-y-1">
                  {toc.length === 0 ? (
                    <li className="text-foreground/60">No headings on this page.</li>
                  ) : (
                    toc.map((h) => (
                      <li key={h.id} className="leading-tight">
                        <a
                          href={`#${h.id}`}
                          className={`block px-3 py-1 rounded hover:bg-muted ${
                            h.depth === 3 ? "pl-5 text-sm" : ""
                          }`}
                          onClick={close}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              )}

              {tab === "interview" && (
                <div className="grid grid-cols-1 gap-1">
                  {interviewLinks.length === 0 ? (
                    <div className="text-foreground/60">
                      No interview items in this context.
                    </div>
                  ) : (
                    interviewLinks.map((s, i) =>
                      s.href ? (
                        <Link
                          key={s.href + i}
                          to={s.href}
                          className="px-3 py-2 rounded hover:bg-muted"
                          onClick={close}
                        >
                          {s.title}
                        </Link>
                      ) : (
                        <div key={s.title + i} className="px-3 py-2">
                          {s.title}
                        </div>
                      )
                    )
                  )}
                </div>
              )}
            </div>

            {/* Footer row inside drawer */}
            <div className="p-3 border-t border-border">
              <ThemeSwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
