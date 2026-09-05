import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Sprout, UserPlus, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'exploitant'

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    role: initialRole,
    localisation: 'Togo',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const res = register(formData)
    if (res.success) {
      if (formData.role === 'cooperative') {
        navigate('/cooperative/dashboard')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Sprout size={24} />
            </div>
            <span className="text-primary text-2xl font-bold">AgriFin</span>
          </Link>
          <h2 className="auth-title mt-4">Créer un compte</h2>
          <p className="auth-subtitle">Commencez la numérisation de votre exploitation</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Choice */}
          <div className="form-group">
            <label className="form-label">Vous êtes :</label>
            <div className="grid-2 gap-2">
              <button
                type="button"
                className={`btn btn-sm ${formData.role === 'exploitant' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFormData({ ...formData, role: 'exploitant' })}
              >
                Exploitant (Agriculteur/Éleveur)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${formData.role === 'cooperative' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFormData({ ...formData, role: 'cooperative' })}
              >
                Coopérative / OP
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="ex: Kofi"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="ex: KOUDJO"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone WhatsApp</label>
            <input
              type="tel"
              className="form-input"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="ex: +228 90 12 34 56"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adresse Email</label>
            <input
              type="email"
              className="form-input"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Au moins 6 caractères"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-6">
            Créer mon compte <UserPlus size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}
