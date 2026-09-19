import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth, useActivite } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import AtelierService from '../../services/AtelierService'
import { formatMontant, formatDate } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { ArrowDownCircle, Plus, Edit, Trash2, Filter, Layers } from 'lucide-react'
import { CATEGORIES_DEPENSES } from '../../utils/constants'

// Catégories spécifiques à l'agriculture
const CATS_AGRI = ['semences', 'engrais', 'phytosanitaires', 'irrigation']
// Catégories spécifiques à l'élevage
const CATS_ELEVAGE = ['alimentation_animale', 'medicaments']

export default function DepensesPage() {
  const { user } = useAuth()
  const { isAgri, isElevage } = useActivite()
  const { addToast } = useNotification()
  const [searchParams] = useSearchParams()

  const categoriesFiltrees = CATEGORIES_DEPENSES.filter(c => {
    if (CATS_AGRI.includes(c.value)) return isAgri
    if (CATS_ELEVAGE.includes(c.value)) return isElevage
    return true
  })

  const [depenses, setDepenses] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [cycles, setCycles] = useState([])
  const [ateliers, setAteliers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [filterCat, setFilterCat] = useState('')
  const [filterAtelier, setFilterAtelier] = useState('')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    montant: '',
    categorie: 'semences',
    description: '',
    atelierId: 'atl_mais_2026',
    campagneId: '',
    cycleId: '',
  })

  const loadData = () => {
    if (user) {
      setDepenses(DataService.list('depenses', { userId: user.id }))
      setCampagnes(DataService.list('campagnes', { userId: user.id }))
      setCycles(DataService.list('cycles_elevage', { userId: user.id }))
      setAteliers(AtelierService.getAteliers(user.id))
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
      atelierId: ateliers[0]?.id || 'atl_mais_2026',
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

  // Filtrage par Catégorie ET par Atelier d'Activité
  const filteredDepenses = depenses.filter(d => {
    const matchCat = !filterCat || d.categorie === filterCat
    const matchAtelier = !filterAtelier || d.atelierId === filterAtelier || (!d.atelierId && filterAtelier === 'atl_mais_2026')
    return matchCat && matchAtelier
  })

  const totalFiltered = filteredDepenses.reduce((s, d) => s + (Number(d.montant) || 0), 0)

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
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Mes Dépenses par Atelier</h1>
          <p className="page-subtitle">
            Total affiché : <strong className="text-danger">{formatMontant(totalFiltered)}</strong>
          </p>
        </div>
        <button className="btn btn-danger btn-lg" onClick={handleOpenCreate}>
          <Plus size={20} /> Ajouter une dépense
        </button>
      </div>

      {/* Filter Bar par Atelier et par Catégorie */}
      <div className="card card-body bg-base-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted flex items-center gap-1 mb-1">
              <Layers size={14} className="text-primary" /> Filtrer par Atelier d'Activité :
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

          <div>
            <label className="text-xs font-semibold text-muted flex items-center gap-1 mb-1">
              <Filter size={14} /> Filtrer par Catégorie :
            </label>
            <select
              className="form-select"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categoriesFiltrees.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={filteredDepenses}
          emptyTitle="Aucune dépense enregistrée pour cet atelier"
          emptyDescription="Chaque dépense enregistrée est automatiquement rattachée à son atelier pour dégager votre marge exacte."
          emptyAction={
            <button className="btn btn-danger btn-sm" onClick={handleOpenCreate}>
              <Plus size={14} /> Ajouter une dépense
            </button>
          }
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la dépense' : 'Ajouter une dépense d\'Atelier'}
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
              {categoriesFiltrees.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
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
              placeholder="ex: Achat provende volailles / engrais maïs"
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
