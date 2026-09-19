import React, { useState } from 'react'
import { Calendar, Users, Map, CheckCircle2, Plus, TrendingUp, DollarSign, Package } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { useNotification } from '../../contexts/NotificationContext'
import { formatMontant, formatNombre } from '../../utils/formatters'

export default function CampagnesCollectives() {
  const { addToast } = useNotification()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [campagnesColles, setCampagnesColles] = useState([
    { 
      id: 1, 
      nom: 'Campagne Maïs Groupé 2026', 
      culture: 'Maïs', 
      superficieTotale: 180, 
      membresParticipants: 32, 
      tonnageObjectif: 360,
      prixNegocieKg: 180,
      chiffreAffairesEstime: 64800000,
      statut: 'En cours' 
    },
    { 
      id: 2, 
      nom: 'Campagne Soja Biologique 2026', 
      culture: 'Soja', 
      superficieTotale: 75, 
      membresParticipants: 18, 
      tonnageObjectif: 120,
      prixNegocieKg: 400,
      chiffreAffairesEstime: 48000000,
      statut: 'En cours' 
    },
    { 
      id: 3, 
      nom: 'Programme Maraîchage Contre-Saison', 
      culture: 'Tomate / Piment', 
      superficieTotale: 45, 
      membresParticipants: 12, 
      tonnageObjectif: 90,
      prixNegocieKg: 240,
      chiffreAffairesEstime: 21600000,
      statut: 'Planifiée' 
    },
  ])

  const [formData, setFormData] = useState({
    nom: '',
    culture: 'Maïs',
    superficieTotale: '',
    membresParticipants: '',
    tonnageObjectif: '',
    prixNegocieKg: '',
  })

  const handleCreateCampaign = (e) => {
    e.preventDefault()
    const ca = (Number(formData.tonnageObjectif) * 1000) * Number(formData.prixNegocieKg)
    const newC = {
      id: Date.now(),
      ...formData,
      superficieTotale: Number(formData.superficieTotale),
      membresParticipants: Number(formData.membresParticipants),
      tonnageObjectif: Number(formData.tonnageObjectif),
      prixNegocieKg: Number(formData.prixNegocieKg),
      chiffreAffairesEstime: ca || 15000000,
      statut: 'Planifiée'
    }
    setCampagnesColles([...campagnesColles, newC])
    addToast('Nouvelle campagne collective créée avec succès !', 'success')
    setIsModalOpen(false)
    setFormData({ nom: '', culture: 'Maïs', superficieTotale: '', membresParticipants: '', tonnageObjectif: '', prixNegocieKg: '' })
  }

  const totalCAEstime = campagnesColles.reduce((acc, curr) => acc + curr.chiffreAffairesEstime, 0)
  const totalTonnage = campagnesColles.reduce((acc, curr) => acc + curr.tonnageObjectif, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Campagnes Collectives & Ventes Groupées</h1>
          <p className="page-subtitle">Organisation de la production groupée et commercialisation pour les membres.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Créer une Campagne Collective
        </button>
      </div>

      {/* Résumé des indicateurs */}
      <div className="grid-3">
        <div className="card card-body bg-emerald-900 text-white">
          <p className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">Chiffre d'Affaires Collectif Estimé</p>
          <h2 className="text-2xl font-bold mt-1 text-emerald-300">{formatMontant(totalCAEstime)}</h2>
          <p className="text-xs text-emerald-100 mt-2">Valorisation des ventes groupées 2026</p>
        </div>

        <div className="card card-body">
          <p className="text-xs text-muted uppercase tracking-wider font-semibold">Volume de Récolte Groupé Cible</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{formatNombre(totalTonnage)} Tonnes</h2>
          <p className="text-xs text-muted mt-2">Négociable auprès des acheteurs industriels</p>
        </div>

        <div className="card card-body">
          <p className="text-xs text-muted uppercase tracking-wider font-semibold">Superficie Groupée Engagée</p>
          <h2 className="text-2xl font-bold text-primary mt-1">300 ha</h2>
          <p className="text-xs text-muted mt-2">62 producteurs engagés dans les programmes</p>
        </div>
      </div>

      {/* Cartes des Campagnes */}
      <div className="grid-3 gap-6">
        {campagnesColles.map((c) => (
          <div key={c.id} className="card card-body flex flex-col justify-between hover:shadow-md transition-shadow border">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-primary font-bold">{c.culture}</span>
                <span className={`badge ${c.statut === 'En cours' ? 'badge-warning' : 'badge-success'}`}>
                  {c.statut}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-2">{c.nom}</h3>
              
              <div className="space-y-2 text-sm text-muted my-4 border-t border-b py-3">
                <div className="flex justify-between">
                  <span>Superficie Engagée :</span>
                  <span className="font-semibold text-gray-900">{c.superficieTotale} ha</span>
                </div>
                <div className="flex justify-between">
                  <span>Membres Participants :</span>
                  <span className="font-semibold text-gray-900">{c.membresParticipants} producteurs</span>
                </div>
                <div className="flex justify-between">
                  <span>Tonnage Cible :</span>
                  <span className="font-semibold text-emerald-700">{c.tonnageObjectif} Tonnes</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix Négocié au kg :</span>
                  <span className="font-semibold text-gray-900">{c.prixNegocieKg} FCFA / kg</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <span className="text-xs text-emerald-800 font-medium block">Valeur de Vente Estimée :</span>
              <span className="font-bold text-emerald-900 text-lg">{formatMontant(c.chiffreAffairesEstime)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle Campagne Collective"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nom de la Campagne Collective *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="ex: Campagne Maïs Semence 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Culture / Spéculation</label>
              <select
                className="form-select"
                value={formData.culture}
                onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
              >
                <option value="Maïs">Maïs</option>
                <option value="Soja">Soja</option>
                <option value="Riz">Riz</option>
                <option value="Maraîchage">Maraîchage (Tomate/Piment)</option>
                <option value="Anacarde">Anacarde</option>
                <option value="Coton">Coton</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Superficie Engagée (ha)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.superficieTotale}
                onChange={(e) => setFormData({ ...formData, superficieTotale: e.target.value })}
                placeholder="ex: 150"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Nb Membres</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.membresParticipants}
                onChange={(e) => setFormData({ ...formData, membresParticipants: e.target.value })}
                placeholder="25"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tonnage (Tonnes)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.tonnageObjectif}
                onChange={(e) => setFormData({ ...formData, tonnageObjectif: e.target.value })}
                placeholder="300"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prix (FCFA/kg)</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.prixNegocieKg}
                onChange={(e) => setFormData({ ...formData, prixNegocieKg: e.target.value })}
                placeholder="200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Lancer la campagne
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
