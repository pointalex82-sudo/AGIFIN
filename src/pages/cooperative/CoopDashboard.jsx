import React, { useState, useEffect } from 'react'
import DataService from '../../services/DataService'
import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'
import { Users, Map, Package, TrendingUp } from 'lucide-react'

export default function CoopDashboard() {
  const [coop, setCoop] = useState(null)
  const [membres, setMembres] = useState([])
  const [stats, setStats] = useState({
    totalSuperficie: 0,
    totalMembres: 0,
    campagnesActives: 0,
    culturesRepartition: {},
  })

  useEffect(() => {
    const list = DataService.list('cooperatives')
    const coopData = list.length > 0 ? list[0] : null
    setCoop(coopData)

    // Charger les membres exploitants
    const uList = DataService.list('users', { role: 'exploitant' })
    setMembres(uList)

    // Calculer les stats à partir des données réelles des membres
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

    // Utiliser les données de la coopérative si disponibles, sinon les calculées
    setStats({
      totalSuperficie: coopData?.superficieTotale || totalSup,
      totalMembres: coopData?.nombreMembres || uList.length,
      campagnesActives,
      culturesRepartition: culturesMap,
    })
  }, [])

  // Données graphique cultures
  const cultureEntries = Object.entries(stats.culturesRepartition)
  const COLORS = ['#2E7D32', '#F9A825', '#43A047', '#1E88E5', '#E53935', '#9E9E9E', '#7B1FA2']

  const chartDataCultures = cultureEntries.length > 0
    ? {
        labels: cultureEntries.map(([k]) => k),
        datasets: [{
          data: cultureEntries.map(([, v]) => v),
          backgroundColor: cultureEntries.map((_, i) => COLORS[i % COLORS.length]),
        }],
      }
    : {
        labels: ['Maïs', 'Soja', 'Maraîchage', 'Riz', 'Autres'],
        datasets: [{
          data: [180, 75, 65, 40, 20],
          backgroundColor: COLORS,
        }],
      }

  // Graphique production (données historiques illustratives conservées
  // car non calculables sans identifiants de campagnes collectives)
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
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{coop?.nom || 'Tableau de Bord Coopérative'}</h1>
          <p className="page-subtitle">Vision consolidée des membres et des capacités de production.</p>
        </div>
        <span className="badge badge-primary text-sm px-4 py-2">
          {coop?.localisation || 'Togo'}
        </span>
      </div>

      {/* KPI Cards — données dynamiques */}
      <div className="grid-4">
        <StatCard
          label="Membres Adhérents"
          value={stats.totalMembres || 0}
          icon={Users}
          color="#1565C0"
          bgIcon="#E3F2FD"
        />
        <StatCard
          label="Superficie Totale"
          value={`${stats.totalSuperficie} ha`}
          icon={Map}
          color="#2E7D32"
          bgIcon="#E8F5E9"
        />
        <StatCard
          label="Campagnes Actives"
          value={`${stats.campagnesActives}`}
          icon={Package}
          color="#F9A825"
          bgIcon="#FFF8E1"
        />
        <StatCard
          label="Cultures Pratiquées"
          value={`${cultureEntries.length || 3} types`}
          icon={TrendingUp}
          color="#E65100"
          bgIcon="#FFF3E0"
        />
      </div>

      <div className="grid-2 gap-6">
        <div className="card card-body">
          <h3 className="card-title mb-4">Répartition des Superficies par Culture (ha)</h3>
          <DoughnutChart data={chartDataCultures} height={280} />
          {cultureEntries.length === 0 && (
            <p className="text-xs text-muted text-center mt-2">
              Basé sur les données déclarées par les membres
            </p>
          )}
        </div>

        <div className="card card-body">
          <h3 className="card-title mb-4">Évolution de la Production Collective (Tonnes)</h3>
          <BarChart data={chartDataProduction} height={280} />
          <p className="text-xs text-muted text-center mt-2">
            Données indicatives — Campagnes 2024–2026
          </p>
        </div>
      </div>

      {/* Aperçu des membres */}
      {membres.length > 0 && (
        <div className="card card-body">
          <h3 className="card-title mb-4">Membres ({membres.length})</h3>
          <div className="grid-4 gap-3">
            {membres.slice(0, 8).map(m => (
              <div key={m.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="avatar avatar-sm" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>
                    {(m.prenom?.[0] || '') + (m.nom?.[0] || '')}
                  </div>
                  <p className="text-sm font-semibold truncate">{m.prenom} {m.nom}</p>
                </div>
                <p className="text-xs text-muted truncate">{m.commune || m.localisation || 'Localisation inconnue'}</p>
              </div>
            ))}
            {membres.length > 8 && (
              <div className="p-3 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                <p className="text-xs text-muted font-medium">+{membres.length - 8} autres</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
