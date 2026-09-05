import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import CalculService from '../../services/CalculService'
import { formatMontant, formatDate } from '../../utils/formatters'
import { useNotification } from '../../contexts/NotificationContext'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import { Calendar, Plus, Edit, Trash2, CheckCircle, Info } from 'lucide-react'
import { TYPES_CULTURES, STATUTS_CAMPAGNE } from '../../utils/constants'

export default function CampagnesPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [campagnes, setCampagnes] = useState([])
  const [parcelles, setParcelles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    parcelleId: '',
    superficie: '',
    culture: 'Maïs',
    dateDebut: '',
    dateFinPrevue: '',
    objectifProduction: '',
    statut: 'en_cours',
  })

  const loadData = () => {
    if (user) {
      const list = DataService.list('campagnes', { userId: user.id })
      setCampagnes(list)
      setParcelles(DataService.list('parcelles', { userId: user.id }))
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      nom: '',
      parcelleId: parcelles[0]?.id || '',
      superficie: parcelles[0]?.superficie || '',
      culture: 'Maïs',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFinPrevue: '',
      objectifProduction: '',
      statut: 'en_cours',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c) => {
    setEditingId(c.id)
    setFormData(c)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous supprimer cette campagne ?')) {
      DataService.delete('campagnes', id)
      addToast('Campagne supprimée', 'info')
      loadData()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const p = parcelles.find(p => p.id === formData.parcelleId)
    const payload = {
      ...formData,
      userId: user.id,
      parcelleName: p?.nom || '',
    }

    if (editingId) {
      DataService.update('campagnes', editingId, payload)
      addToast('Campagne mise à jour', 'success')
    } else {
      DataService.create('campagnes', payload)
      addToast('Nouvelle campagne créée !', 'success')
    }
    setIsModalOpen(false)
    loadData()
  }

  const columns = [
    {
      header: 'Campagne',
      accessor: 'nom',
      render: (r) => (
        <div>
          <p className="font-bold text-sm">{r.nom}</p>
          <p className="text-xs text-muted">{r.culture} • {r.parcelleName}</p>
        </div>
      ),
    },
    {
      header: 'Superficie',
      accessor: 'superficie',
      render: (r) => `${r.superficie} ha`,
    },
    {
      header: 'Période',
      render: (r) => `${formatDate(r.dateDebut)} → ${formatDate(r.dateFinPrevue)}`,
    },
    {
      header: 'Résultat Fin.',
      render: (r) => {
        const res = CalculService.resultatCampagne(user.id, r.id)
        return (
          <div>
            <p className={`font-bold ${res.resultat >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatMontant(res.resultat)}
            </p>
            <p className="text-xs text-muted">Dép: {formatMontant(res.depenses)}</p>
          </div>
        )
      },
    },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (r) => {
        const st = STATUTS_CAMPAGNE.find(s => s.value === r.statut) || { label: r.statut, color: 'info' }
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
          <h1 className="page-title">Mes Campagnes Agricoles</h1>
          <p className="page-subtitle">Planifiez et rachetez toutes vos dépenses et recettes par campagne.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Créer une campagne
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={campagnes}
          emptyTitle="Aucune campagne agricole"
          emptyDescription="Créez votre première campagne (ex: Campagne Maïs 2026) pour commencer l'enregistrement des opérations."
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modifier la campagne' : 'Créer une campagne agricole'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nom de la campagne *</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="ex: Campagne Maïs Saison Pluies 2026"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Culture *</label>
              <select
                className="form-select"
                value={formData.culture}
                onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
              >
                {TYPES_CULTURES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Parcelle concernée</label>
              <select
                className="form-select"
                value={formData.parcelleId}
                onChange={(e) => {
                  const pid = e.target.value
                  const p = parcelles.find(x => x.id === pid)
                  setFormData({
                    ...formData,
                    parcelleId: pid,
                    superficie: p ? p.superficie : formData.superficie,
                  })
                }}
              >
                <option value="">Sélectionner une parcelle</option>
                {parcelles.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom} ({p.superficie} ha)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Superficie engagée (ha)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.superficie}
                onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                placeholder="ex: 4.0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Objectif de production (kg / sacs)</label>
              <input
                type="number"
                className="form-input"
                value={formData.objectifProduction}
                onChange={(e) => setFormData({ ...formData, objectifProduction: e.target.value })}
                placeholder="ex: 5000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date de début *</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date prévue de récolte</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateFinPrevue}
                onChange={(e) => setFormData({ ...formData, dateFinPrevue: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              className="form-select"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            >
              {STATUTS_CAMPAGNE.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Créer la campagne'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
