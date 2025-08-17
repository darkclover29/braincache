import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeName, THEME_LABELS, applyTheme, getInitialTheme, listenSystemTheme } from '../theme'

const ORDER: ThemeName[] = ['system','light','dark','dracula','solarizedLight','solarizedDark','oneDark','monokai','nord','gruvboxDark','gruvboxLight','catppuccinMocha','ayuDark']

function iconFor(t: ThemeName){
  switch(t){
    case 'system': return '🖥️'
    case 'light': return '☀️'
    case 'dark': return '🌙'
    case 'dracula': return '🧛'
    case 'solarizedLight': return '🌤️'
    case 'solarizedDark': return '🌆'
    case 'oneDark': return '🎯'
    case 'monokai': return '🌈'
    case 'nord': return '❄️'
    case 'gruvboxDark': return '🧱'
    case 'gruvboxLight': return '🧱'
    case 'catppuccinMocha': return '🥛'
    case 'ayuDark': return '🌙'
  }
}

export default function ThemeSwitcher(){
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeName>('system')

  useEffect(()=>{
    const initial = getInitialTheme()
    setTheme(initial)
    applyTheme(initial)
    const off = listenSystemTheme()
    return off
  }, [])

  function choose(t: ThemeName){
    setTheme(t)
    applyTheme(t)
    setOpen(false)
  }

  const label = THEME_LABELS[theme] || 'Theme'

  return (
    <div className="relative">
      <button className="btn" onClick={()=>setOpen(v=>!v)} aria-haspopup="true" aria-expanded={open} aria-label="Theme menu">
        <span>🎨</span>
        <span className="hidden sm:inline">{label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-xl shadow-lg p-2 z-50"
            initial={{opacity:0, y:4}} animate={{opacity:1, y:0}} exit={{opacity:0, y:4}}>
            {ORDER.map(t => (
              <button key={t} className={"w-full text-left px-3 py-2 rounded hover:bg-muted flex items-center gap-2 " + (t===theme ? "font-semibold" : "")} onClick={()=>choose(t)}>
                <span>{iconFor(t)}</span>
                <span>{THEME_LABELS[t]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
