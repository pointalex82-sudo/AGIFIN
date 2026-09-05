import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import PDFService from '../../services/PDFService'
import CalculService from '../../services/CalculService'
import { useNotification } from '../../contexts/NotificationContext'
import { Landmark, FileText, AlertTriangle, Download, CheckCircle2 } from 'lucide-react'
import { formatMontant } from '../../utils/formatters'

export default function FinancementPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [exploitation, setExploitation] = useState(null)
  const [campagnes, setCampagnes] = useState([])
  const [stats, setStats] = useState({ depenses: 0, recettes: 0, resultat: 0 })

  const [demande, setDemande] = useState({
    montant: 1000000,
    objet: 'Achat d’intrants et semences certifiées',
    activite: 'Campagne agricole Maïs / Soja',
    campagneId: '',
    duree: '12 mois',
  })

  useEffect(() => {
    if (user) {
      const exList = DataService.list('exploitations', { userId: user.id })
      if (exList.length > 0) setExploitation(exList[0])
      const cList = DataService.list('campagnes', { userId: user.id })
      setCampagnes(cList)
      setStats(CalculService.statsGlobales(user.id))
    }
  }, [user])

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!exploitation) return
    const doc = PDFService.genererSyntheseFinancement(demande, exploitation, user, stats, campagnes)
    PDFService.download(doc, `Dossier_Financement_${user.nom}.pdf`)
    addToast('Synthèse de demande de financement générée en PDF !', 'success')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">Module Financement</h1>
        <p className="page-subtitle">Préparez facilement un dossier structuré à présenter aux institutions financières.</p>
      </div>

      {/* Mandatory Regulatory Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-4 items-start">
        <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
        <div className="text-sm text-amber-900">
          <p className="font-bold mb-1">Avertissement Important</p>
          <p>
            Ce document présente les informations enregistrées dans votre exploitation. Il ne garantit pas l'obtention d'un financement. La décision d'octroyer un crédit reste entièrement du ressort de l'institution financière (banque ou microfinance).
          </p>
        </div>
      </div>

      <div className="grid-2 gap-6">
        {/* Formulaire de pré-demande */}
        <div className="card card-body">
          <h3 className="card-title mb-4">Informations sur votre besoin</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Montant recherché (FCFA) *</label>
              <input
                type="number"
                className="form-input text-lg font-bold text-primary"
                required
                value={demande.montant}
                onChange={(e) => setDemande({ ...demande, montant: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Objet du financement *</label>
              <input
                type="text"
                className="form-input"
                required
                value={demande.objet}
                onChange={(e) => setDemande({ ...demande, objet: e.target.value })}
                placeholder="ex: Achat d'intrants / Achat de poussins"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Activité ou Campagne concernée *</label>
              <input
                type="text"
                className="form-input"
                required
                value={demande.activite}
                onChange={(e) => setDemande({ ...demande, activite: e.target.value })}
                placeholder="ex: Campagne Maïs 2026"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Durée de remboursement souhaitée</label>
              <select
                className="form-select"
                value={demande.duree}
                onChange={(e) => setDemande({ ...demande, duree: e.target.value })}
              >
                <option value="6 mois">6 mois (Court terme)</option>
                <option value="12 mois">12 mois (1 an)</option>
                <option value="24 mois">24 mois (2 ans)</option>
                <option value="36 mois">36 mois (3 ans)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg mt-6">
              <Download size={18} /> Générer ma Synthèse de Financement
            </button>
          </form>
        </div>

        {/* Live Data Summary Card */}
        <div className="card card-body bg-gray-50 border border-gray-200">
          <h3 className="card-title mb-4">Données automatiques incluses</h3>

          <div className="space-y-4 text-sm">
            <div className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between">
              <span className="text-muted">Exploitation:</span>
              <span className="font-bold">{exploitation?.nom || 'Ferme'}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between">
              <span className="text-muted">Superficie déclarée:</span>
              <span className="font-bold">{exploitation?.superficie || 0} ha</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between">
              <span className="text-muted">Historique des Recettes:</span>
              <span className="font-bold text-success">+{formatMontant(stats.recettes)}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-100 flex justify-between">
              <span className="text-muted">Historique des Dépenses:</span>
              <span className="font-bold text-danger">-{formatMontant(stats.depenses)}</span>
            </div>

            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100 flex justify-between">
              <span className="font-bold text-primary-900">Capacité Estimée (Résultat):</span>
              <span className="font-extrabold text-primary">{formatMontant(stats.resultat)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
