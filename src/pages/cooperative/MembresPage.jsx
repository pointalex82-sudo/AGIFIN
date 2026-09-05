import React, { useState, useEffect } from 'react'
import DataService from '../../services/DataService'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import { useNotification } from '../../contexts/NotificationContext'
import { Users, Plus, Eye, ShieldCheck, Mail, Phone } from 'lucide-react'

export default function MembresPage() {
  const { addToast } = useNotification()
  const [membres, setMembres] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMembre, setSelectedMembre] = useState(null)

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    localisation: '',
    commune: '',
  })

  const loadData = () => {
    setMembres(DataService.list('users', { role: 'exploitant' }))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    DataService.create('users', {
      ...formData,
      role: 'exploitant',
      password: 'user1234',
    })
    addToast('Membre ajouté avec succès à la coopérative', 'success')
    setIsModalOpen(false)
    loadData()
  }

  const columns = [
    {
      header: 'Producteur',
      accessor: 'nom',
      render: (r) => (
        <div>
          <p className="font-bold text-sm">{r.prenom} {r.nom}</p>
          <p className="text-xs text-muted">{r.telephone}</p>
        </div>
      ),
    },
    {
      header: 'Localisation',
      accessor: 'commune',
      render: (r) => r.commune || r.localisation || 'Maritime',
    },
    {
      header: 'Statut Autorisation',
      render: () => (
        <span className="badge badge-success flex items-center gap-1">
          <ShieldCheck size={12} /> Profil & Superficie partagés
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedMembre(r)}>
          <Eye size={16} /> Voir fiche
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Gestion des Membres</h1>
          <p className="page-subtitle">Repertoire des agriculteurs et éleveurs adhérents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Ajouter un membre
        </button>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={membres}
          emptyTitle="Aucun membre enregistré"
          emptyDescription="Ajoutez les producteurs membres de votre coopérative."
        />
      </div>

      {/* Modal Ajout */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un membre à la coopérative"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Téléphone *</label>
              <input
                type="tel"
                className="form-input"
                required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Commune / Village</label>
            <input
              type="text"
              className="form-input"
              value={formData.commune}
              onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Ajouter le membre
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Consultation Membre */}
      {selectedMembre && (
        <Modal
          isOpen={!!selectedMembre}
          onClose={() => setSelectedMembre(null)}
          title={`Fiche membre — ${selectedMembre.prenom} ${selectedMembre.nom}`}
        >
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Téléphone:</span>
              <span className="font-semibold">{selectedMembre.telephone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Email:</span>
              <span className="font-semibold">{selectedMembre.email || '-'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted">Localisation:</span>
              <span className="font-semibold">{selectedMembre.commune || 'Maritime'}</span>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-xs text-green-900 border border-green-200">
              <p className="font-bold mb-1">Autorisations de partage accordées par l'exploitant :</p>
              <p>✔ Profil de l'exploitation</p>
              <p>✔ Superficie et culture</p>
              <p>✔ Volume de production estimé</p>
              <p className="text-gray-500 italic mt-1">✖ Les dépenses et recettes privées restent masquées.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
