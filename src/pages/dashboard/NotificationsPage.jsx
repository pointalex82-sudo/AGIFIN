import React from 'react'
import { useNotification } from '../../contexts/NotificationContext'
import { Bell, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { formatDateRelative } from '../../utils/formatters'

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotification()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Centre de Notifications</h1>
        <p className="page-subtitle">Suivez vos échéances de campagnes, stocks et tâches.</p>
      </div>

      <div className="card card-body">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-600">Aucune notification</p>
            <p className="text-xs text-muted">Vos rappels d'échéances et d'opérations apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${n.read ? 'bg-white border-gray-100' : 'bg-primary-50 border-primary-100'}`}
                onClick={() => markAsRead(n.id)}
              >
                <div>
                  <h4 className="font-semibold text-sm">{n.titre}</h4>
                  <p className="text-xs text-muted mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDateRelative(n.date)}</p>
                </div>
                {!n.read && <span className="badge badge-primary">Nouveau</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
