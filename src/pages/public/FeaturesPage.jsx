import React from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import PublicFooter from '../../components/layout/PublicFooter'
import {
  Map,
  Calendar,
  Bird,
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  TrendingUp,
  History,
  FileText,
  Landmark,
  Users,
  ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FeaturesPage() {
  const features = [
    {
      title: 'Gestion des Parcelles',
      icon: Map,
      description: 'Cartographiez vos terres, suivez leur superficie (ha), la culture actuelle, les rendements et l’historique des récoltes précédentes.',
      color: '#2E7D32'
    },
    {
      title: 'Campagnes Agricoles',
      icon: Calendar,
      description: 'Créez vos campagnes (Maïs, Soja, Riz, etc.), planifiez les dates de semis et récolte, et rattachez-y toutes vos dépenses et recettes.',
      color: '#1565C0'
    },
    {
      title: 'Cycles d’Élevage',
      icon: Bird,
      description: 'Module spécifique pour l’élevage (volailles, petits ruminants, bovins). Suivi des effectifs, de la mortalité, de l’alimentation et des ventes.',
      color: '#E65100'
    },
    {
      title: 'Saisie ultra-rapide des Dépenses',
      icon: ArrowDownCircle,
      description: 'Ajoutez une dépense en quelques secondes par catégorie : semences, engrais, main-d’œuvre, phytosanitaire, carburant, aliment.',
      color: '#C62828'
    },
    {
      title: 'Suivi des Recettes & Ventes',
      icon: ArrowUpCircle,
      description: 'Enregistrez vos ventes avec quantité, unité (kg, sac, tonne) et prix unitaire. Le calcul du montant total est instantané.',
      color: '#2E7D32'
    },
    {
      title: 'Enregistrement de la Production',
      icon: Package,
      description: 'Enregistrez vos récoltes et productions animales. Suivez les quantités vendues vs les quantités stockées ou consommées.',
      color: '#F9A825'
    },
    {
      title: 'Analyse & Rentabilité',
      icon: TrendingUp,
      description: 'Visualisez vos marges, vos coûts de production et comparez la rentabilité de vos différentes campagnes pour faire de meilleurs choix.',
      color: '#7B1FA2'
    },
    {
      title: 'Historique Économique',
      icon: History,
      description: 'Gardez la mémoire complète de votre exploitation sur plusieurs années. Retrouvez en un instant ce qui s’est passé en 2024, 2025, 2026.',
      color: '#00838F'
    },
    {
      title: 'Génération de Documents PDF',
      icon: FileText,
      description: 'Téléchargez automatiquement votre compte d’exploitation, rapport de campagne ou état des dépenses sous format PDF propre et imprimable.',
      color: '#424242'
    },
    {
      title: 'Module Financement',
      icon: Landmark,
      description: 'Préparez votre dossier de financement sans ressaisir vos données. Générez une synthèse économique prête à être présentée aux institutions.',
      color: '#2E7D32'
    },
    {
      title: 'Espace Coopératives',
      icon: Users,
      description: 'Tableau de bord collectif pour consolider la superficie des membres, les prévisions de récolte et les besoins groupés en intrants.',
      color: '#1565C0'
    },
    {
      title: 'Partage Contrôlé & Sécurité',
      icon: ShieldCheck,
      description: 'L’exploitant est seul propriétaire de ses données. Choisissez exactement quelles données partager avec votre coopérative.',
      color: '#E65100'
    }
  ]

  return (
    <div>
      <PublicHeader />

      <div className="section bg-primary text-white pt-24 pb-16">
        <div className="container text-center max-w-3xl">
          <span className="badge badge-accent mb-4">FONCTIONNALITÉS COMPLÈTES</span>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Tout ce dont vous avez besoin pour piloter votre activité</h1>
          <p className="text-lg opacity-90">
            Une suite d'outils simples et modernes conçue pour répondre aux défis réels des agriculteurs, des éleveurs et des coopératives.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="feature-card">
                  <div
                    className="feature-card-icon"
                    style={{ backgroundColor: `${f.color}15`, color: f.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.description}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <Link to="/inscription" className="btn btn-primary btn-lg">
              Tester gratuitement AgriFin
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
