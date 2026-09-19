import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Sprout, Leaf, Bird, Layers, MapPin, Ruler, ChevronRight, CheckCircle2 } from 'lucide-react'

const STEPS = ['Votre activité', 'Votre exploitation']

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [typeActivite, setTypeActivite] = useState('')
  const [form, setForm] = useState({
    nomExploitation: user ? `Exploitation de ${user.prenom || user.nom || ''}`.trim() : '',
    localisation: '',
    superficie: '',
  })
  const [error, setError] = useState('')

  const handleActivite = (val) => {
    setTypeActivite(val)
    setError('')
  }

  const handleNext = () => {
    if (step === 0) {
      if (!typeActivite) {
        setError('Veuillez sélectionner votre activité pour continuer.')
        return
      }
      setStep(1)
    }
  }

  const handleFinish = (e) => {
    e.preventDefault()
    setError('')
    completeOnboarding({
      typeActivite,
      nomExploitation: form.nomExploitation,
      localisation: form.localisation,
      superficie: form.superficie,
    })
    // Rediriger selon le rôle
    if (user?.role === 'cooperative') {
      navigate('/cooperative/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const activiteOptions = [
    {
      value: 'agriculture',
      icon: Leaf,
      label: 'Agriculture',
      desc: 'Cultures, parcelles, campagnes, récoltes',
      color: '#2E7D32',
      bg: '#E8F5E9',
    },
    {
      value: 'elevage',
      icon: Bird,
      label: 'Élevage',
      desc: 'Animaux, cycles, alimentation, production animale',
      color: '#E65100',
      bg: '#FFF3E0',
    },
    {
      value: 'mixte',
      icon: Layers,
      label: 'Agriculture + Élevage',
      desc: 'Les deux activités combinées sur mon exploitation',
      color: '#1565C0',
      bg: '#E3F2FD',
    },
  ]

  return (
    <div className="auth-page" style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="logo-icon">
            <Sprout size={22} />
          </div>
          <span className="text-primary text-2xl font-bold">AgriFin</span>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: i < step ? '#2E7D32' : i === step ? 'var(--color-primary)' : '#E5E7EB',
                    color: i <= step ? '#fff' : '#9CA3AF',
                    transition: 'all 0.3s',
                  }}
                >
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: i === step ? 700 : 400,
                    color: i === step ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? '#2E7D32' : '#E5E7EB', borderRadius: 4, transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── ÉTAPE 0 : Choisir l'activité ── */}
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 6 }}>
              Quelle est votre activité ?
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: '14px' }}>
              AgriFin adaptera votre interface en fonction de votre choix.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activiteOptions.map((opt) => {
                const Icon = opt.icon
                const selected = typeActivite === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleActivite(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: selected ? `2px solid ${opt.color}` : '2px solid #E5E7EB',
                      background: selected ? opt.bg : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      boxShadow: selected ? `0 0 0 4px ${opt.color}22` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        background: opt.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: opt.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: selected ? opt.color : 'var(--color-text)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {opt.desc}
                      </div>
                    </div>
                    {selected && (
                      <CheckCircle2 size={20} color={opt.color} />
                    )}
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="p-3 mt-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-block btn-lg mt-6"
              onClick={handleNext}
              disabled={!typeActivite}
            >
              Continuer <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── ÉTAPE 1 : Informations exploitation ── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 6 }}>
              Votre exploitation
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: '14px' }}>
              Quelques informations de base — vous pourrez tout compléter plus tard.
            </p>

            <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nom de votre exploitation</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.nomExploitation}
                  onChange={(e) => setForm({ ...form, nomExploitation: e.target.value })}
                  placeholder="ex: Ferme KOUDJO"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Localisation (région / commune)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.localisation}
                  onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                  placeholder="ex: Kpalimé, Région des Plateaux"
                />
              </div>

              {/* Superficie : uniquement si agriculture ou mixte */}
              {(typeActivite === 'agriculture' || typeActivite === 'mixte') && (
                <div className="form-group">
                  <label className="form-label">
                    <Ruler size={14} style={{ display: 'inline', marginRight: 4 }} />
                    Superficie totale (hectares) — optionnel
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    step="0.1"
                    min="0"
                    value={form.superficie}
                    onChange={(e) => setForm({ ...form, superficie: e.target.value })}
                    placeholder="ex: 5"
                  />
                </div>
              )}

              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 4 }}>
                💡 Tous les champs sont optionnels. Vous pouvez compléter votre profil à tout moment depuis « Mon exploitation ».
              </p>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(0)}
                  style={{ flex: 1 }}
                >
                  Retour
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Accéder à mon tableau de bord <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
