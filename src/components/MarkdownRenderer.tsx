import React, { useEffect, useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import mermaid, { MermaidConfig } from 'mermaid'
import 'highlight.js/styles/github-dark.css'

export type Heading = { depth: number; text: string; id: string }

function slugify(s: string){ return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }

export function extractHeadings(md: string): Heading[] {
  const lines = md.split(/\n/)
  const headings: Heading[] = []
  for (const line of lines){
    const h2 = /^##\s+(.+)/.exec(line)
    const h3 = /^###\s+(.+)/.exec(line)
    if (h2){ const text = h2[1].trim(); headings.push({ depth: 2, text, id: slugify(text) }) }
    else if (h3){ const text = h3[1].trim(); headings.push({ depth: 3, text, id: slugify(text) }) }
  }
  return headings
}

// Map our UI theme classes -> Mermaid themes / themeVariables
function getMermaidConfig(): MermaidConfig {
  const root = document.documentElement
  const classes = Array.from(root.classList)
  const is = (cls: string) => classes.includes(cls)

  // Default light/dark quick mapping
  if (is('theme-light')) return { startOnLoad:false, securityLevel:'strict', theme:'default' }
  if (is('theme-dark'))  return { startOnLoad:false, securityLevel:'strict', theme:'dark' }

  // Build custom palettes for popular themes using base + themeVariables
  const base = { startOnLoad:false, securityLevel:'strict', theme:'base' as const }

  if (is('theme-dracula')){
    return {
      ...base,
      themeVariables: {
        background: '#282a36',
        primaryColor: '#bd93f9',
        primaryTextColor: '#f8f8f2',
        primaryBorderColor: '#bd93f9',
        lineColor: '#6272a4',
        secondaryColor: '#44475a',
        tertiaryColor: '#6272a4',
        textColor: '#f8f8f2',
        nodeTextColor: '#f8f8f2',
        clusterBkg: '#44475a',
        clusterBorder: '#bd93f9'
      }
    }
  }
  if (is('theme-solarized-light')){
    return {
      ...base,
      themeVariables: {
        background: '#fdf6e3',
        primaryColor: '#eee8d5',
        primaryTextColor: '#586e75',
        primaryBorderColor: '#268bd2',
        lineColor: '#268bd2',
        secondaryColor: '#eee8d5',
        tertiaryColor: '#93a1a1',
        textColor: '#586e75',
        nodeTextColor: '#586e75',
        clusterBkg: '#eee8d5',
        clusterBorder: '#268bd2'
      }
    }
  }
  if (is('theme-solarized-dark')){
    return {
      ...base,
      themeVariables: {
        background: '#002b36',
        primaryColor: '#073642',
        primaryTextColor: '#eee8d5',
        primaryBorderColor: '#268bd2',
        lineColor: '#268bd2',
        secondaryColor: '#073642',
        tertiaryColor: '#586e75',
        textColor: '#eee8d5',
        nodeTextColor: '#eee8d5',
        clusterBkg: '#073642',
        clusterBorder: '#268bd2'
      }
    }
  }
  if (is('theme-one-dark')){
    return {
      ...base,
      themeVariables: {
        background: '#282c34',
        primaryColor: '#313640',
        primaryTextColor: '#abb2bf',
        primaryBorderColor: '#61afef',
        lineColor: '#61afef',
        secondaryColor: '#3b4048',
        tertiaryColor: '#98c379',
        textColor: '#abb2bf',
        nodeTextColor: '#abb2bf',
        clusterBkg: '#313640',
        clusterBorder: '#61afef'
      }
    }
  }
  if (is('theme-monokai')){
    return {
      ...base,
      themeVariables: {
        background: '#272822',
        primaryColor: '#3e3d32',
        primaryTextColor: '#f8f8f2',
        primaryBorderColor: '#a6e22e',
        lineColor: '#66d9ef',
        secondaryColor: '#75715e',
        tertiaryColor: '#f92672',
        textColor: '#f8f8f2',
        nodeTextColor: '#f8f8f2',
        clusterBkg: '#3e3d32',
        clusterBorder: '#a6e22e'
      }
    }
  }
  if (is('theme-nord')){
    return {
      ...base,
      themeVariables: {
        background: '#2e3440',
        primaryColor: '#3b4252',
        primaryTextColor: '#d8dee9',
        primaryBorderColor: '#88c0d0',
        lineColor: '#88c0d0',
        secondaryColor: '#434c5e',
        tertiaryColor: '#81a1c1',
        textColor: '#d8dee9',
        nodeTextColor: '#d8dee9',
        clusterBkg: '#3b4252',
        clusterBorder: '#88c0d0'
      }
    }
  }
  if (is('theme-gruvbox-dark')){
    return {
      ...base,
      themeVariables: {
        background: '#282828',
        primaryColor: '#3c3836',
        primaryTextColor: '#ebdbb2',
        primaryBorderColor: '#fabd2f',
        lineColor: '#fabd2f',
        secondaryColor: '#504945',
        tertiaryColor: '#83a598',
        textColor: '#ebdbb2',
        nodeTextColor: '#ebdbb2',
        clusterBkg: '#3c3836',
        clusterBorder: '#fabd2f'
      }
    }
  }
  if (is('theme-gruvbox-light')){
    return {
      ...base,
      themeVariables: {
        background: '#fbf1c7',
        primaryColor: '#f2e5bc',
        primaryTextColor: '#3c3836',
        primaryBorderColor: '#cc241d',
        lineColor: '#cc241d',
        secondaryColor: '#ebdbb2',
        tertiaryColor: '#458588',
        textColor: '#3c3836',
        nodeTextColor: '#3c3836',
        clusterBkg: '#f2e5bc',
        clusterBorder: '#cc241d'
      }
    }
  }
  if (is('theme-catppuccin-mocha')){
    return {
      ...base,
      themeVariables: {
        background: '#1e1e2e',
        primaryColor: '#181825',
        primaryTextColor: '#cdd6f4',
        primaryBorderColor: '#89b4fa',
        lineColor: '#89b4fa',
        secondaryColor: '#313244',
        tertiaryColor: '#f38ba8',
        textColor: '#cdd6f4',
        nodeTextColor: '#cdd6f4',
        clusterBkg: '#181825',
        clusterBorder: '#89b4fa'
      }
    }
  }
  if (is('theme-ayu-dark')){
    return {
      ...base,
      themeVariables: {
        background: '#1f2430',
        primaryColor: '#141a24',
        primaryTextColor: '#d9d7ce',
        primaryBorderColor: '#ffcb6b',
        lineColor: '#ffcb6b',
        secondaryColor: '#394151',
        tertiaryColor: '#5ccfe6',
        textColor: '#d9d7ce',
        nodeTextColor: '#d9d7ce',
        clusterBkg: '#141a24',
        clusterBorder: '#ffcb6b'
      }
    }
  }

  // Fallback: honor dark class if present
  if (classes.includes('dark')) return { startOnLoad:false, securityLevel:'strict', theme:'dark' }
  return { startOnLoad:false, securityLevel:'strict', theme:'default' }
}

marked.use({
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

export default function MarkdownRenderer({ content }:{ content: string }){
  const html = useMemo(()=>{
    const renderer = new marked.Renderer()
    renderer.heading = (text: string, level: number) => {
      const id = slugify(text)
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    renderer.code = (code: string, infostring?: string) => {
      const lang = (infostring || '').trim().toLowerCase()
      if (lang === 'mermaid') {
        const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        return `<pre class="mermaid">${escaped}</pre>`
      }
      return marked.Renderer.prototype.code!.call(renderer, code, infostring, false) as string
    }
    const parsed = marked.parse(content, { renderer }) as string
    return DOMPurify.sanitize(parsed)
  }, [content])

  useEffect(()=>{
    if (location.hash){
      const el = document.querySelector(location.hash)
      if (el) el.scrollIntoView()
    }

    const container = document.querySelector('.page-content')
    if (container){
      // Copy buttons for regular code
      const pres = container.querySelectorAll('pre > code')
      pres.forEach(code => {
        if ((code as HTMLElement).classList.contains('language-mermaid')) return
        const pre = code.parentElement as HTMLElement | null
        if (!pre || pre.querySelector('.copy-btn')) return
        const btn = document.createElement('button')
        btn.className = 'copy-btn'
        btn.type='button'
        btn.textContent='Copy'
        btn.addEventListener('click', async () => {
          try{
            await navigator.clipboard.writeText(code.textContent || '')
            btn.textContent='Copied!'
            btn.classList.add('copied')
            setTimeout(()=>{ btn.textContent='Copy'; btn.classList.remove('copied') }, 900)
          }catch(_){ btn.textContent='Error' }
        })
        pre.appendChild(btn)
      })

      // Mermaid render with theme mapping
      const mermaidBlocks = Array.from(container.querySelectorAll('pre.mermaid')) as HTMLElement[]
      if (mermaidBlocks.length){
        const cfg = getMermaidConfig()
        mermaid.initialize(cfg)
      }
      mermaidBlocks.forEach(async (pre) => {
        const code = pre.textContent || ''
        try{
          const id = 'mmd-' + Math.random().toString(36).slice(2, 10)
          const { svg } = await mermaid.render(id, code)
          const wrapper = document.createElement('div')
          wrapper.innerHTML = svg
          const clean = DOMPurify.sanitize(wrapper.innerHTML)
          pre.replaceWith(wrapper.firstElementChild as Element)
        }catch(e){
          console.error('Mermaid render error', e)
        }
      })
    }
  }, [html])

  return <article className="prose max-w-none dark:prose-invert page-content" dangerouslySetInnerHTML={{ __html: html }} />
}
