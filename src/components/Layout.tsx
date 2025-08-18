// src/components/Layout.tsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ReportBugModal from "./ReportBugModal";
import FeedbackFab from "./FeedbackFab";
import ThemeSwitcher from "./ThemeSwitcher";
import MobileDrawer from "./MobileDrawer";
import { DrawerProvider, useDrawer } from "../state/DrawerContext";

function LayoutShell({ children }: { children: React.ReactNode }) {
  const [reportOpen, setReportOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const drawer = useDrawer();

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[name=q]') as HTMLInputElement;
    const q = input.value.trim();
    if (q) {
      navigate("/search?q=" + encodeURIComponent(q));
      drawer.close();
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-border">
        <div className="container-responsive py-3">
          <div className="flex items-center gap-3">
            {/* Open unified drawer (mobile) */}
            <button
              className="md:hidden btn"
              onClick={() => drawer.open("nav")}
              aria-label="Open menu"
            >
              ☰
            </button>

            <Link to="/" className="mr-2">
              <Logo size="md" />
            </Link>

            {/* Search (desktop) */}
            <form
              className="hidden md:flex items-center gap-2 flex-1"
              onSubmit={onSearchSubmit}
            >
              <input name="q" placeholder="Search…" className="input w-full" ref={searchRef} />
            </form>

            {/* Primary nav (desktop) */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className="btn">Home</Link>
              <Link to="/study" className="btn">Study Areas</Link>
              <Link to="/interview" className="btn">Interview Prep</Link>
            </nav>

            <ThemeSwitcher />
          </div>

          {/* Search (mobile) */}
          <form className="md:hidden mt-2" onSubmit={onSearchSubmit}>
            <input name="q" placeholder="Search…" className="input w-full" />
          </form>
        </div>
      </header>

      {/* Shared Mobile Drawer */}
      <MobileDrawer />

      {/* Main */}
      <main className="flex-1">
        <div className="container-responsive py-6">{children}</div>
      </main>

      {/* Footer (mobile friendly) */}
      <footer className="border-t border-border">
        <div className="container-responsive py-6 text-sm text-foreground/70 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between text-center sm:text-left">
          <span className="inline-flex items-center gap-2">
            <Logo size="sm" />
            <span>Cache it. Recall it.</span>
          </span>
          <span>
            Developed by <strong>Harsh Tiwari</strong> · © {new Date().getFullYear()} BrainCache
          </span>
        </div>
      </footer>

      {/* FAB + Modal */}
      <FeedbackFab onClick={() => setReportOpen(true)} />
      <ReportBugModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerProvider>
      <LayoutShell>{children}</LayoutShell>
    </DrawerProvider>
  );
}
