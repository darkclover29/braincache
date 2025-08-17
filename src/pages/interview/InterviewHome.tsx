import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import { INTERVIEW } from '../../content/interview'
import { motion } from 'framer-motion'
import Logo from '../../components/Logo'

const INT_ACCENTS: Record<string, { bar: string, pillBg: string, pillBorder: string }> = {
  'cs':          { bar: '#10b981', pillBg: 'rgba(16,185,129,0.12)', pillBorder: 'rgba(16,185,129,0.35)' },
  'java':        { bar: '#f59e0b', pillBg: 'rgba(245,158,11,0.12)', pillBorder: 'rgba(245,158,11,0.35)' },
  'react':       { bar: '#8b5cf6', pillBg: 'rgba(139,92,246,0.12)', pillBorder: 'rgba(139,92,246,0.35)' },
  'spring-boot': { bar: '#10b981', pillBg: 'rgba(16,185,129,0.12)', pillBorder: 'rgba(16,185,129,0.35)' },
  'sql':         { bar: '#06b6d4', pillBg: 'rgba(6,182,212,0.12)', pillBorder: 'rgba(6,182,212,0.35)' },
}

export default function InterviewHome(){
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label:'Interview Prep'}]} />
      <section className="hero rounded-3xl p-7 sm:p-10 border border-border relative overflow-hidden mb-6">
        <div className="relative z-10 flex items-center gap-3">
          <Logo size="lg" withText={false} />
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Interview Prep</h1>
            <p className="text-foreground/70 mt-1 max-w-2xl">Topic‑wise Q&A. Expand the answers, or use search to jump straight to a question heading.</p>
          </div>
        </div>
      </section>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" animate="show" variants={{hidden:{}, show:{ transition:{ staggerChildren:.05 }}}}>
        {INTERVIEW.map(s => {
          const accent = INT_ACCENTS[s.id] ?? { bar: '#64748b', pillBg: 'rgba(100,116,139,0.12)', pillBorder: 'rgba(100,116,139,0.35)' }
          return (
            <Link key={s.id} to={`/interview/section/${s.id}`} className="block h-full">
              <motion.div className="card p-6 h-full transition relative overflow-hidden" whileHover={{y:-3}} variants={{hidden:{opacity:0, y:8}, show:{opacity:1, y:0}}}>
                <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundColor: accent.bar }} />
                <div className="flex items-start gap-4">
                  <div className="pill-emoji" style={{ background: accent.pillBg, border: '1px solid ' + accent.pillBorder }}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">{s.title}</div>
                    <div className="text-sm text-foreground/70 mt-1">{s.pages.length} pages</div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
