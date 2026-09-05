import React from 'react'
import { ShoppingCart, PackageCheck, AlertCircle } from 'lucide-react'
import { formatNombre } from '../../utils/formatters'

export default function BesoinsIntrants() {
  const besoins = [
    { type: 'Engrais NPK 15-15-15', quantiteTotale: 350, unite: 'Sacs de 50 kg', demandeurs: 28 },
    { type: 'Engrais Urée 46%', quantiteTotale: 220, unite: 'Sacs de 50 kg', demandeurs: 22 },
    { type: 'Semence Maïs Améliorée (TZEE)', quantiteTotale: 1400, unite: 'kg', demandeurs: 30 },
    { type: 'Semence Soja Certifiée', quantiteTotale: 850, unite: 'kg', demandeurs: 16 },
    { type: 'Produit Phytosanitaire Bio', quantiteTotale: 120, unite: 'Litres', demandeurs: 14 },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Centralisation des Besoins en Intrants</h1>
        <p className="page-subtitle">Groupement des commandes d'intrants déclarées par les membres.</p>
      </div>

      <div className="card card-body">
        <h3 className="card-title mb-4">Commandes Groupées d'Intrants pour la Campagne</h3>
        <div className="table-container">
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Type d'intrant</th>
                <th>Quantité Totale Groupée</th>
                <th>Nombre de producteurs</th>
                <th>Statut commande</th>
              </tr>
            </thead>
            <tbody>
              {besoins.map((b, i) => (
                <tr key={i}>
                  <td data-label="Type" className="font-bold">{b.type}</td>
                  <td data-label="Quantité" className="text-primary font-bold">
                    {formatNombre(b.quantiteTotale)} {b.unite}
                  </td>
                  <td data-label="Demandeurs">{b.demandeurs} membres</td>
                  <td data-label="Statut">
                    <span className="badge badge-warning">En cours d'agrégation</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
