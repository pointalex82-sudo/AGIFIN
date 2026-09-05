import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { formatMontant, formatDate } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { ArrowDownCircle, Plus, Edit, Trash2, Filter } from 'lucide-react'
import { CATEGORIES_DEPENSES } from '../../utils/constants'

export default function DepensesPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [searchParams] = useSearchParams()

  const [depenses, setDepenses] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [cycles, setCycles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterCat, setFilterCat] = useState('')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    montant: '',
    categorie: 'semences',
    description: '',
    campagneId: '',
    cycleId: '',
  })

  const loadData = () => {
    if (user) {
      setDepenses(DataService.list('depenses', { userId: user.id }))
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

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      montant: '',
      categorie: 'semences',
      description: '',
      campagneId: campagnes[0]?.id || '',
      cycleId: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (d) => {
    setEditingId(d.id)
    setFormData(d)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette dépense ?')) {
      DataService.delete('depenses', id)
      addToast('Dépense supprimée', 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      userId: user.id,
      montant: Number(formData.montant),
    }

    if (editingId) {
      DataService.update('depenses', editingId, payload)
      addToast('Dépense mise à jour', 'success')
    } else {
      DataService.create('depenses', payload)
      addToast('Dépense enregistrée avec succès !', 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const filteredDepenses = filterCat
    ? depenses.filter(d => d.categorie === filterCat)
    : depenses

  const totalFiltered = filteredDepenses.reduce((s, d) => s + (Number(d.montant) || 0), 0)

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Catégorie',
      accessor: 'categorie',
      render: (r) => {
        const cat = CATEGORIES_DEPENSES.find(c => c.value === r.categorie)
        return <span className="badge badge-neutral">{cat?.label || r.categorie}</span>
      },
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (r) => r.description || '-',
    },
    {
      header: 'Rattaché à',
      render: (r) => {
        if (r.campagneId) {
          const c = campagnes.find(x => x.id === r.campagneId)
          return <span className="text-xs text-primary font-medium">{c?.nom || 'Campagne'}</span>
        }
        if (r.cycleId) {
          const cy = cycles.find(x => x.id === r.cycleId)
          return <span className="text-xs text-yellow-700 font-medium">{cy?.nom || 'Élevage'}</span>
        }
        return <span className="text-xs text-muted">Général</span>
      },
    },
    {
      header: 'Montant',
      accessor: 'montant',
      align: 'right',
      render: (r) => (
        <span className="font-bold text-danger">-{formatMontant(r.montant)}</span>
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
          <h1 className="page-title">Mes Dépenses</h1>
          <p className="page-subtitle">
            Total des dépenses : <strong className="text-danger">{formatMontant(totalFiltered)}</strong>
          </p>
        </div>
        <button className="btn btn-danger btn-lg" onClick={handleOpenCreate}>
          <Plus size={20} /> Ajouter une dépense
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <label className="text-sm font-medium flex items-center gap-2">
          <Filter size={16} /> Filtrer par catégorie:
        </label>
        <select
          className="form-select"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES_DEPENSES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={filteredDepenses}
          emptyTitle="Aucune dépense enregistrée"
          emptyDescription="Ajoutez votre première dépense en quelques secondes pour suivre vos coûts."
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la dépense' : 'Ajouter une nouvelle dépense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Montant (FCFA) *</label>
              <input
                type="number"
                className="form-input text-lg font-bold text-danger"
                required
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                placeholder="ex: 45000"
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

          <div className="form-group">
            <label className="form-label">Catégorie de dépense *</label>
            <select
              className="form-select"
              required
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
            >
              {CATEGORIES_DEPENSES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rattacher à une campagne (Optionnel)</label>
            <select
              className="form-select"
              value={formData.campagneId}
              onChange={(e) => setFormData({ ...formData, campagneId: e.target.value, cycleId: '' })}
            >
              <option value="">Aucune (Dépense générale)</option>
              {campagnes.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} ({c.culture})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rattacher à un cycle d'élevage (Optionnel)</label>
            <select
              className="form-select"
              value={formData.cycleId}
              onChange={(e) => setFormData({ ...formData, cycleId: e.target.value, campagneId: '' })}
            >
              <option value="">Aucun</option>
              {cycles.map((cy) => (
                <option key={cy.id} value={cy.id}>{cy.nom} ({cy.typeElevage})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Détails</label>
            <input
              type="text"
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ex: Achat de 4 sacs de NPK auprès du fournisseur"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-danger">
              {editingId ? 'Enregistrer' : 'Valider la dépense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
