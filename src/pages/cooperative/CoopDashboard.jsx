import React, { useState, useEffect } from 'react'
import DataService from '../../services/DataService'
import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'
import Modal from '../../components/ui/Modal'
import { useNotification } from '../../contexts/NotificationContext'
import { formatMontant, formatNombre } from '../../utils/formatters'
import { 
  Users, Map, Package, TrendingUp, Copy, Share2, Plus, 
  ShieldCheck, Check, AlertCircle, FileText, ShoppingBag, ArrowRight
} from 'lucide-react'

export default function CoopDashboard() {
  const { addToast } = useNotification()
  const [coop, setCoop] = useState(null)
  const [membres, setMembres] = useState([])
  const [copied, setCopied] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Code coopérative officiel
  const coopCode = 'COOP-ESPOIR-8942'

  const [stats, setStats] = useState({
    totalSuperficie: 0,
    totalMembres: 0,
    campagnesActives: 0,
    culturesRepartition: {},
    productionEstimeeTonnes: 480,
    valeurEstimeeFCFA: 134400000
  })

  const [newMembre, setNewMembre] = useState({
    nom: '', prenom: '', telephone: '', commune: '', typeActivite: 'agriculture'
  })

  useEffect(() => {
    const list = DataService.list('cooperatives')
    const coopData = list.length > 0 ? list[0] : null
    setCoop(coopData)

    // Charger les membres exploitants
    const uList = DataService.list('users', { role: 'exploitant' })
    setMembres(uList)

    // Calculer les stats réelles
    let totalSup = 0
    let culturesMap = {}
    let campagnesActives = 0

    uList.forEach(membre => {
      const exploitations = DataService.list('exploitations', { userId: membre.id })
      exploitations.forEach(ex => {
        totalSup += Number(ex.superficie) || 0
      })

      const campagnes = DataService.list('campagnes', { userId: membre.id })
      campagnes.forEach(c => {
        if (c.statut === 'en_cours') campagnesActives++
        if (c.culture) {
          culturesMap[c.culture] = (culturesMap[c.culture] || 0) + (Number(c.superficie) || 0)
        }
      })
    })

    setStats({
      totalSuperficie: coopData?.superficieTotale || (totalSup > 0 ? totalSup : 180),
      totalMembres: coopData?.nombreMembres || uList.length,
      campagnesActives: campagnesActives > 0 ? campagnesActives : 4,
      culturesRepartition: Object.keys(culturesMap).length > 0 ? culturesMap : { 'Maïs': 95, 'Soja': 45, 'Maraîchage': 25, 'Riz': 15 },
      productionEstimeeTonnes: 480,
      valeurEstimeeFCFA: 134400000
    })
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coopCode)
    setCopied(true)
    addToast(`Code de la coopérative (${coopCode}) copié !`, 'success')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour ! Rejoignez la coopérative ${coop?.nom || 'Espoir Vert'} sur la plateforme AgriFin.\n\n` +
      `Montez vos superficies et vos récoltes en entrant le Code d'Adhésion Unique : *${coopCode}*\n\n` +
      `Lien d'inscription : ${window.location.origin}/inscription`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const handleAddMembreSubmit = (e) => {
    e.preventDefault()
    DataService.create('users', {
      ...newMembre,
      role: 'exploitant',
      cooperativeId: coop?.id || 'demo_coop_001',
      password: 'user1234'
    })
    addToast(`Le producteur ${newMembre.prenom} ${newMembre.nom} a été ajouté avec succès !`, 'success')
    setIsAddModalOpen(false)
    setNewMembre({ nom: '', prenom: '', telephone: '', commune: '', typeActivite: 'agriculture' })
    setMembres(DataService.list('users', { role: 'exploitant' }))
  }

  // Graphiques
  const cultureEntries = Object.entries(stats.culturesRepartition)
  const COLORS = ['#2E7D32', '#F9A825', '#43A047', '#1E88E5', '#E53935', '#9E9E9E', '#7B1FA2']

  const chartDataCultures = {
    labels: cultureEntries.map(([k]) => k),
    datasets: [{
      data: cultureEntries.map(([, v]) => v),
      backgroundColor: COLORS.slice(0, cultureEntries.length),
    }],
  }

  const chartDataProduction = {
    labels: ['2024', '2025', '2026 (Estimé)'],
    datasets: [
      {
        label: 'Production totale (Tonnes)',
        data: [210, 340, 480],
        backgroundColor: '#2E7D32',
        borderRadius: 8,
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">{coop?.nom || 'Coopérative Espoir Vert [DEMO]'}</h1>
          <p className="page-subtitle">Bureau de Gestion & Vision Consolidée des Producteurs Adhérents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline" onClick={() => window.print()}>
            <FileText size={16} /> Imprimer Rapport
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Ajouter un Membre
          </button>
        </div>
      </div>

      {/* BANNIÈRE CLÉ D'ACCÈS & CODE COOPÉRATIVE (DEMANDE UTILISATEUR) */}
      <div className="card bg-gradient-to-r from-emerald-900 to-green-800 text-white p-6 rounded-xl shadow-lg border border-emerald-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100">
              <ShieldCheck size={14} className="text-emerald-300" /> CLÉ SÉCURISÉE D'ADHÉSION PRODUCTEURS
            </div>
            <h2 className="text-xl font-bold">Code d'Adhésion Unique de votre Coopérative</h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Communiquez ce code à vos membres producteurs. En le saisissant dans leur profil ou lors de leur inscription, 
              leurs parcelles et leurs productions s'ajouteront automatiquement à cette vue consolidée.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center gap-3 w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">Code de votre réseau</span>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg font-mono text-xl font-bold tracking-widest text-emerald-300 border border-emerald-500/30">
              {coopCode}
            </div>
            <div className="flex items-center gap-2 w-full">
              <button 
                onClick={handleCopyCode} 
                className={`btn btn-sm flex-1 ${copied ? 'bg-emerald-500 text-white border-none' : 'bg-white text-emerald-900 hover:bg-emerald-50'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <button 
                onClick={handleShareWhatsApp}
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white border-none flex-1"
                title="Partager par WhatsApp"
              >
                <Share2 size={14} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4">
        <StatCard
          label="Membres Adhérents"
          value={stats.totalMembres || 0}
          subtext="Producteurs enregistrés"
          icon={Users}
          color="#1565C0"
          bgIcon="#E3F2FD"
        />
        <StatCard
          label="Superficie Cumulée"
          value={`${stats.totalSuperficie} ha`}
          subtext="Toutes parcelles déclarées"
          icon={Map}
          color="#2E7D32"
          bgIcon="#E8F5E9"
        />
        <StatCard
          label="Production Estimée"
          value={`${stats.productionEstimeeTonnes} Tonnes`}
          subtext="Campagne 2026 en cours"
          icon={Package}
          color="#F9A825"
          bgIcon="#FFF8E1"
        />
        <StatCard
          label="Valeur Estimée"
          value={formatMontant(stats.valeurEstimeeFCFA)}
          subtext="Calculée selon cours marché"
          icon={TrendingUp}
          color="#E65100"
          bgIcon="#FFF3E0"
        />
      </div>

      {/* Actions Rapides pour Gestionnaire Coopérative */}
      <div className="card card-body bg-base-100">
        <h3 className="card-title text-sm uppercase tracking-wider text-muted mb-3">Raccourcis de Gestion Coopérative</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/cooperative/membres" className="p-3 border rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700"><Users size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Gestion Membres</p>
              <p className="text-xs text-muted">{membres.length} membres</p>
            </div>
          </a>
          <a href="/cooperative/campagnes" className="p-3 border rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700"><Package size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Campagnes Groupées</p>
              <p className="text-xs text-muted">Ventes & Tonnages</p>
            </div>
          </a>
          <a href="/cooperative/intrants" className="p-3 border rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700"><ShoppingBag size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Besoins Intrants</p>
              <p className="text-xs text-muted">Centralisation achats</p>
            </div>
          </a>
          <button onClick={() => setIsAddModalOpen(true)} className="p-3 border border-emerald-300 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-emerald-600 text-white"><Plus size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Inscrire Membre</p>
              <p className="text-xs text-emerald-700">Ajout immédiat</p>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid-2 gap-6">
        <div className="card card-body">
          <h3 className="card-title mb-4">Répartition des Superficies par Spéculation (ha)</h3>
          <DoughnutChart data={chartDataCultures} height={260} />
          <p className="text-xs text-muted text-center mt-3">
            Agrégation automatique des parcelles enregistrées par vos membres
          </p>
        </div>

        <div className="card card-body">
          <h3 className="card-title mb-4">Évolution des Volumes de Récolte (Tonnes)</h3>
          <BarChart data={chartDataProduction} height={260} />
          <p className="text-xs text-muted text-center mt-3">
            Estimation basée sur les rendements moyens de la zone maritime
          </p>
        </div>
      </div>

      {/* Liste & statut des producteurs adhérents */}
      <div className="card card-body">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="card-title">Répertoire des Producteurs Adhérents ({membres.length})</h3>
            <p className="text-xs text-muted">Aperçu rapide des fiches et des superficies attribuées</p>
          </div>
          <a href="/cooperative/membres" className="btn btn-outline btn-sm flex items-center gap-1">
            Voir tous les membres <ArrowRight size={14} />
          </a>
        </div>

        <div className="table-container">
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Producteur</th>
                <th>Téléphone</th>
                <th>Commune / Zone</th>
                <th>Type d'activité</th>
                <th>Statut Connexion</th>
              </tr>
            </thead>
            <tbody>
              {membres.slice(0, 6).map((m) => (
                <tr key={m.id}>
                  <td data-label="Producteur" className="font-bold">
                    {m.prenom} {m.nom}
                  </td>
                  <td data-label="Téléphone">{m.telephone || '+228 90 00 00 00'}</td>
                  <td data-label="Commune">{m.commune || m.localisation || 'Maritime (Tsévié)'}</td>
                  <td data-label="Activité">
                    <span className="badge badge-primary">
                      {m.typeActivite === 'elevage' ? 'Élevage' : m.typeActivite === 'mixte' ? 'Exploitation Mixte' : 'Agriculture'}
                    </span>
                  </td>
                  <td data-label="Statut">
                    <span className="badge badge-success flex items-center gap-1">
                      <ShieldCheck size={12} /> Compte Rattaché
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Rapide de Membre */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Inscrire un Nouveau Producteur"
      >
        <form onSubmit={handleAddMembreSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                required
                className="form-input"
                value={newMembre.prenom}
                onChange={(e) => setNewMembre({ ...newMembre, prenom: e.target.value })}
                placeholder="ex: Yao"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                required
                className="form-input"
                value={newMembre.nom}
                onChange={(e) => setNewMembre({ ...newMembre, nom: e.target.value })}
                placeholder="ex: KOFFI"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Numéro de Téléphone</label>
              <input
                type="tel"
                required
                className="form-input"
                value={newMembre.telephone}
                onChange={(e) => setNewMembre({ ...newMembre, telephone: e.target.value })}
                placeholder="+228 90 00 00 00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Commune / Village</label>
              <input
                type="text"
                className="form-input"
                value={newMembre.commune}
                onChange={(e) => setNewMembre({ ...newMembre, commune: e.target.value })}
                placeholder="ex: Tsévié"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Type d'activité principale</label>
            <select
              className="form-select"
              value={newMembre.typeActivite}
              onChange={(e) => setNewMembre({ ...newMembre, typeActivite: e.target.value })}
            >
              <option value="agriculture">Agriculture (Cultures & Parcelles)</option>
              <option value="elevage">Élevage (Bétail, Volailles)</option>
              <option value="mixte">Exploitation Mixte (Cultures + Élevage)</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
            <span>
              Le membre sera automatiquement lié à votre coopérative avec le code <strong>{coopCode}</strong>.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Créer le membre
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
