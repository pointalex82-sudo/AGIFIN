import React from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import PublicFooter from '../../components/layout/PublicFooter'
import { Sprout, Target, Shield, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div>
      <PublicHeader />

      <div className="section bg-primary text-white pt-24 pb-16">
        <div className="container text-center max-w-3xl">
          <span className="badge badge-accent mb-4">NOTRE MISSION</span>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Construire la mémoire numérique des exploitations rurales</h1>
          <p className="text-lg opacity-90">
            AgriFin a été pensé pour transformer les données quotidiennes du monde agricole en levier de croissance et d’autonomie.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container max-w-4xl">
          <div className="grid-2 gap-8 mb-16">
            <div className="card card-body">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
                <Target size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">Le Constat</h3>
              <p className="text-muted leading-relaxed">
                Les agriculteurs et éleveurs réalisent un travail considérable et rentable, mais faute d’outils adaptés, leurs données restent consignées dans des cahiers ou perdues dans leur mémoire. Lors des demandes de financement, il leur est très difficile de justifier de leur historique économique.
              </p>
            </div>

            <div className="card card-body">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
                <Sprout size={26} />
              </div>
              <h3 className="text-xl font-bold mb-3">La Solution</h3>
              <p className="text-muted leading-relaxed">
                AgriFin permet d’enregistrer simplement en quelques secondes par jour les opérations financières et agricoles. La plateforme calcule automatiquement la rentabilité et permet de générer des comptes d’exploitation professionnels.
              </p>
            </div>
          </div>

          <div className="card card-body bg-white border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Nos Engagements</h2>
            <div className="grid-3 gap-6 mt-6">
              <div>
                <Shield size={32} className="text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Propriété des données</h4>
                <p className="text-xs text-muted">Vous êtes le seul propriétaire de vos chiffres. Aucun partage n'est fait sans votre accord explicit.</p>
              </div>
              <div>
                <Heart size={32} className="text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Simplicité d'usage</h4>
                <p className="text-xs text-muted">Conçu pour être utilisé confortablement depuis un smartphone sur le terrain.</p>
              </div>
              <div>
                <Sprout size={32} className="text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Impact réel</h4>
                <p className="text-xs text-muted">Aider les producteurs à mieux négocier et mieux planifier leurs investissements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
