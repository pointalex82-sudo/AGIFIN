import React from 'react'
import { Link } from 'react-router-dom'
import PublicHeader from '../../components/layout/PublicHeader'
import PublicFooter from '../../components/layout/PublicFooter'
import {
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  PieChart,
  Calendar,
  Users,
  CheckCircle,
  Sparkles,
  BarChart3,
  Landmark,
  ChevronRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      <PublicHeader />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="text-yellow-400" />
              <span>La mémoire numérique de votre exploitation</span>
            </div>

            <h1 className="hero-title">
              Gérez votre exploitation. <span>Maîtrisez vos chiffres.</span> Préparez votre avenir.
            </h1>

            <p className="hero-subtitle">
              Enregistrez vos dépenses, vos recettes et votre production. Suivez la performance de vos campagnes et construisez automatiquement l’historique économique de votre exploitation.
            </p>

            <div className="hero-actions">
              <Link to="/inscription" className="btn btn-primary btn-lg">
                Commencer gratuitement <ArrowRight size={20} />
              </Link>
              <Link to="/fonctionnalites" className="btn btn-outline btn-lg">
                Découvrir la plateforme
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Déclaratif & confidentiel</div>
              </div>
              <div>
                <div className="hero-stat-value">FCFA</div>
                <div className="hero-stat-label">Devise locale intégrée</div>
              </div>
              <div>
                <div className="hero-stat-value">PDF</div>
                <div className="hero-stat-label">Comptes d'exploitation 1-clic</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">PARCOURS SIMPLE & INTUITIF</span>
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">
              Passez progressivement d'une gestion sur papier à une vision claire et valorisée de votre activité.
            </p>
          </div>

          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-title">J’enregistre</div>
              <p className="step-desc">
                J'enregistre simplement mes dépenses (semences, engrais, main-d'œuvre), mes recettes et mes ventes au quotidien.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-title">Je suis</div>
              <p className="step-desc">
                Je suis la santé de mes parcelles, le déroulement de mes campagnes agricoles et mes cycles d’élevage en temps réel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-title">Je comprends</div>
              <p className="step-desc">
                La plateforme calcule automatiquement mes coûts de production, mon chiffre d'affaires, ma marge et mon résultat net.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-title">Je valorise</div>
              <p className="step-desc">
                Je consulte l’historique de mes campagnes et génère des comptes d’exploitation structurés pour mes besoins de financement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profils d'utilisateurs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ADAPTÉ À VOS BESOINS</span>
            <h2 className="section-title">Pour tous les acteurs du monde rural</h2>
            <p className="section-subtitle">
              Une interface claire conçue spécifiquement pour l'agriculture et l'élevage africains.
            </p>
          </div>

          <div className="grid-3">
            {/* Agriculteurs */}
            <div className="card card-body">
              <div className="badge badge-primary mb-4">Agriculteurs</div>
              <h3 className="text-xl font-bold mb-2">Grandes cultures & Maraîchage</h3>
              <p className="text-sm text-muted mb-6">
                Suivez vos parcelles, vos campagnes de maïs, riz, soja, ou légumes. Gérez vos intrants, votre main-d'œuvre et évaluez le rendement par hectare.
              </p>

              <ul className="flex flex-col gap-2 text-sm text-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Suivi parcellaire et rendement ha
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Suivi des achats d'intrants
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Calcul auto de la marge brute
                </li>
              </ul>

              <Link to="/inscription?role=exploitant" className="btn btn-outline btn-block">
                Espace Agriculteur
              </Link>
            </div>

            {/* Éleveurs */}
            <div className="card card-body">
              <div className="badge badge-warning mb-4">Éleveurs</div>
              <h3 className="text-xl font-bold mb-2">Volailles, Bovins, Petits Ruminants</h3>
              <p className="text-sm text-muted mb-6">
                Pilotez vos cycles d'élevage par lot. Suivez les effectifs, la mortalité, l'alimentation, la santé et les ventes d'animaux.
              </p>

              <ul className="flex flex-col gap-2 text-sm text-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Suivi des effectifs et mortalité
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Coûts d'alimentation et soins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Prix de revient par sujet
                </li>
              </ul>

              <Link to="/inscription?role=exploitant" className="btn btn-outline btn-block">
                Espace Éleveur
              </Link>
            </div>

            {/* Coopératives */}
            <div className="card card-body">
              <div className="badge badge-info mb-4">Coopératives & OP</div>
              <h3 className="text-xl font-bold mb-2">Organisations Paysannes</h3>
              <p className="text-sm text-muted mb-6">
                Consolidez les superficies et prévisions de production de vos membres, centralisez les besoins en intrants et organisez les ventes collectives.
              </p>

              <ul className="flex flex-col gap-2 text-sm text-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Repertoire des producteurs membres
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Consolidation des superficies (ha)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" /> Respect strict des partages autorisés
                </li>
              </ul>

              <Link to="/inscription?role=cooperative" className="btn btn-outline btn-block">
                Espace Coopérative
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module Financement Preview */}
      <section className="section section-alt">
        <div className="container">
          <div className="grid-2 items-center gap-12">
            <div>
              <div className="badge badge-primary mb-4">Facilitez vos démarches</div>
              <h2 className="section-title text-left">Préparez vos dossiers de financement</h2>
              <p className="text-muted mb-6 leading-relaxed">
                Lorsqu'une banque ou institution de microfinance vous demande votre historique de production ou un compte d'exploitation, générez directement votre dossier en un clic à partir de vos données enregistrées.
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">Comptes d’exploitation automatiques</h4>
                    <p className="text-sm text-muted">Synthèse claire des charges, des produits et du solde de l'exploitation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">Partage contrôlé & confidentiel</h4>
                    <p className="text-sm text-muted">Vous restez 100% propriétaire de vos données. Vous choisissez avec qui les partager.</p>
                  </div>
                </div>
              </div>

              <Link to="/inscription" className="btn btn-primary">
                Créer ma première synthèse <ChevronRight size={18} />
              </Link>
            </div>

            {/* Mockup Card */}
            <div className="card card-body bg-white shadow-xl border border-gray-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <span className="font-bold text-lg text-primary">Aperçu Synthèse Financement</span>
                <span className="badge badge-success">Généré en PDF</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-muted">Demandeur:</span>
                  <span className="font-semibold">Kofi KOUDJO</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-muted">Exploitation:</span>
                  <span className="font-semibold">Ferme Espoir (Tsévié)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-muted">Montant recherché:</span>
                  <span className="font-bold text-primary">1 500 000 FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-muted">Chiffre d'affaires 2025:</span>
                  <span className="font-semibold text-success">1 800 000 FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-muted">Coût de production:</span>
                  <span className="font-semibold text-danger">824 000 FCFA</span>
                </div>
                <div className="flex justify-between py-2 bg-primary-50 rounded-lg px-3">
                  <span className="font-bold">Marge Brute Réalisée:</span>
                  <span className="font-extrabold text-primary">+976 000 FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Prenez le contrôle des chiffres de votre exploitation dès aujourd’hui</h2>
          <p className="cta-subtitle">
            Rejoignez des dizaines d’exploitants et de coopératives qui ont choisi la clarté et la simplicité pour leur avenir.
          </p>
          <Link to="/inscription" className="btn btn-accent btn-lg">
            Créer mon compte gratuitement <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
