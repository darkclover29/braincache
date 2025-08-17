import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DOMAINS } from '../content/contentIndex'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import ReportBugModal from './ReportBugModal'
import FeedbackFab from './FeedbackFab'
import ThemeSwitcher from './ThemeSwitcher'

export default function Layout({ children }: { children: React.ReactNode }){
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input[name=q]') as HTMLInputElement
    const q = input.value.trim()
    if (q) navigate('/search?q=' + encodeURIComponent(q))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-border">
        <div className="container-responsive py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden btn" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">☰</button>
            <Link to="/" className="mr-2"><Logo size="md"/></Link>
            <form className="hidden md:flex items-center gap-2 flex-1" onSubmit={onSearchSubmit}>
              <input name="q" placeholder="Search…" className="input w-full" ref={searchRef} />
            </form>
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className="btn">Home</Link>
              <Link to="/study" className="btn">Study Areas</Link>
              <Link to="/interview" className="btn">Interview Prep</Link>
            </nav>
            <ThemeSwitcher />
          </div>
          <form className="md:hidden mt-2" onSubmit={onSearchSubmit}>
            <input name="q" placeholder="Search…" className="input w-full" />
          </form>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t border-border bg-card">
            <div className="container-responsive py-2 flex flex-col gap-2">
              <Link to="/" className="btn" onClick={()=>setMenuOpen(false)}>Home</Link>
              <Link to="/study" className="btn" onClick={()=>setMenuOpen(false)}>Study Areas</Link>
              <details className="bg-card border border-border rounded-xl">
                <summary className="px-3 py-2 cursor-pointer font-medium">Browse all</summary>
                <div className="p-2">
                  {DOMAINS.map(d => (
                    <Link key={d.id} to={`/domain/${d.id}`} className="block px-3 py-2 rounded hover:bg-muted" onClick={()=>setMenuOpen(false)}>{d.title}</Link>
                  ))}
                </div>
              </details>
              <Link to="/interview" className="btn" onClick={()=>setMenuOpen(false)}>Interview Prep</Link>
            </div>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <div className="container-responsive py-6">{children}</div>
      </main>
      <footer className="border-t border-border">
        <div className="container-responsive py-6 text-sm text-foreground/70 flex items-center justify-between">
          <span className="inline-flex items-center gap-2"><Logo size="sm"/><span>Cache it. Recall it.</span></span>
          <span>Developed by <strong>Harsh Tiwari</strong> · © {new Date().getFullYear()} BrainCache</span>
        </div>
      </footer>
      <FeedbackFab onClick={()=>setReportOpen(true)} />
      <ReportBugModal open={reportOpen} onClose={()=>setReportOpen(false)} />
    </div>
  )
}
