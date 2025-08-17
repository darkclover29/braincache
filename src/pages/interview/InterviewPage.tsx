import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumbs from '../../components/Breadcrumbs'
import { INTERVIEW } from '../../content/interview'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import { motion } from 'framer-motion'

export default function InterviewPage(){
  const { sectionId, pageId } = useParams()
  const section = INTERVIEW.find(s => s.id === sectionId)
  const page = section?.pages.find(p => p.id === pageId)
  if (!section || !page) return <div>Page not found.</div>

  function expandAll(open: boolean){
    const container = document.querySelector('.page-content')
    if (!container) return
    container.querySelectorAll('details').forEach((d:any) => d.open = open)
  }

  useEffect(()=>{ window.scrollTo({ top: 0 }) }, [page?.id])

  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label:'Interview Prep', to:'/interview'}, {label: section.title, to:`/interview/section/${section.id}`}, {label: page.title}]} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{page.title}</h1>
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <button className="btn" onClick={()=>expandAll(true)}>Expand all</button>
          <button className="btn" onClick={()=>expandAll(false)}>Collapse all</button>
        </div>
        <MarkdownRenderer content={page.content} />
      </div>
      <div className="mt-4">
        <Link to={`/interview/section/${section.id}`} className="btn">← Back to {section.title}</Link>
      </div>
    </motion.div>
  )
}
