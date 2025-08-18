import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { DOMAINS } from '../content/contentIndex'
import MarkdownRenderer, { extractHeadings } from '../components/MarkdownRenderer'
import { motion } from 'framer-motion'
import { useDrawer } from '../state/DrawerContext'

export default function PageView(){
  const { domainId, sectionId, pageId } = useParams()
  const drawer = useDrawer()

  const domain = DOMAINS.find(d => d.id === domainId)
  const section = domain?.sections.find(s => s.id === sectionId)
  const page = section?.pages.find(p => p.id === pageId)

  // Scrollspy (desktop TOC highlight)
  const headings = useMemo(()=> extractHeadings(page?.content ?? ''), [page?.content])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(()=>{
    const article = document.querySelector('.page-content')
    if (!article) return
    const hs = Array.from(article.querySelectorAll('h2, h3')) as HTMLElement[]
    const obs = new IntersectionObserver((entries)=>{
      const visible = entries
        .filter(e=> e.isIntersecting)
        .sort((a,b)=> (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
      const fallback = entries.sort((a,b)=>
        Math.abs((a.target as HTMLElement).getBoundingClientRect().top) -
        Math.abs((b.target as HTMLElement).getBoundingClientRect().top)
      )[0]
      const target = visible[0] || fallback
      if (target){ setActiveId((target.target as HTMLElement).id || null) }
    }, { rootMargin: '0px 0px -60% 0px', threshold: [0, 1.0] })
    hs.forEach(h => obs.observe(h))
    return ()=> obs.disconnect()
  }, [page?.id])

  // Feed drawer with contextual data (Sections + TOC)
  useEffect(()=>{
    if (!section) {
      drawer.setSections([])
    } else {
      const links = section.pages.map(p => ({
        title: p.title,
        href: `/domain/${domain!.id}/section/${section.id}/page/${p.id}`
      }))
      drawer.setSections(links)
    }
    drawer.setToc(headings)
    // Clear interview tab for this page context
    drawer.setInterviewLinks([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainId, sectionId, pageId, section, headings])

  if (!domain || !section || !page) return <div>Page not found.</div>

  // Desktop left sidebar contents
  const SectionSidebar = () => (
    <div className="sidebar-nav">
      {/* Sections group */}
      <div className="group">
        <div className="group-header" aria-expanded="true">
          <span className="left">
            <span className="chev open">▸</span>
            <span>Sections</span>
          </span>
          <span className="count">{section.pages.length}</span>
        </div>
        <ul className="group-body">
          {section.pages.map(p => (
            <li key={p.id}>
              <Link
                to={`/domain/${domain.id}/section/${section.id}/page/${p.id}`}
                className={`${p.id===page.id ? 'active' : ''}`}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* TOC group */}
      <div className="group">
        <div className="group-header" aria-expanded="true">
          <span className="left">
            <span className="chev open">▸</span>
            <span>On this page</span>
          </span>
          <span className="count">{headings.length}</span>
        </div>
        <ul className="group-body">
          {headings.length === 0 && (
            <li className="text-xs text-foreground/70 px-2 py-1">No subheadings on this page.</li>
          )}
          {headings.map(h => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`${activeId===h.id ? 'active' : ''} ${h.depth===3 ? 'depth-3' : ''}`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
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

      {/* Mobile quick actions to open the unified drawer */}
      <div className="md:hidden mb-3 flex gap-2">
        <button className="chip" onClick={()=>drawer.open('sections')}>Sections</button>
        <button className="chip" onClick={()=>drawer.open('toc')}>On this page</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desktop left nav */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="card p-0 sticky top-20">
            <SectionSidebar />
          </div>
        </aside>

        {/* Main content + Desktop right TOC */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{page.title}</h1>
            {/* No mobile sidebar toggle here anymore; use unified drawer buttons above */}
          </div>

          <div className="card p-5">
            <MarkdownRenderer content={page.content} />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link to={`/domain/${domain.id}/section/${section.id}`} className="btn">← Back to {section.title}</Link>
            <button className="btn" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Top</button>
          </div>
        </main>

        {/* Desktop right TOC (sticky) */}
        <aside className="hidden xl:block xl:col-span-3">
          <div className="sticky top-20">
            <div className="text-xs uppercase text-foreground/60 mb-2">On this page</div>
            <ul className="space-y-1">
              {headings.map(h => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block px-3 py-1 rounded hover:bg-muted ${h.depth===3 ? 'pl-5 text-sm' : ''} ${activeId===h.id ? 'active' : ''}`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
