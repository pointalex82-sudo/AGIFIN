import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import { formatMontant, formatDate } from '../../utils/formatters'
import DataTable from '../../components/ui/DataTable'
import { History, Filter } from 'lucide-react'

export default function HistoriquePage() {
  const { user } = useAuth()
  const [operations, setOperations] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [filterType, setFilterType] = useState('tous')
  const [filterCampagne, setFilterCampagne] = useState('')

  useEffect(() => {
    if (user) {
      const campList = DataService.list('campagnes', { userId: user.id })
      setCampagnes(campList)

      const deps = DataService.list('depenses', { userId: user.id }).map(d => ({
        ...d,
        typeOp: 'Dépense',
        montantAffichage: -d.montant,
        campagneName: campList.find(c => c.id === d.campagneId)?.nom || null,
      }))
      const recs = DataService.list('recettes', { userId: user.id }).map(r => ({
        ...r,
        typeOp: 'Recette',
        montantAffichage: r.montantTotal,
        campagneName: campList.find(c => c.id === r.campagneId)?.nom || null,
      }))

      const combined = [...deps, ...recs].sort((a, b) => new Date(b.date) - new Date(a.date))
      setOperations(combined)
    }
  }, [user])

  const filtered = operations.filter(op => {
    const typeMatch = filterType === 'tous' || (filterType === 'depense' && op.typeOp === 'Dépense') || (filterType === 'recette' && op.typeOp === 'Recette')
    const campagneMatch = !filterCampagne || op.campagneId === filterCampagne
    return typeMatch && campagneMatch
  })

  const totalFiltered = filtered.reduce((sum, op) => sum + (op.typeOp === 'Recette' ? Number(op.montantTotal || 0) : -Number(op.montant || 0)), 0)

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
      render: (r) => (
        <div>
          <p className="text-sm font-medium">{r.produit || r.description || r.categorie || '-'}</p>
          {r.campagneName && (
            <p className="text-xs text-primary font-medium mt-0.5">📌 {r.campagneName}</p>
          )}
          {r.typeOp === 'Dépense' && r.categorie && !r.campagneName && (
            <p className="text-xs text-muted mt-0.5">{r.categorie}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Montant',
      align: 'right',
      render: (r) => (
        <span className={`font-bold ${r.typeOp === 'Recette' ? 'text-success' : 'text-danger'}`}>
          {r.typeOp === 'Recette' ? '+' : '-'}{formatMontant(Math.abs(r.montantAffichage))}
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

      {/* Solde filtré */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${totalFiltered >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <span className="text-sm font-semibold text-gray-700">Solde sur la sélection :</span>
        <span className={`text-xl font-extrabold ${totalFiltered >= 0 ? 'text-success' : 'text-danger'}`}>
          {totalFiltered >= 0 ? '+' : ''}{formatMontant(totalFiltered)}
        </span>
      </div>

      <div className="filter-bar">
        <label className="text-sm font-medium flex items-center gap-2">
          <Filter size={16} /> Filtrer :
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

        <select
          className="form-select"
          value={filterCampagne}
          onChange={(e) => setFilterCampagne(e.target.value)}
        >
          <option value="">Toutes les campagnes</option>
          {campagnes.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
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
