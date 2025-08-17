import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { DOMAINS } from '../content/contentIndex'
import { motion } from 'framer-motion'

const ACCENTS: Record<string, string> = { 'foundations': '#3b82f6', 'java': '#f59e0b', 'development': '#8b5cf6' }

export default function Domain(){
  const { domainId } = useParams()
  const domain = DOMAINS.find(d => d.id === domainId)
  if (!domain) return <div>Domain not found.</div>
  const bar = ACCENTS[domain.id] ?? '#64748b'
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label: 'Study Areas', to:'/study'}, {label: domain.title}]} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">{domain.title}</h1>
      <div className="h-1 w-24 mb-4 rounded" style={{ backgroundColor: bar }} />
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="show" variants={{hidden:{}, show:{ transition:{ staggerChildren:.05 }}}}>
        {domain.sections.map(sec => (
          <Link key={sec.id} to={`/domain/${domain.id}/section/${sec.id}`} className="block h-full">
            <motion.div className="card p-4 transition h-full" whileHover={{y:-3}} variants={{hidden:{opacity:0, y:8}, show:{opacity:1, y:0}}}>
              <div className="text-lg font-semibold">{sec.title}</div>
              <div className="text-sm text-foreground/70 mt-1">{sec.pages.length} pages</div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
