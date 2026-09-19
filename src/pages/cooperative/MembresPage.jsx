import React, { useState, useEffect } from 'react'
import DataService from '../../services/DataService'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import { useNotification } from '../../contexts/NotificationContext'
import { 
  Users, Plus, Eye, ShieldCheck, Mail, Phone, MapPin, 
  Copy, Check, Search, Filter, Layers, ArrowUpRight
} from 'lucide-react'

export default function MembresPage() {
  const { addToast } = useNotification()
  const [membres, setMembres] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMembre, setSelectedMembre] = useState(null)
  
  const coopCode = 'COOP-ESPOIR-8942'

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    localisation: '',
    commune: '',
    typeActivite: 'agriculture',
    superficieEstimee: 3.5,
  })

  const loadData = () => {
    setMembres(DataService.list('users', { role: 'exploitant' }))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coopCode)
    setCopied(true)
    addToast(`Code de la coopérative (${coopCode}) copié !`, 'success')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    DataService.create('users', {
      ...formData,
      role: 'exploitant',
      cooperativeId: 'demo_coop_001',
      password: 'user1234',
    })
    addToast('Membre ajouté avec succès à la coopérative', 'success')
    setIsModalOpen(false)
    setFormData({ nom: '', prenom: '', telephone: '', email: '', localisation: '', commune: '', typeActivite: 'agriculture', superficieEstimee: 3.5 })
    loadData()
  }

  const filteredMembres = membres.filter((m) => {
    const query = searchTerm.toLowerCase()
    return (
      (m.nom && m.nom.toLowerCase().includes(query)) ||
      (m.prenom && m.prenom.toLowerCase().includes(query)) ||
      (m.telephone && m.telephone.toLowerCase().includes(query)) ||
      (m.commune && m.commune.toLowerCase().includes(query))
    )
  })

  const columns = [
    {
      header: 'Producteur',
      accessor: 'nom',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="avatar avatar-sm bg-emerald-100 text-emerald-800 font-bold">
            {(r.prenom?.[0] || '') + (r.nom?.[0] || '')}
          </div>
          <div>
            <p className="font-bold text-sm">{r.prenom} {r.nom}</p>
            <p className="text-xs text-muted flex items-center gap-1">
              <Phone size={10} /> {r.telephone || '+228 90 00 00 00'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Localisation / Village',
      accessor: 'commune',
      render: (r) => (
        <div className="flex items-center gap-1 text-xs">
          <MapPin size={12} className="text-muted" />
          <span>{r.commune || r.localisation || 'Maritime (Tsévié)'}</span>
        </div>
      ),
    },
    {
      header: 'Spéculation principale',
      render: (r) => (
        <span className="badge badge-primary text-xs">
          {r.typeActivite === 'elevage' ? 'Élevage' : r.typeActivite === 'mixte' ? 'Mixte (Cultures+Bétail)' : 'Cultures Vivrières'}
        </span>
      ),
    },
    {
      header: 'Statut Liaison',
      render: () => (
        <span className="badge badge-success flex items-center gap-1 text-xs">
          <ShieldCheck size={12} /> Synchronisé avec {coopCode}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <button className="btn btn-ghost btn-sm text-primary" onClick={() => setSelectedMembre(r)}>
          <Eye size={16} /> Fiche Membre
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Gestion des Membres Producteurs</h1>
          <p className="page-subtitle">Répertoire officiel des adhérents rattachés à votre coopérative.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Badge Code Adhésion */}
          <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <span className="text-muted font-medium">Code Coop :</span>
            <span className="font-mono font-bold text-emerald-800">{coopCode}</span>
            <button onClick={handleCopyCode} className="btn btn-ghost btn-xs text-emerald-700" title="Copier le code">
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Ajouter un membre
          </button>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="card card-body">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input
              type="text"
              className="form-input pl-9"
              placeholder="Rechercher par nom, téléphone, ou village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-semibold">{filteredMembres.length} producteur(s) trouvé(s)</span>
          </div>
        </div>
      </div>

      {/* Table des Membres */}
      <div className="card card-body">
        <DataTable
          columns={columns}
          data={filteredMembres}
          emptyTitle="Aucun membre trouvé"
          emptyDescription="Ajoutez votre premier producteur ou communiquez le code d'adhésion."
          emptyAction={
            <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} /> Inscrire un membre maintenant
            </button>
          }
        />
      </div>

      {/* Modal Ajout Membre */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un Membre à la Coopérative"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="ex: Yao"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="ex: KOFFI"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Téléphone *</label>
              <input
                type="tel"
                required
                className="form-input"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                placeholder="+228 90 00 00 00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Village / Commune</label>
              <input
                type="text"
                className="form-input"
                value={formData.commune}
                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                placeholder="ex: Tsévié"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Spéculation / Spécialité</label>
            <select
              className="form-select"
              value={formData.typeActivite}
              onChange={(e) => setFormData({ ...formData, typeActivite: e.target.value })}
            >
              <option value="agriculture">Agriculture (Maïs, Soja, Riz, Maraîchage)</option>
              <option value="elevage">Élevage (Bovins, Caprins, Volailles)</option>
              <option value="mixte">Exploitation Mixte</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 border border-emerald-200">
            Le producteur sera créé et associé au code coopérative <strong>{coopCode}</strong>.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer le membre
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Fiche Membre Détails */}
      {selectedMembre && (
        <Modal
          isOpen={!!selectedMembre}
          onClose={() => setSelectedMembre(null)}
          title={`Fiche Producteur — ${selectedMembre.prenom} ${selectedMembre.nom}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border flex items-center gap-4">
              <div className="avatar avatar-lg bg-emerald-600 text-white font-bold text-xl">
                {(selectedMembre.prenom?.[0] || '') + (selectedMembre.nom?.[0] || '')}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedMembre.prenom} {selectedMembre.nom}</h3>
                <p className="text-xs text-muted flex items-center gap-2">
                  <span><Phone size={12} className="inline mr-1" />{selectedMembre.telephone || 'Non renseigné'}</span>
                  <span>•</span>
                  <span><MapPin size={12} className="inline mr-1" />{selectedMembre.commune || 'Maritime'}</span>
                </p>
                <span className="badge badge-success mt-2 text-xs flex items-center gap-1 w-fit">
                  <ShieldCheck size={12} /> Compte Rattaché ({coopCode})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 border rounded-lg bg-base-100">
                <span className="text-xs text-muted block">Superficie Déclarée</span>
                <span className="font-bold text-base text-emerald-700">3.50 ha</span>
              </div>
              <div className="p-3 border rounded-lg bg-base-100">
                <span className="text-xs text-muted block">Cultures principales</span>
                <span className="font-bold text-base">Maïs / Soja</span>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-end">
              <button className="btn btn-outline" onClick={() => setSelectedMembre(null)}>
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
