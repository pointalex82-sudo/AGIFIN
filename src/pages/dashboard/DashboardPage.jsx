import React, { useState, useEffect } from 'react'
import { useAuth, useActivite } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import CalculService from '../../services/CalculService'
import { formatMontant, formatDate, formatDateRelative } from '../../utils/formatters'

import StatCard from '../../components/ui/StatCard'
import BarChart from '../../components/charts/BarChart'

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Calendar,
  Bird,
  Package,
  Plus,
  Leaf,
  MapPin,
  Layers,
  Sprout,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { user } = useAuth()
  const { isAgri, isElevage, typeActivite } = useActivite()

  const [stats, setStats] = useState({
    depenses: 0, recettes: 0, resultat: 0,
    campagnesActives: 0, cyclesActifs: 0, totalProduction: 0,
  })
  const [recentDepenses, setRecentDepenses] = useState([])
  const [recentRecettes, setRecentRecettes] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [cycles, setCycles] = useState([])
  const [exploitation, setExploitation] = useState(null)

  useEffect(() => {
    if (user) {
      const globStats = CalculService.statsGlobales(user.id)
      setStats(globStats)
      setRecentDepenses(DataService.list('depenses', { userId: user.id }).slice(0, 5))
      setRecentRecettes(DataService.list('recettes', { userId: user.id }).slice(0, 5))
      if (isAgri) setCampagnes(DataService.list('campagnes', { userId: user.id, statut: 'en_cours' }))
      if (isElevage) setCycles(DataService.list('cycles_elevage', { userId: user.id, statut: 'en_cours' }))
      const exps = DataService.list('exploitations', { userId: user.id })
      if (exps.length > 0) setExploitation(exps[0])
    }
  }, [user, isAgri, isElevage])

  // Aucune donnée financière → guide de démarrage
  const hasFinancialData = stats.depenses > 0 || stats.recettes > 0

  const chartDataBar = {
    labels: ['Dépenses', 'Recettes', 'Résultat'],
    datasets: [
      {
        label: 'Montants (FCFA)',
        data: [stats.depenses, stats.recettes, Math.max(0, stats.resultat)],
        backgroundColor: ['#E53935', '#43A047', '#2E7D32'],
        borderRadius: 8,
      },
    ],
  }

  // Titre de la page selon l'activité
  const subtitleText = {
    agriculture: "Voici l'état de votre exploitation agricole.",
    elevage: "Voici l'état de votre activité d'élevage.",
    mixte: "Voici l'état global de votre exploitation.",
  }[typeActivite] || "Voici l'état de votre exploitation."

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Bonjour, {user?.prenom} 👋</h1>
          <p className="page-subtitle">{subtitleText}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/dashboard/depenses?action=new" className="btn btn-danger btn-sm">
            <Plus size={16} /> Dépense
          </Link>
          <Link to="/dashboard/recettes?action=new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Recette
          </Link>
        </div>
      </div>

      {/* Info exploitation (si disponible) */}
      {exploitation && exploitation.localisation && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#166534',
        }}>
          <MapPin size={14} />
          <strong>{exploitation.nom}</strong>
          <span style={{ color: '#6B7280' }}>•</span>
          <span>{exploitation.localisation}</span>
          {exploitation.superficie && (
            <>
              <span style={{ color: '#6B7280' }}>•</span>
              <span>{exploitation.superficie} ha</span>
            </>
          )}
        </div>
      )}

      {/* === ÉTAT VIDE : Aucune donnée → guide de démarrage === */}
      {!hasFinancialData && (
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
          border: '1px solid #BBF7D0',
          borderRadius: '16px',
          padding: '28px 24px',
        }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{
              width: 48, height: 48, borderRadius: '12px',
              background: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>
              <Sprout size={24} color="#16A34A" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Bienvenue sur AgriFin !</p>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>Commencez en quelques étapes simples</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isAgri && (
              <Link to="/dashboard/parcelles" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: 'white', borderRadius: '10px',
                border: '1px solid #E5E7EB', textDecoration: 'none', color: 'inherit',
              }}>
                <div style={{ width: 36, height: 36, background: '#E8F5E9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={18} color="#2E7D32" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>1. Ajouter ma première parcelle</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Culture, superficie, campagne</p>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </Link>
            )}
            {isElevage && (
              <Link to="/dashboard/cycles-elevage" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: 'white', borderRadius: '10px',
                border: '1px solid #E5E7EB', textDecoration: 'none', color: 'inherit',
              }}>
                <div style={{ width: 36, height: 36, background: '#FFF3E0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bird size={18} color="#E65100" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>1. Créer mon premier cycle d'élevage</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Espèce, effectif, dates</p>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </Link>
            )}
            <Link to="/dashboard/depenses?action=new" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'white', borderRadius: '10px',
              border: '1px solid #E5E7EB', textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{ width: 36, height: 36, background: '#FFEBEE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowDownCircle size={18} color="#C62828" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>{isAgri ? '2.' : '2.'} Enregistrer ma première dépense</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Semences, engrais, main-d'œuvre…</p>
              </div>
              <ChevronRight size={16} color="#9CA3AF" />
            </Link>
            <Link to="/dashboard/recettes?action=new" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'white', borderRadius: '10px',
              border: '1px solid #E5E7EB', textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{ width: 36, height: 36, background: '#E8F5E9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpCircle size={18} color="#2E7D32" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>3. Enregistrer ma première vente</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Produit, quantité, prix → AgriFin calcule le total</p>
              </div>
              <ChevronRight size={16} color="#9CA3AF" />
            </Link>
          </div>
        </div>
      )}

      {/* === KPI STATS (visibles même sans données) === */}
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
        {isAgri && (
          <StatCard
            label="Campagnes en cours"
            value={`${stats.campagnesActives} campagne${stats.campagnesActives !== 1 ? 's' : ''}`}
            icon={Calendar}
            color="#F9A825"
            bgIcon="#FFF8E1"
          />
        )}
        {isElevage && !isAgri && (
          <StatCard
            label="Cycles d'élevage actifs"
            value={`${stats.cyclesActifs} cycle${stats.cyclesActifs !== 1 ? 's' : ''}`}
            icon={Bird}
            color="#E65100"
            bgIcon="#FFF3E0"
          />
        )}
        {!isAgri && !isElevage && (
          <StatCard
            label="Production totale"
            value={stats.totalProduction > 0 ? `${stats.totalProduction} unités` : '—'}
            icon={Package}
            color="#1565C0"
            bgIcon="#E3F2FD"
          />
        )}
      </div>

      {/* === GRAPHIQUES & ACTIVITÉS EN COURS === */}
      {hasFinancialData && (
        <div className="grid-2 gap-6">
          {/* Graphique financier */}
          <div className="card card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Bilan Financier</h3>
              <span className="text-xs text-muted">Devise: FCFA</span>
            </div>
            <BarChart data={chartDataBar} height={260} />
          </div>

          {/* Activités en cours — adaptées au profil */}
          <div className="card card-body">
            <h3 className="card-title mb-4">Activités en cours</h3>
            <div className="space-y-4">
              {/* Campagnes agricoles — agriculture seulement */}
              {isAgri && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase mb-2">
                    <span>Campagnes agricoles ({campagnes.length})</span>
                    <Link to="/dashboard/campagnes" className="text-primary hover:underline">Voir tout</Link>
                  </div>
                  {campagnes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                      <p className="text-sm text-muted">Aucune campagne active.</p>
                      <Link to="/dashboard/campagnes" className="text-xs text-primary font-medium mt-1 inline-block">
                        + Créer une campagne
                      </Link>
                    </div>
                  ) : (
                    campagnes.map((c) => (
                      <div key={c.id} className="p-3 mb-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{c.nom}</p>
                          <p className="text-xs text-muted">{c.culture} • {c.superficie} ha</p>
                        </div>
                        <span className="badge badge-warning">En cours</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Cycles d'élevage — élevage seulement */}
              {isElevage && (
                <div className={isAgri ? 'pt-3 border-t border-gray-100' : ''}>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase mb-2">
                    <span>Cycles d'élevage ({cycles.length})</span>
                    <Link to="/dashboard/cycles-elevage" className="text-primary hover:underline">Voir tout</Link>
                  </div>
                  {cycles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                      <p className="text-sm text-muted">Aucun cycle actif.</p>
                      <Link to="/dashboard/cycles-elevage" className="text-xs text-primary font-medium mt-1 inline-block">
                        + Créer un cycle
                      </Link>
                    </div>
                  ) : (
                    cycles.map((cy) => (
                      <div key={cy.id} className="p-3 mb-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{cy.nom}</p>
                          <p className="text-xs text-muted">{cy.typeElevage} • {cy.nombreInitial} sujets</p>
                        </div>
                        <span className="badge badge-info">En cours</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === OPÉRATIONS RÉCENTES === */}
      {hasFinancialData && (
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
            {/* Dernières dépenses */}
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <ArrowDownCircle size={16} /> Dernières Dépenses
              </h4>
              {recentDepenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', background: '#FFF5F5', borderRadius: '8px' }}>
                  <p className="text-xs text-muted mb-2">Aucune dépense enregistrée.</p>
                  <Link to="/dashboard/depenses?action=new" className="btn btn-danger btn-sm">
                    <Plus size={14} /> Ajouter
                  </Link>
                </div>
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

            {/* Dernières recettes */}
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <ArrowUpCircle size={16} /> Dernières Recettes
              </h4>
              {recentRecettes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', background: '#F0FDF4', borderRadius: '8px' }}>
                  <p className="text-xs text-muted mb-2">Aucune recette enregistrée.</p>
                  <Link to="/dashboard/recettes?action=new" className="btn btn-primary btn-sm">
                    <Plus size={14} /> Ajouter
                  </Link>
                </div>
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
      )}
    </div>
  )
}
