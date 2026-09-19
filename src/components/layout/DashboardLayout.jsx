import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useActivite } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

import {
  Sprout,
  LayoutDashboard,
  Home,
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
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  ShieldCheck,
  ChevronDown,
  Leaf,
  Layers,
} from 'lucide-react'
import QuickActions from '../ui/QuickActions'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { isAgri, isElevage, typeActivite } = useActivite()
  const { unreadCount } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Ferme le dropdown en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userDropdownOpen])

  const isCoop = user?.role === 'cooperative'

  // Libellé du type d'activité pour affichage
  const activiteLabel = {
    agriculture: 'Agriculture',
    elevage: 'Élevage',
    mixte: 'Agri + Élevage',
  }[typeActivite] || 'Exploitant'

  const activiteIcon = typeActivite === 'agriculture' ? Leaf
    : typeActivite === 'elevage' ? Bird
    : typeActivite === 'mixte' ? Layers
    : Sprout

  // Navigation dynamique : masquer les sections non pertinentes au profil
  const buildExploitantNav = () => {
    const nav = [
      {
        group: "VUE D'ENSEMBLE",
        items: [
          { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { path: '/dashboard/exploitation', label: 'Mon exploitation', icon: Home },
        ],
      },
    ]

    // Section opérationnelle — filtrée selon l'activité
    const opsItems = []
    if (isAgri) {
      opsItems.push({ path: '/dashboard/parcelles', label: 'Mes parcelles', icon: Map })
      opsItems.push({ path: '/dashboard/campagnes', label: 'Mes campagnes', icon: Calendar })
    }
    if (isElevage) {
      opsItems.push({ path: '/dashboard/cycles-elevage', label: 'Cycles d\'élevage', icon: Bird })
    }
    opsItems.push({ path: '/dashboard/production', label: 'Ma production', icon: Package })

    nav.push({
      group: 'GESTION OPÉRATIONNELLE',
      items: opsItems,
    })

    nav.push({
      group: 'FINANCES & COMPTES',
      items: [
        { path: '/dashboard/depenses', label: 'Mes dépenses', icon: ArrowDownCircle },
        { path: '/dashboard/recettes', label: 'Mes recettes', icon: ArrowUpCircle },
        { path: '/dashboard/rentabilite', label: 'Résultats & Rentabilité', icon: TrendingUp },
        { path: '/dashboard/historique', label: 'Historique', icon: History },
      ],
    })

    nav.push({
      group: 'FINANCEMENT & DOCS',
      items: [
        { path: '/dashboard/documents', label: 'Mes documents', icon: FileText },
        { path: '/dashboard/financement', label: 'Financement', icon: Landmark },
        { path: '/dashboard/autorisations', label: 'Partages & Autorisations', icon: ShieldCheck },
      ],
    })

    return nav
  }

  const coopNav = [
    {
      group: 'ESPACE COOPÉRATIVE',
      items: [
        { path: '/cooperative/dashboard', label: 'Tableau de bord coop', icon: LayoutDashboard },
        { path: '/cooperative/membres', label: 'Gestion des membres', icon: Users },
        { path: '/cooperative/campagnes', label: 'Campagnes collectives', icon: Calendar },
        { path: '/cooperative/intrants', label: 'Besoins en intrants', icon: Package },
      ],
    },
  ]

  const currentNav = isCoop ? coopNav : buildExploitantNav()

  const handleLogout = () => {
    logout()
    navigate('/connexion')
  }

  const isActive = (path) => location.pathname === path

  // Mobile bottom nav adapté selon l'activité
  const mobileNavItems = [
    { path: isCoop ? '/cooperative/dashboard' : '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
    ...(isAgri && !isCoop ? [{ path: '/dashboard/campagnes', icon: Calendar, label: 'Campagnes' }] : []),
    ...(isElevage && !isCoop ? [{ path: '/dashboard/cycles-elevage', icon: Bird, label: 'Élevage' }] : []),
    { path: isCoop ? '/cooperative/dashboard' : '/dashboard/depenses', icon: ArrowDownCircle, label: 'Dépenses' },
    { path: isCoop ? '/cooperative/dashboard' : '/dashboard/recettes', icon: ArrowUpCircle, label: 'Recettes' },
    { path: '/dashboard/documents', icon: FileText, label: 'Docs' },
  ].slice(0, 5) // max 5 éléments dans la bottom nav

  const ActiviteIcon = activiteIcon

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to={isCoop ? '/cooperative/dashboard' : '/dashboard'} className="logo">
            <div className="logo-icon">
              <Sprout size={22} />
            </div>
            <span>AgriFin</span>
          </Link>
        </div>

        {/* Badge activité dans la sidebar (exploitants seulement) */}
        {!isCoop && typeActivite && (
          <div style={{
            margin: '0 12px 8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: typeActivite === 'agriculture' ? '#E8F5E9'
              : typeActivite === 'elevage' ? '#FFF3E0'
              : '#E3F2FD',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <ActiviteIcon size={14} color={
              typeActivite === 'agriculture' ? '#2E7D32'
              : typeActivite === 'elevage' ? '#E65100'
              : '#1565C0'
            } />
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: typeActivite === 'agriculture' ? '#2E7D32'
                : typeActivite === 'elevage' ? '#E65100'
                : '#1565C0',
            }}>
              {activiteLabel}
            </span>
          </div>
        )}

        <nav className="sidebar-nav">
          {currentNav.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <div className="sidebar-section-label">{section.group}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${active ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isCoop && (
            <Link
              to="/dashboard/profil"
              className={`sidebar-link ${isActive('/dashboard/profil') ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <User size={20} />
              <span>Mon Profil</span>
            </Link>
          )}
          <button className="sidebar-link text-danger" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Top Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <button
            className="btn btn-ghost btn-icon lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div>
            <h3 className="text-base font-semibold">
              {isCoop ? 'Espace Coopérative' : 'Mon Exploitation'}
            </h3>
            <p className="text-xs text-muted">
              {user?.prenom} {user?.nom} {user?.localisation ? `• ${user.localisation}` : ''}
            </p>
          </div>
        </div>

        <div className="dashboard-header-right">
          {/* Notifications Button — masqué pour les coops */}
          {!isCoop && (
            <Link to="/dashboard/notifications" className="btn btn-ghost btn-icon relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>
          )}

          {/* User Profile Dropdown */}
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 btn btn-ghost btn-sm"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="avatar avatar-sm">
                {(user?.prenom?.[0] || 'U') + (user?.nom?.[0] || '')}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.prenom}
              </span>
              <ChevronDown size={14} />
            </button>

            {userDropdownOpen && (
              <div className="dropdown-menu">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <span className="badge badge-primary">
                      {user?.role === 'cooperative' ? 'Coopérative' : 'Exploitant'}
                    </span>
                    {typeActivite && (
                      <span className="badge badge-neutral">{activiteLabel}</span>
                    )}
                  </div>
                </div>
                <Link
                  to="/dashboard/profil"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <User size={16} /> Profil
                </Link>
                <Link
                  to="/dashboard/parametres"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <Settings size={16} /> Paramètres
                </Link>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {children}
      </main>

      {/* Mobile Bottom Navigation — dynamique */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Action FAB */}
      {!isCoop && <QuickActions />}
    </div>
  )
}
