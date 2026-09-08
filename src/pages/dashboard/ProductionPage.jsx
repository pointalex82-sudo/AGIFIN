import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { formatDate, formatNombre } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { UNITES } from '../../utils/constants'

export default function ProductionPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [productions, setProductions] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    produit: '',
    quantite: '',
    unite: 'kg',
    destination: 'Vente',
    quantiteVendue: '',
    quantiteRestante: '',
    campagneId: '',
  })

  const loadData = () => {
    if (user) {
      setProductions(DataService.list('productions', { userId: user.id }))
      setCampagnes(DataService.list('campagnes', { userId: user.id }))
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleOpenEdit = (prod) => {
    setEditingId(prod.id)
    setFormData({
      date: prod.date,
      produit: prod.produit,
      quantite: prod.quantite,
      unite: prod.unite,
      destination: prod.destination,
      quantiteVendue: prod.quantiteVendue || '',
      quantiteRestante: prod.quantiteRestante || '',
      campagneId: prod.campagneId || '',
    })
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      produit: '',
      quantite: '',
      unite: 'kg',
      destination: 'Vente',
      quantiteVendue: '',
      quantiteRestante: '',
      campagneId: campagnes[0]?.id || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet enregistrement de production ?')) {
      DataService.delete('productions', id)
      addToast('Production supprimée', 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      userId: user.id,
      quantite: Number(formData.quantite),
    }

    if (editingId) {
      DataService.update('productions', editingId, payload)
      addToast('Production mise à jour', 'success')
    } else {
      DataService.create('productions', payload)
      addToast('Récolte enregistrée !', 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Produit Récolté',
      accessor: 'produit',
      render: (r) => <span className="font-bold">{r.produit}</span>,
    },
    {
      header: 'Quantité Totale',
      render: (r) => `${formatNombre(r.quantite)} ${r.unite}`,
    },
    {
      header: 'Destination',
      accessor: 'destination',
      render: (r) => <span className="badge badge-info">{r.destination}</span>,
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
          <h1 className="page-title">Gestion de la Production</h1>
          <p className="page-subtitle">Enregistrez le détail de vos récoltes et productions d'élevage.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Enregistrer une récolte
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={productions}
          emptyTitle="Aucune production enregistrée"
          emptyDescription="Ajoutez vos volumes de récoltes pour suivre les stocks et les rendements."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la production' : 'Enregistrer une récolte / production'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Produit récolté *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.produit}
              onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
              placeholder="ex: Maïs grain / Soja / Tomates"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantité récoltée *</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                required
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                placeholder="ex: 3500"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unité</label>
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
              <label className="form-label">Destination principale</label>
              <select
                className="form-select"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              >
                <option value="Vente">Vente commerciale</option>
                <option value="Stockage">Stockage / Magasin</option>
                <option value="Autoconsommation">Autoconsommation</option>
                <option value="Semences">Conservation Semences</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date de récolte *</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Valider la production
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
