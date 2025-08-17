/// <reference types="vite/client" />
import yaml from 'js-yaml'
import { DOMAIN_META, SECTION_TITLES } from './domains'

export type NotePage = { id: string; title: string; content: string }
export type SubSection = { id: string; title: string; pages: NotePage[] }
export type Domain = { id: string; title: string; description: string; icon: string; sections: SubSection[] }

function titleCase(id: string){ return id.replace(/[-_]+/g, ' ').replace(/\b\w/g, s => s.toUpperCase()) }
function slugify(s: string){ return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }

function parseFrontmatter(raw: string): { data: any, content: string }{
  const m = raw.match(/^---\s*?\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/)
  if (m){
    let data: any = {}
    try { data = yaml.load(m[1]) || {} } catch { data = {} }
    return { data, content: raw.slice(m[0].length) }
  }
  return { data: {}, content: raw }
}

const files = import.meta.glob('/src/notes/**/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

type Group = Record<string, Record<string, NotePage[]>>
const grouped: Group = {}

for (const [path, raw] of Object.entries(files)){
  const parts = path.split('/').filter(Boolean)
  const idx = parts.indexOf('notes')
  const domainId = parts[idx+1]
  const sectionId = parts[idx+2]
  const fileName = parts[idx+3]
  const base = fileName.replace(/\.md$/, '')
  const fm = parseFrontmatter(raw)
  const id = (fm.data && fm.data.id) ? String(fm.data.id) : slugify(base)
  const title = (fm.data && fm.data.title) ? String(fm.data.title) : titleCase(base)
  grouped[domainId] = grouped[domainId] || {}
  grouped[domainId][sectionId] = grouped[domainId][sectionId] || []
  grouped[domainId][sectionId].push({ id, title, content: fm.content })
}

function sortPages(pages: NotePage[]): NotePage[] {
  return [...pages].sort((a,b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
}

const ORDER: Record<string, number> = { 'foundations': 0, 'java': 1, 'development': 2 }

function buildDomains(): Domain[] {
  const domains: Domain[] = []
  for (const [domainId, sectionsMap] of Object.entries(grouped)){
    const meta = DOMAIN_META[domainId] || { title: titleCase(domainId), description: '', icon: '📁' }
    const sections: SubSection[] = Object.entries(sectionsMap).map(([sectionId, pages]) => ({
      id: sectionId,
      title: SECTION_TITLES[sectionId] || titleCase(sectionId),
      pages: sortPages(pages)
    })).sort((a,b)=> a.title.localeCompare(b.title))
    domains.push({ id: domainId, title: meta.title, description: meta.description, icon: meta.icon, sections })
  }
  return domains.sort((a,b)=> {
    const ai = ORDER[a.id] ?? 99
    const bi = ORDER[b.id] ?? 99
    if (ai !== bi) return ai - bi
    return a.title.localeCompare(b.title)
  })
}

export const DOMAINS: Domain[] = buildDomains()
