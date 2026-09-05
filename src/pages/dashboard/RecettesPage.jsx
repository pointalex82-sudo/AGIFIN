import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { formatMontant, formatDate, formatNombre } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { ArrowUpCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { UNITES } from '../../utils/constants'

export default function RecettesPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [searchParams] = useSearchParams()

  const [recettes, setRecettes] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [cycles, setCycles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    produit: '',
    quantite: '',
    unite: 'kg',
    prixUnitaire: '',
    montantTotal: 0,
    acheteur: '',
    campagneId: '',
    cycleId: '',
  })

  const loadData = () => {
    if (user) {
      setRecettes(DataService.list('recettes', { userId: user.id }))
      setCampagnes(DataService.list('campagnes', { userId: user.id }))
      setCycles(DataService.list('cycles_elevage', { userId: user.id }))
    }
  }

  useEffect(() => {
    loadData()
    if (searchParams.get('action') === 'new') {
      handleOpenCreate()
    }
  }, [user, searchParams])

  // Recalcul automatique du montant total
  useEffect(() => {
    const q = Number(formData.quantite) || 0
    const pu = Number(formData.prixUnitaire) || 0
    setFormData(prev => ({ ...prev, montantTotal: q * pu }))
  }, [formData.quantite, formData.prixUnitaire])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      produit: '',
      quantite: '',
      unite: 'kg',
      prixUnitaire: '',
      montantTotal: 0,
      acheteur: '',
      campagneId: campagnes[0]?.id || '',
      cycleId: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (r) => {
    setEditingId(r.id)
    setFormData(r)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette recette ?')) {
      DataService.delete('recettes', id)
      addToast('Recette supprimée', 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      userId: user.id,
      quantite: Number(formData.quantite),
      prixUnitaire: Number(formData.prixUnitaire),
      montantTotal: Number(formData.montantTotal),
    }

    if (editingId) {
      DataService.update('recettes', editingId, payload)
      addToast('Recette mise à jour', 'success')
    } else {
      DataService.create('recettes', payload)
      addToast('Recette enregistrée avec succès !', 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const totalRecettes = recettes.reduce((s, r) => s + (Number(r.montantTotal) || 0), 0)

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Produit Vendu',
      accessor: 'produit',
      render: (r) => <span className="font-bold">{r.produit}</span>,
    },
    {
      header: 'Quantité & PU',
      render: (r) => (
        <span className="text-xs">
          {formatNombre(r.quantite)} {r.unite} × {formatMontant(r.prixUnitaire)}
        </span>
      ),
    },
    {
      header: 'Acheteur',
      accessor: 'acheteur',
      render: (r) => r.acheteur || 'Vente directe',
    },
    {
      header: 'Montant Total',
      accessor: 'montantTotal',
      align: 'right',
      render: (r) => (
        <span className="font-bold text-success">+{formatMontant(r.montantTotal)}</span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleOpenEdit(r)}>
            <Edit size={16} />
          </button>
          <button className="btn btn-ghost btn-icon btn-sm text-danger" onClick={() => handleDelete(r.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Mes Recettes & Ventes</h1>
          <p className="page-subtitle">
            Total des recettes : <strong className="text-success">{formatMontant(totalRecettes)}</strong>
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={handleOpenCreate}>
          <Plus size={20} /> Ajouter une recette
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={recettes}
          emptyTitle="Aucune recette enregistrée"
          emptyDescription="Ajoutez votre première vente pour calculer vos marges et votre chiffre d'affaires."
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la recette' : 'Enregistrer une recette / vente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Produit vendu *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.produit}
              onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
              placeholder="ex: Maïs grain / Poulets de chair / Tomate"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantité *</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                required
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                placeholder="ex: 1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unité de mesure</label>
              <select
                className="form-select"
                value={formData.unite}
                onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
              >
                {UNITES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prix unitaire (FCFA) *</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
                placeholder="ex: 200"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date de vente *</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Calcul auto highlight */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-green-900">Montant Total Calculé :</span>
            <span className="text-xl font-extrabold text-green-700">{formatMontant(formData.montantTotal)}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Nom de l'acheteur (Optionnel)</label>
            <input
              type="text"
              className="form-input"
              value={formData.acheteur}
              onChange={(e) => setFormData({ ...formData, acheteur: e.target.value })}
              placeholder="ex: Commerçant grossiste / Coopérative"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rattacher à une campagne</label>
            <select
              className="form-select"
              value={formData.campagneId}
              onChange={(e) => setFormData({ ...formData, campagneId: e.target.value, cycleId: '' })}
            >
              <option value="">Aucune</option>
              {campagnes.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} ({c.culture})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Valider la recette'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
