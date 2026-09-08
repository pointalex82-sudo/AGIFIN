import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import CalculService from '../../services/CalculService'
import { formatMontant, formatDate } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { Bird, Plus, Edit, Trash2 } from 'lucide-react'
import { TYPES_ELEVAGE, STATUTS_CYCLE } from '../../utils/constants'

export default function CyclesElevagePage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [cycles, setCycles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    typeElevage: 'Poulets de chair',
    nombreInitial: '',
    mortalite: 0,
    dateDebut: '',
    dateFinPrevue: '',
    statut: 'en_cours',
  })

  const loadData = () => {
    if (user) {
      setCycles(DataService.list('cycles_elevage', { userId: user.id }))
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      nom: '',
      typeElevage: 'Poulets de chair',
      nombreInitial: '',
      mortalite: 0,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFinPrevue: '',
      statut: 'en_cours',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cy) => {
    setEditingId(cy.id)
    setFormData(cy)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce cycle d'élevage ?")) {
      DataService.delete('cycles_elevage', id)
      addToast("Cycle d'élevage supprimé", 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...formData, userId: user.id }

    if (editingId) {
      DataService.update('cycles_elevage', editingId, payload)
      addToast("Cycle d'élevage mis à jour", 'success')
    } else {
      DataService.create('cycles_elevage', payload)
      addToast("Nouveau cycle d'élevage créé !", 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const columns = [
    {
      header: 'Lot / Cycle',
      accessor: 'nom',
      render: (r) => (
        <div>
          <p className="font-bold text-sm">{r.nom}</p>
          <p className="text-xs text-muted">{r.typeElevage}</p>
        </div>
      ),
    },
    {
      header: 'Effectif Initial',
      accessor: 'nombreInitial',
      render: (r) => `${r.nombreInitial} sujets`,
    },
    {
      header: 'Mortalité',
      accessor: 'mortalite',
      render: (r) => (
        <span className="text-danger font-medium">{r.mortalite || 0} sujets</span>
      ),
    },
    {
      header: 'Coût Dépenses',
      render: (r) => {
        const res = CalculService.resultatCycle(user.id, r.id)
        return formatMontant(res.depenses)
      },
    },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (r) => {
        const st = STATUTS_CYCLE.find(s => s.value === r.statut) || { label: r.statut, color: 'info' }
        return <span className={`badge badge-${st.color}`}>{st.label}</span>
      },
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
          <h1 className="page-title">Cycles d'Élevage</h1>
          <p className="page-subtitle">Suivez vos lots de volailles, ruminants, porcins ou poissons.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Nouveau cycle d'élevage
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={cycles}
          emptyTitle="Aucun cycle d'élevage enregistré"
          emptyDescription="Ajoutez votre premier lot pour suivre la mortalité, le coût d'alimentation et les ventes."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier le cycle' : "Nouveau cycle d'élevage"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nom du lot / Cycle *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="ex: Poulets de chair - Lot N°3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type d'élevage *</label>
              <select
                className="form-select"
                value={formData.typeElevage}
                onChange={(e) => setFormData({ ...formData, typeElevage: e.target.value })}
              >
                {TYPES_ELEVAGE.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre initial d'animaux *</label>
              <input
                type="number"
                className="form-input"
                required
                value={formData.nombreInitial}
                onChange={(e) => setFormData({ ...formData, nombreInitial: e.target.value })}
                placeholder="ex: 500"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mortalité constatée à ce jour</label>
              <input
                type="number"
                className="form-input"
                value={formData.mortalite}
                onChange={(e) => setFormData({ ...formData, mortalite: e.target.value })}
                placeholder="ex: 5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              >
                {STATUTS_CYCLE.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date de démarrage *</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date prévue de vente / fin</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateFinPrevue}
                onChange={(e) => setFormData({ ...formData, dateFinPrevue: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Créer le cycle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
