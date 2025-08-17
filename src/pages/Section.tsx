import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { DOMAINS } from '../content/contentIndex'
import { motion } from 'framer-motion'

export default function Section(){
  const { domainId, sectionId } = useParams()
  const domain = DOMAINS.find(d => d.id === domainId)
  const section = domain?.sections.find(s => s.id === sectionId)
  if (!domain || !section) return <div>Section not found.</div>
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label:'Study Areas', to:'/study'}, {label: domain.title, to:`/domain/${domain.id}`}, {label: section.title}]} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">{section.title}</h1>
      <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="show" variants={{hidden:{}, show:{ transition:{ staggerChildren:.05 }}}}>
        {section.pages.map(p => (
          <motion.li key={p.id} variants={{hidden:{opacity:0, y:8}, show:{opacity:1, y:0}}}>
            <Link to={`page/${p.id}`} className="card p-4 transition h-full block">
              <div className="font-semibold">{p.title}</div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}
