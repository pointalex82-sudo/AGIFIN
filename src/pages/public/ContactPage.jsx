import React, { useState } from 'react'
import PublicHeader from '../../components/layout/PublicHeader'
import PublicFooter from '../../components/layout/PublicFooter'
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <PublicHeader />

      <div className="section bg-primary text-white pt-24 pb-16">
        <div className="container text-center max-w-3xl">
          <span className="badge badge-accent mb-4">CONTACT & SUPPORT</span>
          <h1 className="text-4xl font-extrabold mb-4 text-white">Une question ? Un accompagnement ?</h1>
          <p className="text-lg opacity-90">
            Notre équipe est à votre disposition pour vous aider dans la prise en main d'AgriFin.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container max-w-4xl">
          <div className="grid-2 gap-8">
            {/* Infos Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Adresse</h4>
                    <p className="text-sm text-muted">Lomé & Tsévié, Togo</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Téléphone / WhatsApp</h4>
                    <p className="text-sm text-muted">+228 90 12 34 56</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted">contact@agrifin.tg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="card card-body">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                  <p className="text-sm text-muted">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-bold mb-4">Envoyez-nous un message</h3>
                  <div className="form-group">
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.nom}
                      onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adresse Email ou Téléphone</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email ou N° WhatsApp"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-textarea"
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Comment pouvons-nous vous aider ?"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Envoyer mon message <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
