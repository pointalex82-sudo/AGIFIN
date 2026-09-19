import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import AtelierService from '../../services/AtelierService'
import { formatMontant, formatDate } from '../../utils/formatters'
import DataTable from '../../components/ui/DataTable'
import { History, Filter, Layers } from 'lucide-react'
import { CATEGORIES_DEPENSES } from '../../utils/constants'

export default function HistoriquePage() {
  const { user } = useAuth()
  const [operations, setOperations] = useState([])
  const [campagnes, setCampagnes] = useState([])
  const [ateliers, setAteliers] = useState([])
  const [filterType, setFilterType] = useState('tous')
  const [filterCampagne, setFilterCampagne] = useState('')
  const [filterAtelier, setFilterAtelier] = useState('')

  const getCatLabel = (val) => {
    const found = CATEGORIES_DEPENSES.find(c => c.value === val)
    return found ? found.label : val
  }

  useEffect(() => {
    if (user) {
      const campList = DataService.list('campagnes', { userId: user.id })
      setCampagnes(campList)

      const atlList = AtelierService.getAteliers(user.id)
      setAteliers(atlList)

      const deps = DataService.list('depenses', { userId: user.id }).map(d => ({
        ...d,
        typeOp: 'Dépense',
        montantAffichage: -d.montant,
        campagneName: campList.find(c => c.id === d.campagneId)?.nom || null,
        atelierName: atlList.find(a => a.id === d.atelierId)?.nom || 'Atelier Maïs 2026',
      }))

      const recs = DataService.list('recettes', { userId: user.id }).map(r => ({
        ...r,
        typeOp: 'Recette',
        montantAffichage: r.montantTotal,
        campagneName: campList.find(c => c.id === r.campagneId)?.nom || null,
        atelierName: atlList.find(a => a.id === r.atelierId)?.nom || 'Atelier Maïs 2026',
      }))

      const combined = [...deps, ...recs].sort((a, b) => new Date(b.date) - new Date(a.date))
      setOperations(combined)
    }
  }, [user])

  const filtered = operations.filter(op => {
    const typeMatch = filterType === 'tous' || (filterType === 'depense' && op.typeOp === 'Dépense') || (filterType === 'recette' && op.typeOp === 'Recette')
    const campagneMatch = !filterCampagne || op.campagneId === filterCampagne
    const atelierMatch = !filterAtelier || op.atelierId === filterAtelier || (!op.atelierId && filterAtelier === 'atl_mais_2026')
    return typeMatch && campagneMatch && atelierMatch
  })

  const totalFiltered = filtered.reduce((sum, op) => sum + (op.typeOp === 'Recette' ? Number(op.montantTotal || 0) : -Number(op.montant || 0)), 0)

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      render: (r) => formatDate(r.date),
    },
    {
      header: 'Atelier',
      render: (r) => (
        <span className="badge badge-primary flex items-center gap-1 text-xs">
          <Layers size={10} /> {r.atelierName}
        </span>
      ),
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
      header: 'Désignation & Catégorie',
      render: (r) => (
        <div>
          <p className="text-sm font-bold">{r.produit || r.description || getCatLabel(r.categorie) || '-'}</p>
          {r.typeOp === 'Dépense' && r.categorie && (
            <p className="text-xs text-muted font-medium mt-0.5">{getCatLabel(r.categorie)}</p>
          )}
          {r.campagneName && (
            <p className="text-xs text-primary font-medium mt-0.5">📌 {r.campagneName}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Montant',
      align: 'right',
      render: (r) => (
        <span className={`font-bold text-base ${r.typeOp === 'Recette' ? 'text-success' : 'text-danger'}`}>
          {r.typeOp === 'Recette' ? '+' : '-'}{formatMontant(Math.abs(r.montantAffichage))}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Historique & Journal des Opérations</h1>
        <p className="page-subtitle">Mémoire chronologique et traçabilité comptable de votre exploitation.</p>
      </div>

      {/* Solde filtré */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${totalFiltered >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <span className="text-sm font-semibold text-gray-700">Solde net sur les critères sélectionnés :</span>
        <span className={`text-xl font-extrabold ${totalFiltered >= 0 ? 'text-success' : 'text-danger'}`}>
          {totalFiltered >= 0 ? '+' : ''}{formatMontant(totalFiltered)}
        </span>
      </div>

      <div className="card card-body bg-base-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Filtrer par Flux :</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="tous">Tous les flux (Recettes + Dépenses)</option>
              <option value="depense">Seulement les dépenses (-)</option>
              <option value="recette">Seulement les recettes (+)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Filtrer par Atelier :</label>
            <select
              className="form-select"
              value={filterAtelier}
              onChange={(e) => setFilterAtelier(e.target.value)}
            >
              <option value="">Tous les Ateliers d'exploitation</option>
              {ateliers.map(a => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1">Filtrer par Campagne :</label>
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
        </div>
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
