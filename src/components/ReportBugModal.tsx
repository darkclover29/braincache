import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function ReportBugModal({ open, onClose }: { open: boolean, onClose: ()=>void }){
  const loc = useLocation()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'bug'|'content'|'typo'|'feature'>('bug')
  const [desc, setDesc] = useState('')
  const [email, setEmail] = useState('')

  const body = useMemo(()=>{
    const lines = [
      `Type: ${type.toUpperCase()}`,
      `Page: ${location.origin}${loc.pathname}${loc.search}${loc.hash}`,
      `Title: ${title}`,
      `Description:`,
      desc,
      '',
      email ? `Reporter: ${email}` : ''
    ]
    return lines.join('\n')
  }, [title, type, desc, email, loc])

  function openMail(){
    const subject = encodeURIComponent(`[BrainCache] ${type.toUpperCase()}: ${title || '(no title)'}`)
    const content = encodeURIComponent(body)
    const mailto = `mailto:harshtiwari493@gmail.com?subject=${subject}&body=${content}`
    window.location.href = mailto
  }

  async function copyBody(){
    try{ await navigator.clipboard.writeText(body) } catch(_){}
  }

  if (!open) return null
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Report issue">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card p-5 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xl font-semibold">Report an issue</div>
            <div className="text-sm text-foreground/70">This opens your email client and drafts a message to <span className="font-medium">harshtiwari493@gmail.com</span>.</div>
          </div>
          <button className="btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input className="input" placeholder="Short summary" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select className="input" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="bug">Bug</option>
              <option value="content">Content issue</option>
              <option value="typo">Typo</option>
              <option value="feature">Feature request</option>
            </select>
          </div>
        </div>
        <div className="space-y-2 mt-3">
          <label className="text-sm font-medium">Description</label>
          <textarea className="input" rows={6} placeholder="Steps to reproduce, what you expected, what happened…" value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>
        <div className="space-y-2 mt-3">
          <label className="text-sm font-medium">Your email (optional)</label>
          <input className="input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button className="btn btn-primary" onClick={openMail}>📧 Open email</button>
          <button className="btn" onClick={copyBody}>Copy details</button>
          <div className="text-xs text-foreground/60">No server needed — uses a mailto: link.</div>
        </div>
      </div>
    </div>
  )
}
