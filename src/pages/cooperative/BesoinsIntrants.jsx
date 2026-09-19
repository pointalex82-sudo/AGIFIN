import React, { useState } from 'react'
import { ShoppingCart, PackageCheck, AlertCircle, Plus, Calculator, Check, ShieldCheck } from 'lucide-react'
import { formatNombre, formatMontant } from '../../utils/formatters'
import Modal from '../../components/ui/Modal'
import { useNotification } from '../../contexts/NotificationContext'

export default function BesoinsIntrants() {
  const { addToast } = useNotification()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [besoins, setBesoins] = useState([
    { type: 'Engrais NPK 15-15-15', quantiteTotale: 360, unite: 'Sacs de 50 kg', demandeurs: 32, prixUnitaire: 18500, statut: 'En négociation fournisseur' },
    { type: 'Engrais Urée 46%', quantiteTotale: 220, unite: 'Sacs de 50 kg', demandeurs: 28, prixUnitaire: 19000, statut: 'Commande Validée' },
    { type: 'Semence Maïs Améliorée (TZEE)', quantiteTotale: 1400, unite: 'kg', demandeurs: 30, prixUnitaire: 1200, statut: 'En cours d\'agrégation' },
    { type: 'Semence Soja Certifiée', quantiteTotale: 850, unite: 'kg', demandeurs: 18, prixUnitaire: 1500, statut: 'En cours d\'agrégation' },
    { type: 'Produit Phytosanitaire Bio', quantiteTotale: 150, unite: 'Litres', demandeurs: 15, prixUnitaire: 8500, statut: 'Commande Validée' },
  ])

  const [newBesoin, setNewBesoin] = useState({
    type: '', quantiteTotale: '', unite: 'Sacs de 50 kg', demandeurs: '', prixUnitaire: ''
  })

  const handleAddBesoin = (e) => {
    e.preventDefault()
    const item = {
      ...newBesoin,
      quantiteTotale: Number(newBesoin.quantiteTotale),
      demandeurs: Number(newBesoin.demandeurs),
      prixUnitaire: Number(newBesoin.prixUnitaire),
      statut: 'En cours d\'agrégation'
    }
    setBesoins([...besoins, item])
    addToast('Nouvelle commande d\'intrants groupée ajoutée !', 'success')
    setIsModalOpen(false)
    setNewBesoin({ type: '', quantiteTotale: '', unite: 'Sacs de 50 kg', demandeurs: '', prixUnitaire: '' })
  }

  const montantTotalIntrants = besoins.reduce((acc, curr) => acc + (curr.quantiteTotale * (curr.prixUnitaire || 0)), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Centralisation des Besoins en Intrants</h1>
          <p className="page-subtitle">Groupement et négociation des commandes d'intrants pour l'ensemble des membres.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Ajouter une Commande Groupée
        </button>
      </div>

      {/* Bannière Calculateur Automatique */}
      <div className="card card-body bg-emerald-900 text-white p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
              <Calculator size={16} /> Calculateur Automatique selon Superficie
            </div>
            <h2 className="text-xl font-bold">Volume Total Groupé : {formatMontant(montantTotalIntrants)}</h2>
            <p className="text-xs text-emerald-100 mt-1">
              Économie moyenne estimée de 15% grâce aux commandes groupées de la coopérative.
            </p>
          </div>
          <button className="btn bg-white text-emerald-900 hover:bg-emerald-50 border-none font-bold text-xs" onClick={() => addToast('Calcul basé sur 180 ha de maïs et 75 ha de soja déclarés !', 'info')}>
            Re-calculer les besoins
          </button>
        </div>
      </div>

      {/* Tableau des Commandes Groupées */}
      <div className="card card-body">
        <h3 className="card-title mb-4">Commandes Groupées d'Intrants pour la Campagne</h3>
        <div className="table-container">
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Type d'intrant</th>
                <th>Quantité Groupée</th>
                <th>Producteurs</th>
                <th>Prix Unitaire Négocié</th>
                <th>Montant Total</th>
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
                  <td data-label="Producteurs">{b.demandeurs} membres</td>
                  <td data-label="Prix Unitaire">{b.prixUnitaire ? `${formatNombre(b.prixUnitaire)} FCFA` : 'En cours'}</td>
                  <td data-label="Montant Total" className="font-semibold text-emerald-800">
                    {formatMontant(b.quantiteTotale * (b.prixUnitaire || 0))}
                  </td>
                  <td data-label="Statut">
                    <span className={`badge ${b.statut === 'Commande Validée' ? 'badge-success' : 'badge-warning'}`}>
                      {b.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Intrant */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Commande Groupée d'Intrant"
      >
        <form onSubmit={handleAddBesoin} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Désignation de l'Intrant *</label>
            <input
              type="text"
              required
              className="form-input"
              value={newBesoin.type}
              onChange={(e) => setNewBesoin({ ...newBesoin, type: e.target.value })}
              placeholder="ex: Engrais NPK 15-15-15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Quantité Totale *</label>
              <input
                type="number"
                required
                className="form-input"
                value={newBesoin.quantiteTotale}
                onChange={(e) => setNewBesoin({ ...newBesoin, quantiteTotale: e.target.value })}
                placeholder="ex: 200"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unité</label>
              <select
                className="form-select"
                value={newBesoin.unite}
                onChange={(e) => setNewBesoin({ ...newBesoin, unite: e.target.value })}
              >
                <option value="Sacs de 50 kg">Sacs de 50 kg</option>
                <option value="kg">kg</option>
                <option value="Litres">Litres</option>
                <option value="Tonnes">Tonnes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Nombre de Membres</label>
              <input
                type="number"
                required
                className="form-input"
                value={newBesoin.demandeurs}
                onChange={(e) => setNewBesoin({ ...newBesoin, demandeurs: e.target.value })}
                placeholder="ex: 20"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prix Négocié (FCFA/Unité)</label>
              <input
                type="number"
                required
                className="form-input"
                value={newBesoin.prixUnitaire}
                onChange={(e) => setNewBesoin({ ...newBesoin, prixUnitaire: e.target.value })}
                placeholder="ex: 18000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Ajouter la commande
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
