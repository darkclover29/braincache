import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
export default function Breadcrumbs({ items }:{ items: {label: string, to?: string}[] }){
  return (
    <nav className="text-sm mb-4 overflow-x-auto">
      <ol className="flex items-center gap-2">
        <li className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-1"><Logo size="sm" withText={false}/><span className="sr-only">Home</span></Link>
          <span className="opacity-60">/</span>
        </li>
        {items.map((it, i)=>(
          <li key={i} className="flex items-center gap-2">
            {it.to ? <Link to={it.to} className="hover:underline">{it.label}</Link> : <span className="font-medium">{it.label}</span>}
            {i < items.length-1 && <span className="opacity-60">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
