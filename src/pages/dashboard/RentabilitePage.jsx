import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import AtelierService from '../../services/AtelierService'
import { formatMontant, formatPourcentage } from '../../utils/formatters'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'
import { TrendingUp, Layers, Award, DollarSign, ShieldCheck, CheckCircle } from 'lucide-react'

export default function RentabilitePage() {
  const { user } = useAuth()
  const [ateliers, setAteliers] = useState([])
  const [comptesAteliers, setComptesAteliers] = useState([])

  useEffect(() => {
    if (user) {
      const listAteliers = AtelierService.getAteliers(user.id)
      setAteliers(listAteliers)

      const comptes = listAteliers.map(atl => {
        const stats = AtelierService.getCompteAnalytiqueAtelier(user.id, atl.id)
        return {
          ...atl,
          ...stats
        }
      })
      setComptesAteliers(comptes)
    }
  }, [user])

  const chartDataMargeAteliers = {
    labels: comptesAteliers.map(a => a.nom),
    datasets: [
      {
        label: 'Dépenses Directes (FCFA)',
        data: comptesAteliers.map(a => a.totalDepenses),
        backgroundColor: '#E53935',
      },
      {
        label: 'Recettes (FCFA)',
        data: comptesAteliers.map(a => a.totalRecettes),
        backgroundColor: '#43A047',
      },
      {
        label: 'Marge Nette (FCFA)',
        data: comptesAteliers.map(a => a.margeNette),
        backgroundColor: '#2E7D32',
      },
    ],
  }

  const chartDataDonut = {
    labels: comptesAteliers.map(a => a.nom),
    datasets: [
      {
        data: comptesAteliers.map(a => a.totalDepenses > 0 ? a.totalDepenses : 100000),
        backgroundColor: [
          '#2E7D32', '#F9A825', '#43A047', '#1E88E5', '#E53935', '#7B1FA2'
        ],
      },
    ],
  }

  const grandTotalRecettes = comptesAteliers.reduce((s, a) => s + a.totalRecettes, 0)
  const grandTotalDepenses = comptesAteliers.reduce((s, a) => s + a.totalDepenses, 0)
  const grandTotalMarge = grandTotalRecettes - grandTotalDepenses

  return (
    <div className="space-y-6">
      <div className="page-header-row flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="page-title">Compte de Résultat Analytique par Atelier</h1>
          <p className="page-subtitle">Isolation et calcul de la Marge Nette par activité d'exploitation (Normes Bancaires & FPE).</p>
        </div>
        <span className="badge badge-success text-xs font-semibold px-3 py-2 flex items-center gap-1">
          <ShieldCheck size={14} /> Cloisonnement Analytique Validé
        </span>
      </div>

      {/* Résumé global */}
      <div className="grid-3">
        <div className="card card-body">
          <span className="text-xs text-muted uppercase font-bold">Chiffre d'Affaires Global (Recettes)</span>
          <h2 className="text-2xl font-bold text-success mt-1">+{formatMontant(grandTotalRecettes)}</h2>
          <p className="text-xs text-muted mt-1">Somme des ventes de tous les ateliers</p>
        </div>

        <div className="card card-body">
          <span className="text-xs text-muted uppercase font-bold">Charges Directes Totales</span>
          <h2 className="text-2xl font-bold text-danger mt-1">-{formatMontant(grandTotalDepenses)}</h2>
          <p className="text-xs text-muted mt-1">Cumul des dépenses affectées</p>
        </div>

        <div className="card card-body bg-emerald-900 text-white">
          <span className="text-xs text-emerald-200 uppercase font-bold">Marge Nette Globale</span>
          <h2 className="text-2xl font-bold text-emerald-300 mt-1">{formatMontant(grandTotalMarge)}</h2>
          <p className="text-xs text-emerald-100 mt-1">Résultat économique consolidé</p>
        </div>
      </div>

      <div className="grid-2 gap-6">
        <div className="card card-body">
          <h3 className="card-title mb-4">Marge Nette par Atelier (FCFA)</h3>
          <BarChart data={chartDataMargeAteliers} height={280} />
        </div>

        <div className="card card-body">
          <h3 className="card-title mb-4">Répartition des Charges par Atelier</h3>
          <DoughnutChart data={chartDataDonut} height={280} />
        </div>
      </div>

      {/* Tableau Synthétique Analytique */}
      <div className="card card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">Compte d'Exploitation Analytique Détaillé</h3>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            Imprimer Fiche Bancaire
          </button>
        </div>

        <div className="table-container">
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Atelier d'Activité</th>
                <th>Type</th>
                <th>Ventes / Recettes</th>
                <th>Charges Directes</th>
                <th>Marge Nette</th>
                <th>Taux de Marge</th>
                <th>Évaluation Banque</th>
              </tr>
            </thead>
            <tbody>
              {comptesAteliers.map((atl) => (
                <tr key={atl.id}>
                  <td data-label="Atelier" className="font-bold flex items-center gap-2">
                    <Layers size={14} className="text-primary" /> {atl.nom}
                  </td>
                  <td data-label="Type">
                    <span className="badge badge-neutral text-xs">
                      {atl.type === 'vegetal' ? 'Culture' : atl.type === 'animal' ? 'Élevage' : 'Structure'}
                    </span>
                  </td>
                  <td data-label="Recettes" className="text-success font-bold">
                    +{formatMontant(atl.totalRecettes)}
                  </td>
                  <td data-label="Charges" className="text-danger font-bold">
                    -{formatMontant(atl.totalDepenses)}
                  </td>
                  <td data-label="Marge Nette" className={`font-bold ${atl.margeNette >= 0 ? 'text-emerald-700' : 'text-danger'}`}>
                    {formatMontant(atl.margeNette)}
                  </td>
                  <td data-label="Taux de Marge">
                    <span className={`badge ${atl.margeNette >= 0 ? 'badge-success' : 'badge-danger'}`}>
                      {atl.tauxMarge}%
                    </span>
                  </td>
                  <td data-label="Évaluation">
                    {atl.margeNette > 0 ? (
                      <span className="text-xs text-success font-semibold flex items-center gap-1">
                        <CheckCircle size={12} /> Solvable & Rentable
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold">
                        À optimiser
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
