import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import CalculService from '../../services/CalculService'
import { formatMontant, formatDate, formatDateRelative } from '../../utils/formatters'

import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'

import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Wallet,
  Calendar,
  Bird,
  Package,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ depenses: 0, recettes: 0, resultat: 0, campagnesActives: 0, cyclesActifs: 0 })
  const [recentDepenses, setRecentDepenses] = useState([])
  const [recentRecettes, setRecentRecettes] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [cycles, setCycles] = useState([])

  useEffect(() => {
    if (user) {
      const globStats = CalculService.statsGlobales(user.id)
      setStats(globStats)

      setRecentDepenses(DataService.list('depenses', { userId: user.id }).slice(0, 5))
      setRecentRecettes(DataService.list('recettes', { userId: user.id }).slice(0, 5))
      setCampagnes(DataService.list('campagnes', { userId: user.id, statut: 'en_cours' }))
      setCycles(DataService.list('cycles_elevage', { userId: user.id, statut: 'en_cours' }))
    }
  }, [user])

  const chartDataBar = {
    labels: ['Dépenses', 'Recettes', 'Résultat Estimated'],
    datasets: [
      {
        label: 'Montants (FCFA)',
        data: [stats.depenses, stats.recettes, Math.max(0, stats.resultat)],
        backgroundColor: ['#E53935', '#43A047', '#2E7D32'],
        borderRadius: 8,
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Bonjour, {user?.prenom} 👋</h1>
          <p className="page-subtitle">Voici l'état financier et opérationnel de votre exploitation.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/depenses?action=new" className="btn btn-danger btn-sm">
            <Plus size={16} /> Dépense
          </Link>
          <Link to="/dashboard/recettes?action=new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Recette
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid-4">
        <StatCard
          label="Total Recettes"
          value={formatMontant(stats.recettes)}
          icon={ArrowUpCircle}
          color="#43A047"
          bgIcon="#E8F5E9"
        />
        <StatCard
          label="Total Dépenses"
          value={formatMontant(stats.depenses)}
          icon={ArrowDownCircle}
          color="#E53935"
          bgIcon="#FFEBEE"
        />
        <StatCard
          label="Solde / Résultat"
          value={formatMontant(stats.resultat)}
          icon={Wallet}
          color={stats.resultat >= 0 ? '#2E7D32' : '#C62828'}
          bgIcon={stats.resultat >= 0 ? '#E8F5E9' : '#FFEBEE'}
        />
        <StatCard
          label="Activités En Cours"
          value={`${stats.campagnesActives} Campagne(s)`}
          icon={Calendar}
          color="#F9A825"
          bgIcon="#FFF8E1"
        />
      </div>

      {/* Charts & Highlights Grid */}
      <div className="grid-2 gap-6">
        {/* Financial Chart */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Bilan Financier Global</h3>
            <span className="text-xs text-muted">Devise: FCFA</span>
          </div>
          <BarChart data={chartDataBar} height={260} />
        </div>

        {/* Active Campaigns & Livestock Cycles */}
        <div className="card card-body">
          <h3 className="card-title mb-4">Activités en cours</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase mb-2">
                <span>Campagnes Agricoles ({campagnes.length})</span>
                <Link to="/dashboard/campagnes" className="text-primary hover:underline">Voir tout</Link>
              </div>

              {campagnes.length === 0 ? (
                <p className="text-sm text-muted italic">Aucune campagne active actuellement.</p>
              ) : (
                campagnes.map((c) => (
                  <div key={c.id} className="p-3 mb-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{c.nom}</p>
                      <p className="text-xs text-muted">{c.culture} • {c.superficie} ha ({c.parcelleName})</p>
                    </div>
                    <span className="badge badge-warning">En cours</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase mb-2">
                <span>Cycles d'Élevage ({cycles.length})</span>
                <Link to="/dashboard/cycles-elevage" className="text-primary hover:underline">Voir tout</Link>
              </div>

              {cycles.length === 0 ? (
                <p className="text-sm text-muted italic">Aucun cycle d'élevage actif.</p>
              ) : (
                cycles.map((cy) => (
                  <div key={cy.id} className="p-3 mb-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{cy.nom}</p>
                      <p className="text-xs text-muted">{cy.typeElevage} • {cy.nombreInitial} sujets (Mortalité: {cy.mortalite || 0})</p>
                    </div>
                    <span className="badge badge-info">En cours</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="card card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title">Opérations Récentes</h3>
          <div className="flex gap-2 text-xs">
            <Link to="/dashboard/depenses" className="text-primary font-medium hover:underline">Dépenses</Link>
            <span>•</span>
            <Link to="/dashboard/recettes" className="text-primary font-medium hover:underline">Recettes</Link>
          </div>
        </div>

        <div className="grid-2 gap-6">
          {/* Latest Expenses */}
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
              <ArrowDownCircle size={16} /> Dernières Dépenses
            </h4>
            {recentDepenses.length === 0 ? (
              <p className="text-xs text-muted">Aucune dépense enregistrée.</p>
            ) : (
              recentDepenses.map((d) => (
                <div key={d.id} className="activity-item">
                  <div className="activity-dot bg-red-500" />
                  <div className="activity-content">
                    <div className="flex justify-between">
                      <p className="activity-text font-medium">{d.description || d.categorie}</p>
                      <p className="font-bold text-red-600 text-sm">-{formatMontant(d.montant)}</p>
                    </div>
                    <p className="activity-time">{formatDateRelative(d.date)} • {d.categorie}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Latest Income */}
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
              <ArrowUpCircle size={16} /> Dernières Recettes
            </h4>
            {recentRecettes.length === 0 ? (
              <p className="text-xs text-muted">Aucune recette enregistrée.</p>
            ) : (
              recentRecettes.map((r) => (
                <div key={r.id} className="activity-item">
                  <div className="activity-dot bg-green-500" />
                  <div className="activity-content">
                    <div className="flex justify-between">
                      <p className="activity-text font-medium">{r.produit} ({r.quantite} {r.unite})</p>
                      <p className="font-bold text-green-600 text-sm">+{formatMontant(r.montantTotal)}</p>
                    </div>
                    <p className="activity-time">{formatDateRelative(r.date)} • {r.acheteur || 'Vente'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
