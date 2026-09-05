import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { loadDemoData } from '../../data/demoData'
import { Sprout, LogIn, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const res = login(email, password)
    if (res.success) {
      navigate('/dashboard')
    } else {
      setError(res.error)
    }
  }

  const handleDemoExploitant = () => {
    loadDemoData()
    login('demo@agrifin.tg', 'demo1234')
    navigate('/dashboard')
  }

  const handleDemoCoop = () => {
    loadDemoData()
    login('coop@agrifin.tg', 'coop1234')
    navigate('/cooperative/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Sprout size={24} />
            </div>
            <span className="text-primary text-2xl font-bold">AgriFin</span>
          </Link>
          <h2 className="auth-title mt-4">Connexion</h2>
          <p className="auth-subtitle">Accédez à votre espace exploitation ou coopérative</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adresse Email</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: kofi@gmail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-6">
            Se connecter <LogIn size={18} />
          </button>
        </form>

        <div className="auth-divider">OU TESTER AVEC DÉMO</div>

        <div className="space-y-2">
          <button
            type="button"
            className="btn btn-outline btn-block btn-sm flex items-center justify-between"
            onClick={handleDemoExploitant}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-600" />
              Démo Exploitant Agricole
            </span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className="btn btn-outline btn-block btn-sm flex items-center justify-between"
            onClick={handleDemoCoop}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-600" />
              Démo Coopérative
            </span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="auth-footer">
          Vous n'avez pas encore de compte ?{' '}
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}
