import React from 'react'
import { Calendar, Users, Map, CheckCircle2 } from 'lucide-react'

export default function CampagnesCollectives() {
  const campagnesColles = [
    { id: 1, nom: 'Campagne Maïs Groupé 2026', culture: 'Maïs', superficieTotale: 180, membresParticipants: 32, statut: 'En cours' },
    { id: 2, nom: 'Campagne Soja Biologique 2026', culture: 'Soja', superficieTotale: 75, membresParticipants: 18, statut: 'En cours' },
    { id: 3, nom: 'Programme Maraîchage Contre-Saison', culture: 'Tomate / Piment', superficieTotale: 45, membresParticipants: 12, statut: 'Planifiée' },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Campagnes Collectives</h1>
        <p className="page-subtitle">Suivi consolidé des programmes agricoles des membres.</p>
      </div>

      <div className="grid-3">
        {campagnesColles.map((c) => (
          <div key={c.id} className="card card-body">
            <div className="flex justify-between items-start mb-3">
              <span className="badge badge-primary">{c.culture}</span>
              <span className="badge badge-warning">{c.statut}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{c.nom}</h3>
            <div className="space-y-2 text-sm text-muted mb-4">
              <div className="flex justify-between">
                <span>Superficie Totale :</span>
                <span className="font-semibold text-gray-900">{c.superficieTotale} ha</span>
              </div>
              <div className="flex justify-between">
                <span>Producteurs participants :</span>
                <span className="font-semibold text-gray-900">{c.membresParticipants} membres</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
