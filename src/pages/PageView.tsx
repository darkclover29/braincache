import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { DOMAINS } from '../content/contentIndex'
import MarkdownRenderer, { extractHeadings } from '../components/MarkdownRenderer'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageView(){
  const { domainId, sectionId, pageId } = useParams()
  const domain = DOMAINS.find(d => d.id === domainId)
  const section = domain?.sections.find(s => s.id === sectionId)
  const page = section?.pages.find(p => p.id === pageId)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectionListOpen, setSectionListOpen] = useState(true)
  const [tocOpen, setTocOpen] = useState(true)
  const headings = useMemo(()=> extractHeadings(page?.content ?? ''), [page?.content])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(()=>{
    const article = document.querySelector('.page-content')
    if (!article) return
    const hs = Array.from(article.querySelectorAll('h2, h3')) as HTMLElement[]
    const obs = new IntersectionObserver((entries)=>{
      const visible = entries.filter(e=> e.isIntersecting).sort((a,b)=> (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
      const target = visible[0] || entries.sort((a,b)=> Math.abs((a.target as HTMLElement).getBoundingClientRect().top) - Math.abs((b.target as HTMLElement).getBoundingClientRect().top))[0]
      if (target){ setActiveId((target.target as HTMLElement).id || null) }
    }, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1.0] })
    hs.forEach(h => obs.observe(h)); return ()=> obs.disconnect()
  }, [page?.id])

  if (!domain || !section || !page) return <div>Page not found.</div>

  const SectionSidebar = () => (
    <div className="sidebar-nav">
      {/* Sections group */}
      <div className="group">
        <button className="group-header" onClick={()=>setSectionListOpen(v=>!v)} aria-expanded={sectionListOpen}>
          <span className="left">
            <span className={'chev ' + (sectionListOpen ? 'open' : '')}>▸</span>
            <span>Sections</span>
          </span>
          <span className="count">{section.pages.length}</span>
        </button>
        <AnimatePresence initial={false}>
          {sectionListOpen && (
            <motion.ul key="section-list" className="group-body" initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{ overflow: 'hidden' }}>
              {section.pages.map(p => (
                <li key={p.id}>
                  <Link to={`/domain/${domain.id}/section/${section.id}/page/${p.id}`} className={` ${p.id===page.id ? 'active' : ''}`} onClick={()=>setSidebarOpen(false)}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* TOC group */}
      <div className="group">
        <button className="group-header" onClick={()=>setTocOpen(v=>!v)} aria-expanded={tocOpen}>
          <span className="left">
            <span className={'chev ' + (tocOpen ? 'open' : '')}>▸</span>
            <span>On this page</span>
          </span>
          <span className="count">{headings.length}</span>
        </button>
        <AnimatePresence initial={false}>
          {tocOpen && (
            <motion.ul key="toc" className="group-body" initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{ overflow: 'hidden' }}>
              {headings.map(h => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className={` ${activeId===h.id ? 'active' : ''} ${h.depth===3 ? 'depth-3' : ''}`} onClick={()=>setSidebarOpen(false)}>
                    {h.text}
                  </a>
                </li>
              ))}
              {headings.length===0 && <li className="text-xs text-foreground/70 px-2 py-1">No subheadings on this page.</li>}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-only close */}
      <div className="px-3 py-3 lg:hidden">
        <button className="btn w-full" onClick={()=>setSidebarOpen(false)}>✕ Close</button>
      </div>
    </div>
  )

  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[
        {label:'Home', to:'/'}, 
        {label:'Study Areas', to:'/study'},
        {label: domain.title, to:`/domain/${domain.id}`},
        {label: section.title, to:`/domain/${domain.id}/section/${section.id}`},
        {label: page.title}
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="card p-0 sticky top-20">
            <SectionSidebar />
          </div>
        </aside>

        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{page.title}</h1>
            {!sidebarOpen ? (
              <button className="lg:hidden btn" aria-label="Open index" onClick={()=>setSidebarOpen(true)}>☰ Index</button>
            ) : (
              <button className="lg:hidden btn" aria-label="Close index" onClick={()=>setSidebarOpen(false)}>✕ Close</button>
            )}
          </div>
          <div className="card p-5">
            <MarkdownRenderer content={page.content} />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Link to={`/domain/${domain.id}/section/${section.id}`} className="btn">← Back to {section.title}</Link>
            <button className="btn" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Top</button>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-40" onClick={()=>setSidebarOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
            <motion.aside className="fixed inset-y-0 left-0 w-80 max-w-[85%] z-50 bg-card border-r border-border rounded-r-2xl shadow-lg" initial={{x:-320}} animate={{x:0}} exit={{x:-320}} transition={{type:'tween', duration:.2}}>
              <SectionSidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
