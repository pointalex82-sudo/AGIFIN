import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { formatMontant, formatDate } from '../../utils/formatters'
import DataTable from '../../components/ui/DataTable'
import { History, Filter } from 'lucide-react'

export default function HistoriquePage() {
  const { user } = useAuth()
  const [operations, setOperations] = useState([])
  const [filterType, setFilterType] = useState('tous')

  useEffect(() => {
    if (user) {
      const deps = DataService.list('depenses', { userId: user.id }).map(d => ({
        ...d,
        typeOp: 'Dépense',
        montantAffichage: -d.montant,
      }))
      const recs = DataService.list('recettes', { userId: user.id }).map(r => ({
        ...r,
        typeOp: 'Recette',
        montantAffichage: r.montantTotal,
      }))

      const combined = [...deps, ...recs].sort((a, b) => new Date(b.date) - new Date(a.date))
      setOperations(combined)
    }
  }, [user])

  const filtered = operations.filter(op => {
    if (filterType === 'depense') return op.typeOp === 'Dépense'
    if (filterType === 'recette') return op.typeOp === 'Recette'
    return true
  })

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Type',
      accessor: 'typeOp',
      render: (r) => (
        <span className={`badge ${r.typeOp === 'Recette' ? 'badge-success' : 'badge-danger'}`}>
          {r.typeOp}
        </span>
      ),
    },
    {
      header: 'Désignation',
      render: (r) => r.produit || r.description || r.categorie || '-',
    },
    {
      header: 'Montant',
      align: 'right',
      render: (r) => (
        <span className={`font-bold ${r.typeOp === 'Recette' ? 'text-success' : 'text-danger'}`}>
          {r.typeOp === 'Recette' ? '+' : ''}{formatMontant(r.montantAffichage)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Historique de l'Exploitation</h1>
        <p className="page-subtitle">Retrouvez la mémoire chronologique de toutes vos opérations.</p>
      </div>

      <div className="filter-bar">
        <label className="text-sm font-medium flex items-center gap-2">
          <Filter size={16} /> Afficher :
        </label>
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="tous">Toutes les opérations</option>
          <option value="depense">Seulement les dépenses</option>
          <option value="recette">Seulement les recettes</option>
        </select>
      </div>

      <div className="card card-body">
        <DataTable
          columns={columns}
          data={filtered}
          emptyTitle="Aucune opération enregistrée"
          emptyDescription="Toutes vos dépenses et recettes enregistrées apparaîtront chronologiquement ici."
        />
      </div>
    </div>
  )
}
