import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { clearDemoData } from '../../data/demoData'
import { Settings, RefreshCw, Trash2, Globe, Shield } from 'lucide-react'

export default function ParametresPage() {
  const { logout } = useAuth()
  const { addToast } = useNotification()
  const [devise, setDevise] = useState('FCFA')

  const handleResetDemo = () => {
    if (window.confirm('Voulez-vous réinitialiser les données de démonstration ? Toutes les modifications locales seront perdues.')) {
      clearDemoData()
      addToast('Données réinitialisées', 'info')
      logout()
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Paramètres de l'Application</h1>
        <p className="page-subtitle">Préférences d'affichage et gestion des données.</p>
      </div>

      <div className="card card-body space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe size={20} /> Devise & Région
          </h3>
          <div className="form-group">
            <label className="form-label">Devise par défaut</label>
            <select
              className="form-select max-w-xs"
              value={devise}
              onChange={(e) => {
                setDevise(e.target.value)
                addToast(`Devise définie sur ${e.target.value}`, 'success')
              }}
            >
              <option value="FCFA">FCFA (Franc CFA)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center gap-2">
            <Trash2 size={20} /> Gestion des Données
          </h3>
          <p className="text-sm text-muted mb-4">
            Vous pouvez réinitialiser les données de démonstration pour repartir sur une base propre.
          </p>
          <button className="btn btn-danger" onClick={handleResetDemo}>
            <RefreshCw size={16} /> Réinitialiser les données de démonstration
          </button>
        </div>
      </div>
    </div>
  )
}
