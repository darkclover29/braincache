// src/components/Layout.tsx
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DOMAINS } from '../content/contentIndex'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import ReportBugModal from './ReportBugModal'
import FeedbackFab from './FeedbackFab'
import ThemeSwitcher from './ThemeSwitcher'

export default function Layout({ children }: { children: React.ReactNode }){
  const [drawerOpen, setDrawerOpen] = useState(false)   // ← mobile side drawer
  const [reportOpen, setReportOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input[name=q]') as HTMLInputElement
    const q = input.value.trim()
    if (q) {
      navigate('/search?q=' + encodeURIComponent(q))
      setDrawerOpen(false)
    }
  }

  function DrawerContent(){
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <button className="btn" onClick={()=>setDrawerOpen(false)} aria-label="Close menu">✕</button>
          <Logo size="sm" />
        </div>
        <div className="p-4">
          <form className="mb-3" onSubmit={onSearchSubmit}>
            <input name="q" placeholder="Search…" className="input w-full" />
          </form>
          <nav className="flex flex-col gap-2">
            <Link to="/" className="btn" onClick={()=>setDrawerOpen(false)}>Home</Link>
            <Link to="/study" className="btn" onClick={()=>setDrawerOpen(false)}>Study Areas</Link>
            <Link to="/interview" className="btn" onClick={()=>setDrawerOpen(false)}>Interview Prep</Link>
          </nav>

          <details className="bg-card border border-border rounded-xl mt-3">
            <summary className="px-3 py-2 cursor-pointer font-medium">Browse all</summary>
            <div className="p-2 max-h-[45vh] overflow-auto">
              {DOMAINS.map(d => (
                <Link
                  key={d.id}
                  to={`/domain/${d.id}`}
                  className="block px-3 py-2 rounded hover:bg-muted"
                  onClick={()=>setDrawerOpen(false)}
                >
                  {d.title}
                </Link>
              ))}
            </div>
          </details>

          <div className="mt-3">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-border">
        <div className="container-responsive py-3">
          <div className="flex items-center gap-3">
            {/* Drawer toggle (mobile) */}
            <button
              className="md:hidden btn"
              onClick={()=>setDrawerOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <Link to="/" className="mr-2"><Logo size="md"/></Link>

            {/* Search (desktop) */}
            <form className="hidden md:flex items-center gap-2 flex-1" onSubmit={onSearchSubmit}>
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

          {/* Search (mobile, below row) */}
          <form className="md:hidden mt-2" onSubmit={onSearchSubmit}>
            <input name="q" placeholder="Search…" className="input w-full" />
          </form>
        </div>
      </header>

      {/* Side Drawer (mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={()=>setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-80 max-w-[85%] z-50 bg-card border-r border-border rounded-r-2xl shadow-lg"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', duration: .2 }}
            >
              <DrawerContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1">
        <div className="container-responsive py-6">{children}</div>
      </main>

      {/* Footer (mobile-friendly) */}
      <footer className="border-t border-border">
        <div className="container-responsive py-6 text-sm text-foreground/70 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between text-center sm:text-left">
          <span className="inline-flex items-center gap-2">
            <Logo size="sm"/><span>Cache it. Recall it.</span>
          </span>
          <span>
            Developed by <strong>Harsh Tiwari</strong> · © {new Date().getFullYear()} BrainCache
          </span>
        </div>
      </footer>

      {/* FAB + Modal */}
      <FeedbackFab onClick={()=>setReportOpen(true)} />
      <ReportBugModal open={reportOpen} onClose={()=>setReportOpen(false)} />
    </div>
  )
}
