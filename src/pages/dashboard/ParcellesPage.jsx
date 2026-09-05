import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { Map, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { TYPES_CULTURES } from '../../utils/constants'

export default function ParcellesPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [parcelles, setParcelles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    superficie: '',
    localisation: '',
    cultureActuelle: '',
  })

  const loadData = () => {
    if (user) {
      setParcelles(DataService.list('parcelles', { userId: user.id }))
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({ nom: '', superficie: '', localisation: '', cultureActuelle: '' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setEditingId(p.id)
    setFormData({
      nom: p.nom,
      superficie: p.superficie,
      localisation: p.localisation || '',
      cultureActuelle: p.cultureActuelle || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous supprimer cette parcelle ?')) {
      DataService.delete('parcelles', id)
      addToast('Parcelle supprimée', 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      DataService.update('parcelles', editingId, formData)
      addToast('Parcelle mise à jour', 'success')
    } else {
      DataService.create('parcelles', { ...formData, userId: user.id })
      addToast('Parcelle ajoutée avec succès !', 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const columns = [
    {
      header: 'Nom de la parcelle',
      accessor: 'nom',
      render: (r) => <span className="font-semibold">{r.nom}</span>,
    },
    {
      header: 'Superficie',
      accessor: 'superficie',
      render: (r) => `${r.superficie} ha`,
    },
    {
      header: 'Localisation',
      accessor: 'localisation',
      render: (r) => r.localisation || '-',
    },
    {
      header: 'Culture Actuelle',
      accessor: 'cultureActuelle',
      render: (r) => (
        <span className="badge badge-primary">{r.cultureActuelle || 'En repos'}</span>
      ),
    },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
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
          <h1 className="page-title">Mes Parcelles</h1>
          <p className="page-subtitle">Cartographiez et suivez les terres de votre exploitation.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Ajouter une parcelle
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={parcelles}
          emptyTitle="Aucune parcelle créée"
          emptyDescription="Ajoutez votre première parcelle pour pouvoir créer des campagnes agricoles."
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la parcelle' : 'Ajouter une nouvelle parcelle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nom ou Numéro de la parcelle *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="ex: Parcelle Nord / Lot N°2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Superficie (en Hectares ha) *</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              required
              value={formData.superficie}
              onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
              placeholder="ex: 2.5"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Localisation précise / Repère</label>
            <input
              type="text"
              className="form-input"
              value={formData.localisation}
              onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
              placeholder="ex: Bordure rivière, Route nationale"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Culture en cours</label>
            <select
              className="form-select"
              value={formData.cultureActuelle}
              onChange={(e) => setFormData({ ...formData, cultureActuelle: e.target.value })}
            >
              <option value="">Sélectionner ou repos</option>
              {TYPES_CULTURES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Créer la parcelle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
