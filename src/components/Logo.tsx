import React from 'react'
type Props = { size?: 'sm'|'md'|'lg', withText?: boolean }
export default function Logo({ size='md', withText=true }: Props){
  const cls = size==='lg' ? 'logo logo--lg' : size==='sm' ? 'logo logo--sm' : 'logo'
  return (
    <span className={cls}>
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" />
            <stop offset="100%" stopColor="rgb(139,92,246)" />
          </linearGradient>
        </defs>
        <path d="M22 26c-6 0-10 4-10 9s4 9 10 9h20c6 0 10-4 10-9s-4-9-10-9c0-6-5-10-10-10s-10 4-10 10z" fill="url(#g)" opacity=".95"/>
        <rect x="26" y="30" width="12" height="10" rx="2" ry="2" fill="white" opacity=".98"/>
        <rect x="28" y="32" width="8" height="2" rx="1" fill="rgb(59,130,246)"/>
        <rect x="28" y="36" width="8" height="2" rx="1" fill="rgb(139,92,246)"/>
      </svg>
      {withText && <span className="text">BrainCache</span>}
    </span>
  )
}
