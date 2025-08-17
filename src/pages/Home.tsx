import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DOMAINS } from '../content/contentIndex'
import { INTERVIEW } from '../content/interview'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'

const ACCENTS: Record<string, { bar: string, pillBg: string, pillBorder: string }> = {
  'foundations': { bar: '#3b82f6', pillBg: 'rgba(59,130,246,0.12)', pillBorder: 'rgba(59,130,246,0.35)' },
  'java':        { bar: '#f59e0b', pillBg: 'rgba(245,158,11,0.12)', pillBorder: 'rgba(245,158,11,0.35)' },
  'development': { bar: '#8b5cf6', pillBg: 'rgba(139,92,246,0.12)', pillBorder: 'rgba(139,92,246,0.35)' },
}
const INT_ACCENTS: Record<string, { bar: string, pillBg: string, pillBorder: string }> = {
  'cs':          { bar: '#10b981', pillBg: 'rgba(16,185,129,0.12)', pillBorder: 'rgba(16,185,129,0.35)' },
  'java':        { bar: '#f59e0b', pillBg: 'rgba(245,158,11,0.12)', pillBorder: 'rgba(245,158,11,0.35)' },
  'react':       { bar: '#8b5cf6', pillBg: 'rgba(139,92,246,0.12)', pillBorder: 'rgba(139,92,246,0.35)' },
  'spring-boot': { bar: '#10b981', pillBg: 'rgba(16,185,129,0.12)', pillBorder: 'rgba(16,185,129,0.35)' },
  'sql':         { bar: '#06b6d4', pillBg: 'rgba(6,182,212,0.12)', pillBorder: 'rgba(6,182,212,0.35)' },
}

export default function Home(){
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('braincache.welcome.v1'))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => { if (e.key === '/'){ e.preventDefault(); inputRef.current?.focus() } }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cards = useMemo(()=> DOMAINS.map(d => ({
    id: d.id, icon: d.icon ?? '📁', title: d.title, description: d.description,
    sectionCount: d.sections.length, pageCount: d.sections.reduce((sum, s) => sum + s.pages.length, 0)
  })), [DOMAINS])

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input[name=q]') as HTMLInputElement
    const q = input.value.trim()
    if (q) navigate('/search?q=' + encodeURIComponent(q))
  }

  function dismissWelcome(){ localStorage.setItem('braincache.welcome.v1', '1'); setShowWelcome(false) }

  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}} className="space-y-10">
      <section className="hero rounded-3xl p-8 sm:p-12 border border-border relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Logo size="lg" withText={false}/>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">BrainCache</h1>
          </div>
          <p className="text-foreground/70 mt-3 max-w-2xl">
            Cache it. Recall it. Drop Markdown files and they appear automatically.
          </p>

          <form onSubmit={onSearchSubmit} className="mt-6 max-w-xl">
            <div className="flex items-stretch gap-2">
              <input name="q" placeholder="Search…" className="input flex-1 h-11 text-[15px]" ref={inputRef} />
              <button className="btn btn-primary h-11 px-4">Search</button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
              <span className="opacity-70">Quick links:</span>
              {DOMAINS.map(d => <Link key={d.id} to={`/domain/${d.id}`} className="btn px-2 py-1 rounded-lg">{d.title}</Link>)}
              <Link to={`/interview`} className="btn px-2 py-1 rounded-lg">Interview Prep</Link>
              <Link to={`/study`} className="btn px-2 py-1 rounded-lg">Study Areas</Link>
            </div>
          </form>
        </div>
      </section>

      {showWelcome && (
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">Welcome to BrainCache 👋</div>
              <div className="text-foreground/70 text-sm mt-1">
                Drop Markdown files into <code>src/notes/&lt;domain&gt;/&lt;section&gt;/</code>. The site auto-indexes them.
              </div>
            </div>
            <button className="btn btn-primary" onClick={dismissWelcome}>Got it</button>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Study Areas</h2>
          <Link to="/study" className="text-sm hover:underline">View all</Link>
        </div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .06 } } }}>
          {cards.map(c => {
            const accent = ACCENTS[c.id] ?? { bar: '#64748b', pillBg: 'rgba(100,116,139,0.12)', pillBorder: 'rgba(100,116,139,0.35)' }
            return (
              <Link key={c.id} to={`/domain/${c.id}`} className="block h-full">
                <motion.div className="card p-6 h-full transition relative overflow-hidden" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                  <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundColor: accent.bar }} />
                  <div className="flex items-start gap-4">
                    <div className="pill-emoji" style={{ background: accent.pillBg, border: '1px solid ' + accent.pillBorder }}>{c.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{c.title}</div>
                      <div className="text-sm text-foreground/70 mt-1">{c.description}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-foreground/70">
                    <span className="badge">{c.sectionCount} sections</span>
                    <span className="badge">{c.pageCount} pages</span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </motion.div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Interview Prep</h2>
          <Link to="/interview" className="text-sm hover:underline">View all</Link>
        </div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .06 } } }}>
          {INTERVIEW.map(s => {
            const accent = INT_ACCENTS[s.id] ?? { bar: '#64748b', pillBg: 'rgba(100,116,139,0.12)', pillBorder: 'rgba(100,116,139,0.35)' }
            return (
              <Link key={s.id} to={`/interview/section/${s.id}`} className="block h-full">
                <motion.div className="card p-6 h-full transition relative overflow-hidden" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{y:-3}}>
                  <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundColor: accent.bar }} />
                  <div className="flex items-start gap-4">
                    <div className="pill-emoji" style={{ background: accent.pillBg, border: '1px solid ' + accent.pillBorder }}>{s.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">{s.title}</div>
                      <div className="text-sm text-foreground/70 mt-1">Topic‑wise questions with answers</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-foreground/70">
                    <span className="badge">{s.pages.length} pages</span>
                    <span className="badge">Q&A</span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </motion.div>
      </section>
    </motion.div>
  )
}
