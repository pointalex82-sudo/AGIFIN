import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import CalculService from '../../services/CalculService'
import { formatMontant, formatPourcentage } from '../../utils/formatters'
import BarChart from '../../components/charts/BarChart'
import DoughnutChart from '../../components/charts/DoughnutChart'
import { TrendingUp, Award, DollarSign, Percent, Activity } from 'lucide-react'

export default function RentabilitePage() {
  const { user } = useAuth()
  const [campagnesComparaison, setCampagnesComparaison] = useState([])
  const [repartitionDepenses, setRepartitionDepenses] = useState({})
  const [productions, setProductions] = useState([])

  useEffect(() => {
    if (user) {
      const comp = CalculService.comparerCampagnes(user.id)
      setCampagnesComparaison(comp)

      const rep = CalculService.repartitionDepenses(user.id)
      setRepartitionDepenses(rep)

      const prods = DataService.list('productions', { userId: user.id })
      setProductions(prods)
    }
  }, [user])

  const chartDataCampagnes = {
    labels: campagnesComparaison.map(c => c.nom),
    datasets: [
      {
        label: 'Dépenses',
        data: campagnesComparaison.map(c => c.depenses),
        backgroundColor: '#E53935',
      },
      {
        label: 'Recettes',
        data: campagnesComparaison.map(c => c.recettes),
        backgroundColor: '#43A047',
      },
      {
        label: 'Résultat',
        data: campagnesComparaison.map(c => c.resultat),
        backgroundColor: '#2E7D32',
      },
    ],
  }

  const chartDataDonut = {
    labels: Object.keys(repartitionDepenses),
    datasets: [
      {
        data: Object.values(repartitionDepenses),
        backgroundColor: [
          '#43A047', '#E53935', '#FB8C00', '#1E88E5', '#7B1FA2', '#00838F', '#F9A825'
        ],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Analyse & Rentabilité</h1>
        <p className="page-subtitle">Comprenez vos marges et vos plus grandes sources de coûts.</p>
      </div>

      <div className="grid-2 gap-6">
        <div className="card card-body">
          <h3 className="card-title mb-4">Comparatif des Campagnes (FCFA)</h3>
          <BarChart data={chartDataCampagnes} height={300} />
        </div>

        <div className="card card-body">
          <h3 className="card-title mb-4">Répartition des Dépenses par Poste</h3>
          {Object.keys(repartitionDepenses).length === 0 ? (
            <p className="text-sm text-muted text-center py-12">Aucune dépense pour l'instant.</p>
          ) : (
            <DoughnutChart data={chartDataDonut} height={300} />
          )}
        </div>
      </div>

      {/* Table comparatives */}
      <div className="card card-body">
        <h3 className="card-title mb-4">Tableau Synthétique de Rentabilité par Campagne</h3>
        <div className="table-container">
          <table className="table-responsive">
            <thead>
              <tr>
                <th>Campagne</th>
                <th>Culture</th>
                <th>Superficie</th>
                <th>Rendement/ha</th>
                <th>Dépenses Totales</th>
                <th>Recettes Totales</th>
                <th>Résultat Net</th>
                <th>Marge Brute %</th>
              </tr>
            </thead>
            <tbody>
              {campagnesComparaison.map((c) => {
                const prodsCampagne = productions.filter(p => p.campagneId === c.id)
                const totalQte = prodsCampagne.reduce((sum, p) => sum + (Number(p.quantite) || 0), 0)
                const rendementHa = c.superficie && totalQte ? (totalQte / Number(c.superficie)).toFixed(0) : null
                const margeColor = c.marge > 20 ? 'badge-success' : c.marge > 0 ? 'badge-warning' : 'badge-danger'
                return (
                  <tr key={c.id}>
                    <td data-label="Campagne" className="font-bold">{c.nom}</td>
                    <td data-label="Culture">{c.culture}</td>
                    <td data-label="Superficie">{c.superficie} ha</td>
                    <td data-label="Rendement/ha">
                      {rendementHa
                        ? <span className="font-medium text-primary">{Number(rendementHa).toLocaleString('fr-FR')} kg/ha</span>
                        : <span className="text-muted text-xs">N/A</span>
                      }
                    </td>
                    <td data-label="Dépenses" className="text-danger font-medium">-{formatMontant(c.depenses)}</td>
                    <td data-label="Recettes" className="text-success font-medium">+{formatMontant(c.recettes)}</td>
                    <td data-label="Résultat" className={`font-bold ${c.resultat >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatMontant(c.resultat)}
                    </td>
                    <td data-label="Marge Brute %">
                      <span className={`badge ${margeColor}`}>
                        {formatPourcentage(c.marge)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
