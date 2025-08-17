import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { DOMAINS } from '../content/contentIndex'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'

const ACCENTS: Record<string, { bar: string, pillBg: string, pillBorder: string }> = {
  'foundations': { bar: '#3b82f6', pillBg: 'rgba(59,130,246,0.12)', pillBorder: 'rgba(59,130,246,0.35)' },
  'java':        { bar: '#f59e0b', pillBg: 'rgba(245,158,11,0.12)', pillBorder: 'rgba(245,158,11,0.35)' },
  'development': { bar: '#8b5cf6', pillBg: 'rgba(139,92,246,0.12)', pillBorder: 'rgba(139,92,246,0.35)' },
}

export default function StudyHome(){
  const cards = useMemo(()=> DOMAINS.map(d => ({
    id: d.id, icon: d.icon ?? '📁', title: d.title, description: d.description,
    sectionCount: d.sections.length, pageCount: d.sections.reduce((sum, s) => sum + s.pages.length, 0)
  })), [DOMAINS])

  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}} className="space-y-8">
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label:'Study Areas'}]} />
      <section className="hero rounded-3xl p-7 sm:p-10 border border-border relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <Logo size="lg" withText={false} />
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Study Areas</h1>
            <p className="text-foreground/70 mt-1 max-w-2xl">Browse all knowledge domains. Each domain contains sections, and each section auto‑lists Markdown pages you drop into <code>src/notes/&lt;domain&gt;/&lt;section&gt;/</code>.</p>
          </div>
        </div>
      </section>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .06 } } }}>
        {cards.map(c => {
          const accent = ACCENTS[c.id] ?? { bar: '#64748b', pillBg: 'rgba(100,116,139,0.12)', pillBorder: 'rgba(100,116,139,0.35)' }
          return (
            <Link key={c.id} to={`/domain/${c.id}`} className="block h-full">
              <motion.div className="card p-6 h-full transition relative overflow-hidden" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} whileHover={{y:-3}}>
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
    </motion.div>
  )
}
