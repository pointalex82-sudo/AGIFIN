import React from 'react'
import { FolderOpen } from 'lucide-react'

export default function EmptyState({ title = 'Aucune donnée', text, icon: Icon = FolderOpen, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={40} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {text && <p className="empty-state-text">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
