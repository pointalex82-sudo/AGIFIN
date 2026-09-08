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
      {selectedMembre && (() => {
        const memberCampagnes = DataService.list('campagnes', { userId: selectedMembre.id })
        const memberProductions = DataService.list('productions', { userId: selectedMembre.id })
        const totalQuantite = memberProductions.reduce((acc, p) => acc + (Number(p.quantite) || 0), 0)

        return (
          <Modal
            isOpen={!!selectedMembre}
            onClose={() => setSelectedMembre(null)}
            title={`Fiche membre — ${selectedMembre.prenom} ${selectedMembre.nom}`}
          >
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-xs text-muted block">Téléphone</span>
                  <span className="font-semibold">{selectedMembre.telephone}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Email</span>
                  <span className="font-semibold">{selectedMembre.email || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Localisation</span>
                  <span className="font-semibold">{selectedMembre.commune || selectedMembre.localisation || 'Maritime'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Cumul Apports Totaux</span>
                  <span className="font-bold text-primary">{totalQuantite > 0 ? `${totalQuantite.toLocaleString('fr-FR')} kg` : '0 kg'}</span>
                </div>
              </div>

              {/* Historique des apports par campagne / culture */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">Historique des Apports par Campagne</h4>
                {memberCampagnes.length === 0 ? (
                  <p className="text-xs text-muted italic">Aucune campagne enregistrée pour ce membre.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {memberCampagnes.map(c => {
                      const prods = memberProductions.filter(p => p.campagneId === c.id)
                      const qteCampagne = prods.reduce((a, b) => a + (Number(b.quantite) || 0), 0)
                      return (
                        <div key={c.id} className="p-2.5 rounded border border-gray-200 bg-white flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-gray-800">{c.nom}</span>
                            <span className="text-muted ml-2">({c.culture || 'Culture non spécifiée'} - {c.superficie || 0} ha)</span>
                          </div>
                          <span className="badge badge-success font-bold">
                            {qteCampagne > 0 ? `${qteCampagne.toLocaleString('fr-FR')} kg` : (c.rendementEstime ? `Est. ${c.rendementEstime} kg` : '0 kg')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="p-3 bg-green-50 rounded-lg text-xs text-green-900 border border-green-200">
                <p className="font-bold mb-1">Autorisations de partage accordées par l'exploitant :</p>
                <p>✔ Profil de l'exploitation</p>
                <p>✔ Superficie, cultures et historique des apports</p>
                <p>✔ Volume de production réel et estimé</p>
                <p className="text-gray-500 italic mt-1">✖ Les dépenses et recettes privées restent masquées.</p>
              </div>
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}
