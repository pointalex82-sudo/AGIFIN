import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ color: 'white' }}>
              <div className="logo-icon">
                <Sprout size={22} />
              </div>
              <span>AgriFin</span>
            </Link>
            <p>
              La mémoire numérique de votre exploitation agricole et d’élevage.
              Enregistrez vos dépenses, vos recettes et vos campagnes pour piloter votre activité et préparer vos financements.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <div className="footer-links">
              <Link to="/">Accueil</Link>
              <Link to="/fonctionnalites">Fonctionnalités</Link>
              <Link to="/a-propos">À propos</Link>
              <Link to="/faq">Foire aux questions</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Solution */}
          <div>
            <h4 className="footer-heading">Solutions</h4>
            <div className="footer-links">
              <Link to="/inscription?role=exploitant">Pour les Agriculteurs</Link>
              <Link to="/inscription?role=exploitant">Pour les Éleveurs</Link>
              <Link to="/inscription?role=cooperative">Pour les Coopératives</Link>
              <Link to="/fonctionnalites#financement">Module Financement</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact & Support</h4>
            <div className="footer-links" style={{ gap: '0.75rem' }}>
              <span className="flex items-center gap-2 text-sm opacity-75">
                <MapPin size={16} /> Lomé & Tsévié, Togo
              </span>
              <span className="flex items-center gap-2 text-sm opacity-75">
                <Phone size={16} /> +228 90 00 00 00
              </span>
              <span className="flex items-center gap-2 text-sm opacity-75">
                <Mail size={16} /> contact@agrifin.tg
              </span>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgriFin. Tous droits réservés. Développé pour le développement agricole.</p>
          <div className="flex items-center gap-4 text-xs opacity-60">
            <span>Confidentialité</span>
            <span>Conditions d'utilisation</span>
            <span>Sécurité des données</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
