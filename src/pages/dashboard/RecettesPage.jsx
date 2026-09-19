import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import AtelierService from '../../services/AtelierService'
import { formatMontant, formatDate, formatNombre } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { ArrowUpCircle, Plus, Edit, Trash2, Filter, Layers } from 'lucide-react'
import { UNITES } from '../../utils/constants'

export default function RecettesPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [searchParams] = useSearchParams()

  const [recettes, setRecettes] = useState([])
  const [ateliers, setAteliers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterAtelier, setFilterAtelier] = useState('')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    produit: '',
    quantite: '',
    unite: 'kg',
    prixUnitaire: '',
    montantTotal: 0,
    acheteur: '',
    atelierId: 'atl_mais_2026',
  })

  const loadData = () => {
    if (user) {
      setRecettes(DataService.list('recettes', { userId: user.id }))
      setAteliers(AtelierService.getAteliers(user.id))
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
    const total = q * pu
    if (total !== formData.montantTotal) {
      setFormData(prev => ({ ...prev, montantTotal: total }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      atelierId: ateliers[0]?.id || 'atl_mais_2026',
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

  // Filtrage par Atelier d'Activité
  const filteredRecettes = filterAtelier
    ? recettes.filter(r => r.atelierId === filterAtelier || (!r.atelierId && filterAtelier === 'atl_mais_2026'))
    : recettes

  const totalFiltered = filteredRecettes.reduce((s, r) => s + (Number(r.montantTotal) || 0), 0)

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Atelier',
      render: (r) => {
        const atl = ateliers.find(a => a.id === r.atelierId)
        return (
          <span className="badge badge-primary flex items-center gap-1 text-xs">
            <Layers size={10} /> {atl?.nom || 'Atelier Maïs 2026'}
          </span>
        )
      }
    },
    {
      header: 'Produit vendu',
      accessor: 'produit',
      render: (r) => <span className="font-bold">{r.produit}</span>,
    },
    {
      header: 'Quantité',
      render: (r) => `${formatNombre(r.quantite)} ${r.unite}`,
    },
    {
      header: 'Prix Unitaire',
      render: (r) => `${formatNombre(r.prixUnitaire)} FCFA`,
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
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Mes Recettes par Atelier</h1>
          <p className="page-subtitle">
            Total des recettes : <strong className="text-success">{formatMontant(totalFiltered)}</strong>
          </p>
        </div>
        <button className="btn btn-success btn-lg" onClick={handleOpenCreate}>
          <Plus size={20} /> Enregistrer une recette
        </button>
      </div>

      {/* Filter Bar par Atelier */}
      <div className="card card-body bg-base-100 p-4">
        <label className="text-xs font-semibold text-muted flex items-center gap-1 mb-1">
          <Layers size={14} className="text-primary" /> Filtrer les Ventes par Atelier d'Activité :
        </label>
        <select
          className="form-select font-semibold"
          value={filterAtelier}
          onChange={(e) => setFilterAtelier(e.target.value)}
        >
          <option value="">Tous les Ateliers d'exploitation</option>
          {ateliers.map(a => (
            <option key={a.id} value={a.id}>{a.nom}</option>
          ))}
        </select>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={filteredRecettes}
          emptyTitle="Aucune recette enregistrée pour cet atelier"
          emptyDescription="Chaque vente réalisée est rattachée à son atelier pour mesurer la rentabilité réelle."
          emptyAction={
            <button className="btn btn-success btn-sm" onClick={handleOpenCreate}>
              <Plus size={14} /> Enregistrer une recette
            </button>
          }
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la recette' : 'Enregistrer une recette d\'Atelier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group border p-3 rounded-lg bg-emerald-50 border-emerald-200">
            <label className="form-label font-semibold flex items-center gap-2 text-emerald-900">
              <Layers size={16} className="text-emerald-700" /> Atelier d'Attribution Obligatoire *
            </label>
            <select
              className="form-select font-bold text-gray-900"
              required
              value={formData.atelierId}
              onChange={(e) => setFormData({ ...formData, atelierId: e.target.value })}
            >
              {ateliers.map((a) => (
                <option key={a.id} value={a.id}>{a.nom} ({a.type === 'vegetal' ? 'Culture' : a.type === 'animal' ? 'Élevage' : 'Structure'})</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Produit vendu *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.produit}
                onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
                placeholder="ex: Maïs grain, Poulets de chair, Tomates"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Quantité *</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                placeholder="ex: 50"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unité</label>
              <select
                className="form-select"
                value={formData.unite}
                onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
              >
                {UNITES.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prix unitaire (FCFA) *</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
                placeholder="ex: 350"
              />
            </div>
          </div>

          <div className="p-3 bg-base-200 rounded-lg flex justify-between items-center">
            <span className="font-semibold text-sm">Montant Total Calculé :</span>
            <span className="font-bold text-xl text-success">{formatMontant(formData.montantTotal)}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Acheteur / Client</label>
            <input
              type="text"
              className="form-input"
              value={formData.acheteur}
              onChange={(e) => setFormData({ ...formData, acheteur: e.target.value })}
              placeholder="ex: Commerçante marché Tsévié, Grossiste"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-success">
              {editingId ? 'Enregistrer' : 'Valider la recette'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
