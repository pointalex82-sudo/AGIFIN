import React, { useState } from 'react'
import { Plus, ArrowDownCircle, ArrowUpCircle, Package, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    { label: 'Ajouter une dépense', icon: ArrowDownCircle, color: '#E53935', path: '/dashboard/depenses?action=new' },
    { label: 'Ajouter une recette', icon: ArrowUpCircle, color: '#43A047', path: '/dashboard/recettes?action=new' },
    { label: 'Enregistrer une récolte', icon: Package, color: '#F9A825', path: '/dashboard/production?action=new' },
    { label: 'Nouvelle campagne', icon: Calendar, color: '#2E7D32', path: '/dashboard/campagnes?action=new' },
  ]

  return (
    <div className="fab">
      {open && (
        <div className="fab-menu">
          {actions.map((act, i) => {
            const Icon = act.icon
            return (
              <div
                key={i}
                className="fab-menu-item"
                onClick={() => {
                  setOpen(false)
                  navigate(act.path)
                }}
              >
                <Icon size={18} style={{ color: act.color }} />
                <span>{act.label}</span>
              </div>
            )
          })}
        </div>
      )}
      <button
        className={`fab-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Actions rapides"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
