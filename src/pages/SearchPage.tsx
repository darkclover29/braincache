import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { searchAll } from '../search'
import { motion } from 'framer-motion'

export default function SearchPage(){
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = searchAll(q)
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>
      <Breadcrumbs items={[{label:'Home', to:'/'}, {label: 'Search'}]} />
      <div className="flex items-center gap-2 mb-4"><h1 className="text-2xl sm:text-3xl font-bold">Search</h1></div>
      <div className="card p-4">
        <div className="text-sm text-foreground/70 mb-3">{results.length} result(s) for <span className="font-medium">"{q}"</span></div>
        <motion.ul className="space-y-3" initial="hidden" animate="show" variants={{hidden:{}, show:{ transition:{ staggerChildren:.04 }}}}>
          {results.map((r, idx)=>(
            <motion.li key={idx} className="border-b last:border-b-0 border-border pb-3" variants={{hidden:{opacity:0, y:6}, show:{opacity:1, y:0}}}>
              <Link to={r.path} className="font-semibold hover:underline">{r.title}</Link>
            </motion.li>
          ))}
          {results.length===0 && <div className="text-foreground/70">Try a different query.</div>}
        </motion.ul>
      </div>
    </motion.div>
  )
}
