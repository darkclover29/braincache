import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import { INTERVIEW } from '../../content/interview'
import { motion } from 'framer-motion'

export default function InterviewSection(){
  const { sectionId } = useParams()
  const section = INTERVIEW.find(s => s.id === sectionId)
  if (!section) return <div>Section not found.</div>
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label:'Interview Prep', to:'/interview'}, {label: section.title}]} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">{section.title}</h1>
      <div className="h-1 w-24 mb-4 rounded" style={{ backgroundColor: '#10b981' }} />
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
