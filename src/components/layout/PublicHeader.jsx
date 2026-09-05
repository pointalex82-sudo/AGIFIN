import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, ArrowRight, UserCheck } from 'lucide-react'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/fonctionnalites', label: 'Fonctionnalités' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <header className="public-header">
      <div className="container">
        <div className="public-header-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Sprout size={22} />
            </div>
            <span>AgriFin</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <Link to="/connexion" className="btn btn-ghost btn-sm">
              Connexion
            </Link>
            <Link to="/inscription" className="btn btn-primary btn-sm">
              Commencer <ArrowRight size={16} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/connexion"
              className="btn btn-outline btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="btn btn-primary btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
