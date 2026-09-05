import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DataService from '../../services/DataService'
import PDFService from '../../services/PDFService'
import CalculService from '../../services/CalculService'
import { useNotification } from '../../contexts/NotificationContext'
import { FileText, Download, Printer, FileCheck } from 'lucide-react'

export default function DocumentsPage() {
  const { user } = useAuth()
  const { addToast } = useNotification()
  const [exploitation, setExploitation] = useState(null)
  const [campagnes, setCampagnes] = useState([])
  const [selectedCampagneId, setSelectedCampagneId] = useState('')

  useEffect(() => {
    if (user) {
      const exList = DataService.list('exploitations', { userId: user.id })
      if (exList.length > 0) setExploitation(exList[0])
      const cList = DataService.list('campagnes', { userId: user.id })
      setCampagnes(cList)
      if (cList.length > 0) setSelectedCampagneId(cList[0].id)
    }
  }, [user])

  const handleDownloadCompteExploitation = () => {
    if (!exploitation) return
    const depenses = DataService.list('depenses', { userId: user.id })
    const recettes = DataService.list('recettes', { userId: user.id })
    const doc = PDFService.genererCompteExploitation(exploitation, depenses, recettes, 'Année 2026')
    PDFService.download(doc, `Compte_Exploitation_${exploitation.nom || 'AgriFin'}.pdf`)
    addToast('Compte d’exploitation téléchargeable au format PDF', 'success')
  }

  const handleDownloadRapportCampagne = () => {
    if (!exploitation || !selectedCampagneId) return
    const camp = campagnes.find(c => c.id === selectedCampagneId)
    if (!camp) return
    const depenses = DataService.list('depenses', { userId: user.id, campagneId: selectedCampagneId })
    const recettes = DataService.list('recettes', { userId: user.id, campagneId: selectedCampagneId })
    const doc = PDFService.genererRapportCampagne(camp, exploitation, depenses, recettes, [])
    PDFService.download(doc, `Rapport_Campagne_${camp.nom}.pdf`)
    addToast('Rapport de campagne téléchargé', 'success')
  }

  const handleDownloadSyntheseExploitation = () => {
    if (!exploitation) return
    const stats = CalculService.statsGlobales(user.id)
    const camps = DataService.list('campagnes', { userId: user.id })
    const doc = PDFService.genererSyntheseExploitation(exploitation, user, stats, camps)
    PDFService.download(doc, `Synthese_Exploitation_${exploitation.nom}.pdf`)
    addToast('Synthèse d’exploitation téléchargée', 'success')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">Mes Documents & Rapports</h1>
        <p className="page-subtitle">Générez des documents PDF structurés et imprimables à partir de vos données.</p>
      </div>

      <div className="grid-2 gap-6">
        {/* Document 1: Compte d'exploitation */}
        <div className="card card-body flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Compte d'Exploitation Globale</h3>
            <p className="text-sm text-muted mb-6">
              Rapport complet listant l'ensemble de vos recettes et de vos charges financières pour faire le bilan de l'exercice.
            </p>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleDownloadCompteExploitation}>
            <Download size={18} /> Générer le Compte (PDF)
          </button>
        </div>

        {/* Document 2: Synthèse Générale */}
        <div className="card card-body flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Synthèse de l'Exploitation</h3>
            <p className="text-sm text-muted mb-6">
              Document récapitulatif avec l'identité de l'exploitant, la superficie, le type de cultures et la performance globale.
            </p>
          </div>
          <button className="btn btn-outline btn-block" onClick={handleDownloadSyntheseExploitation}>
            <Download size={18} /> Télécharger la Synthèse (PDF)
          </button>
        </div>
      </div>

      {/* Document 3: Rapport par campagne spécifique */}
      <div className="card card-body">
        <h3 className="text-lg font-bold mb-2">Rapport par Campagne Spécifique</h3>
        <p className="text-sm text-muted mb-4">
          Sélectionnez la campagne agricole de votre choix pour exporter son bilan financier et opérationnel dédié.
        </p>

        {campagnes.length === 0 ? (
          <p className="text-sm text-muted italic">Aucune campagne disponible.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              className="form-select flex-1"
              value={selectedCampagneId}
              onChange={(e) => setSelectedCampagneId(e.target.value)}
            >
              {campagnes.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} ({c.culture})</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleDownloadRapportCampagne}>
              <Download size={18} /> Générer le Rapport de Campagne
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
