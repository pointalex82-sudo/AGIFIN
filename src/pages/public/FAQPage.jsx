import React, { useState } from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import PublicFooter from '../../components/layout/PublicFooter'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: 'Est-ce que l’inscription à AgriFin est gratuite ?',
      a: 'Oui, l’inscription et la création d’exploitation sont entièrement gratuites dans cette première version. Vous pouvez enregistrer toutes vos dépenses, recettes et campagnes sans frais.'
    },
    {
      q: 'Est-ce que l’application garantit l’obtention d’un crédit bancaire ?',
      a: 'Non, la plateforme permet de structurer et d’exporter vos données d’exploitation sous forme de documents clairs et synthétiques. La décision d’octroyer un financement appartient entièrement à la banque ou à l’institution de microfinance.'
    },
    {
      q: 'La plateforme fonctionne-t-elle sur smartphone ?',
      a: 'Absolument. AgriFin est conçu Mobile-First pour fonctionner confortablement depuis le navigateur internet de n’importe quel smartphone ou tablette.'
    },
    {
      q: 'Qui peut voir les données financières de mon exploitation ?',
      a: 'Vous seul. L’exploitant est le propriétaire exclusif de ses données. Si vous appartenez à une coopérative, vous choisissez exactement quelles informations (par exemple la superficie ou la production, mais pas les chiffres financiers) vous acceptez de partager.'
    },
    {
      q: 'Quelle est la devise utilisée ?',
      a: 'Par défaut, AgriFin utilise le Franc CFA (FCFA), adapté à la zone UEMOA (Togo, Bénin, Côte d’Ivoire, Burkina Faso, Mali, Niger, Sénégal, Guinée-Bissau).'
    },
    {
      q: 'Comment générer un compte d’exploitation en PDF ?',
      a: 'Rendez-vous dans la rubrique "Mes documents" de votre tableau de bord, sélectionnez le type de document souhaité ("Compte d’exploitation" ou "Synthèse"), puis cliquez sur "Générer PDF".'
    }
  ]

  return (
    <div>
      <PublicHeader />

      <div className="section bg-primary text-white pt-24 pb-16">
        <div className="container text-center max-w-3xl">
          <span className="badge badge-accent mb-4">QUESTIONS FRÉQUENTES</span>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Tout ce que vous devez savoir sur AgriFin</h1>
          <p className="text-lg opacity-90">
            Trouvez les réponses aux questions les plus courantes des exploitants et des coopératives.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className="faq-icon" size={20} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
