import React from 'react'
export default function FeedbackFab({ onClick }: { onClick: ()=>void }){
  return (
    <div className="feedback-fab">
      <button className="btn" onClick={onClick} aria-label="Send feedback">
        <span>🐞</span>
        <span className="label">Report</span>
      </button>
    </div>
  )
}
