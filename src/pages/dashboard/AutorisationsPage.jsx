import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { ShieldCheck, Save, Lock, Eye } from 'lucide-react'

export default function AutorisationsPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()

  const [permissions, setPermissions] = useState({
    profil_exploitation: true,
    superficie: true,
    production: true,
    depenses: false,
    recettes: false,
    resultats: false,
  })

  const handleToggle = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    addToast('Autorisations de partage enregistrées !', 'success')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Partages & Autorisations</h1>
        <p className="page-subtitle">
          Vous êtes propriétaire exclusif de vos données. Contrôlez ce que votre coopérative peut voir.
        </p>
      </div>

      <div className="card card-body">
        <h3 className="card-title mb-4 flex items-center gap-2">
          <ShieldCheck size={22} className="text-primary" /> Autorisations pour la Coopérative
        </h3>
        <p className="text-sm text-muted mb-6">
          Cochez les informations que vous acceptez de rendre visibles sur le tableau de bord collectif de votre coopérative :
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="form-checkbox p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={permissions.profil_exploitation}
              onChange={() => handleToggle('profil_exploitation')}
            />
            <div>
              <p className="font-semibold text-sm">Profil de l'exploitation</p>
              <p className="text-xs text-muted">Nom, localisation et type d'activité</p>
            </div>
          </label>

          <label className="form-checkbox p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={permissions.superficie}
              onChange={() => handleToggle('superficie')}
            />
            <div>
              <p className="font-semibold text-sm">Superficie et parcelles (ha)</p>
              <p className="text-xs text-muted">Permet la consolidation des surfaces de la coopérative</p>
            </div>
          </label>

          <label className="form-checkbox p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={permissions.production}
              onChange={() => handleToggle('production')}
            />
            <div>
              <p className="font-semibold text-sm">Volume de production estimé</p>
              <p className="text-xs text-muted">Permet à la coopérative d'organiser la commercialisation groupée</p>
            </div>
          </label>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-red-700 uppercase mb-3">Données Financières Privées (Décochées par défaut)</p>

            <label className="form-checkbox p-3 rounded-lg border border-red-50 hover:bg-red-50/50 mb-3">
              <input
                type="checkbox"
                checked={permissions.depenses}
                onChange={() => handleToggle('depenses')}
              />
              <div>
                <p className="font-semibold text-sm text-red-900">Dépenses détaillées</p>
                <p className="text-xs text-muted">Afficher vos coûts d'achats d'intrants</p>
              </div>
            </label>

            <label className="form-checkbox p-3 rounded-lg border border-red-50 hover:bg-red-50/50 mb-3">
              <input
                type="checkbox"
                checked={permissions.recettes}
                onChange={() => handleToggle('recettes')}
              />
              <div>
                <p className="font-semibold text-sm text-red-900">Recettes et prix de vente</p>
                <p className="text-xs text-muted">Afficher vos gains financiers</p>
              </div>
            </label>

            <label className="form-checkbox p-3 rounded-lg border border-red-50 hover:bg-red-50/50">
              <input
                type="checkbox"
                checked={permissions.resultats}
                onChange={() => handleToggle('resultats')}
              />
              <div>
                <p className="font-semibold text-sm text-red-900">Résultat net & Marge financière</p>
                <p className="text-xs text-muted">Afficher le résultat de votre exploitation</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Enregistrer mes autorisations
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
