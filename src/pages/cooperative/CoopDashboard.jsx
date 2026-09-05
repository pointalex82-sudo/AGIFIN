import React, { useState, useEffect } from 'react'
import DataService from '../../services/DataService'
import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'
import { Users, Map, Package, ShoppingCart } from 'lucide-react'

export default function CoopDashboard() {
  const [coop, setCoop] = useState(null)
  const [membres, setMembres] = useState([])

  useEffect(() => {
    const list = DataService.list('cooperatives')
    if (list.length > 0) {
      setCoop(list[0])
    }
    const uList = DataService.list('users', { role: 'exploitant' })
    setMembres(uList)
  }, [])

  const chartDataCultures = {
    labels: ['Maïs', 'Soja', 'Maraîchage', 'Riz', 'Autres'],
    datasets: [
      {
        data: [180, 75, 65, 40, 20],
        backgroundColor: ['#2E7D32', '#F9A825', '#43A047', '#1E88E5', '#9E9E9E'],
      },
    ],
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
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{coop?.nom || 'Tableau de Bord Coopérative'}</h1>
          <p className="page-subtitle">Vision consolidée des membres et des capacités de production.</p>
        </div>
        <span className="badge badge-primary text-sm px-4 py-2">
          {coop?.localisation || 'Togo'}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid-4">
        <StatCard
          label="Membres Adhérents"
          value={coop?.nombreMembres || membres.length || 45}
          icon={Users}
          color="#1565C0"
          bgIcon="#E3F2FD"
        />
        <StatCard
          label="Superficie Totale"
          value={`${coop?.superficieTotale || 180} ha`}
          icon={Map}
          color="#2E7D32"
          bgIcon="#E8F5E9"
        />
        <StatCard
          label="Production Estimée"
          value="480 Tonnes"
          icon={Package}
          color="#F9A825"
          bgIcon="#FFF8E1"
        />
        <StatCard
          label="Besoins Engrais"
          value="350 Sacs"
          icon={ShoppingCart}
          color="#E65100"
          bgIcon="#FFF3E0"
        />
      </div>

      <div className="grid-2 gap-6">
        <div className="card card-body">
          <h3 className="card-title mb-4">Répartition des Superficies par Culture (ha)</h3>
          <DoughnutChart data={chartDataCultures} height={280} />
        </div>

        <div className="card card-body">
          <h3 className="card-title mb-4">Évolution de la Production Collective (Tonnes)</h3>
          <BarChart data={chartDataProduction} height={280} />
        </div>
      </div>
    </div>
  )
}
