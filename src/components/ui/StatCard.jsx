import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, change, changeLabel, color = 'var(--color-primary)', bgIcon }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-card-label">{label}</p>
          <h3 className="stat-card-value">{value}</h3>
          {change !== undefined && change !== null && (
            <div className={`stat-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
              {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{change >= 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel || ''}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="stat-card-icon" style={{ backgroundColor: bgIcon || 'var(--color-primary-50)', color: color }}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
