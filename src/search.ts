import Fuse from 'fuse.js'
import { DOMAINS } from './content/contentIndex'
import { INTERVIEW } from './content/interview'
export type SearchHit = { title: string; path: string }
function slugify(s: string){ return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }
function extractHeadings(md: string){ const lines = md.split(/\n/); const hs:any[]=[]; for (const line of lines){ const h2=/^##\s+(.+)/.exec(line); const h3=/^###\s+(.+)/.exec(line); if (h2){ const text=h2[1].trim(); hs.push({depth:2,text,id:slugify(text)}) } else if (h3){ const text=h3[1].trim(); hs.push({depth:3,text,id:slugify(text)}) } } return hs }
type Item = { title: string; path: string }
function buildItems(): Item[] {
  const items: Item[] = []
  for (const d of DOMAINS){ for (const s of d.sections){ for (const p of s.pages){
    items.push({ title: `${d.title} › ${s.title} › ${p.title}`, path: `/domain/${d.id}/section/${s.id}/page/${p.id}` })
    for (const h of extractHeadings(p.content)){ items.push({ title: `${p.title} › ${h.text}`, path: `/domain/${d.id}/section/${s.id}/page/${p.id}#${h.id}` }) }
  } } }
  for (const s of INTERVIEW){ for (const p of s.pages){
    items.push({ title: `Interview › ${s.title} › ${p.title}`, path: `/interview/section/${s.id}/page/${p.id}` })
    for (const h of extractHeadings(p.content)){ items.push({ title: `${p.title} › ${h.text}`, path: `/interview/section/${s.id}/page/${p.id}#${h.id}` }) }
  } }
  return items
}
const ITEMS = buildItems()
const fuse = new Fuse(ITEMS, { includeScore: true, threshold: 0.34, minMatchCharLength: 2, ignoreLocation: true, keys: [{ name: 'title', weight: 1.0 }] })
export function searchAll(query: string): SearchHit[] { const q = query.trim(); if (!q) return []; return fuse.search(q).map(r => ({ title: r.item.title, path: r.item.path })) }
