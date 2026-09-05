import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
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
  Plus,
  Users,
  ShieldCheck,
  ChevronDown
} from 'lucide-react'
import QuickActions from '../ui/QuickActions'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const isCoop = user?.role === 'cooperative'

  const exploitantNav = [
    {
      group: 'VUE D’ENSEMBLE',
      items: [
        { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { path: '/dashboard/exploitation', label: 'Mon exploitation', icon: Home },
      ]
    },
    {
      group: 'GESTION OPÉRATIONNELLE',
      items: [
        { path: '/dashboard/parcelles', label: 'Mes parcelles', icon: Map },
        { path: '/dashboard/campagnes', label: 'Mes campagnes', icon: Calendar },
        { path: '/dashboard/cycles-elevage', label: 'Cycles d’élevage', icon: Bird },
        { path: '/dashboard/production', label: 'Ma production', icon: Package },
      ]
    },
    {
      group: 'FINANCES & COMPTES',
      items: [
        { path: '/dashboard/depenses', label: 'Mes dépenses', icon: ArrowDownCircle },
        { path: '/dashboard/recettes', label: 'Mes recettes', icon: ArrowUpCircle },
        { path: '/dashboard/rentabilite', label: 'Analyse & Rentabilité', icon: TrendingUp },
        { path: '/dashboard/historique', label: 'Historique', icon: History },
      ]
    },
    {
      group: 'FINANCEMENT & DOCS',
      items: [
        { path: '/dashboard/documents', label: 'Mes documents', icon: FileText },
        { path: '/dashboard/financement', label: 'Financement', icon: Landmark },
        { path: '/dashboard/autorisations', label: 'Partages & Autorisations', icon: ShieldCheck },
      ]
    }
  ]

  const coopNav = [
    {
      group: 'ESPACE COOPÉRATIVE',
      items: [
        { path: '/cooperative/dashboard', label: 'Tableau de bord coop', icon: LayoutDashboard },
        { path: '/cooperative/membres', label: 'Gestion des membres', icon: Users },
        { path: '/cooperative/campagnes', label: 'Campagnes collectives', icon: Calendar },
        { path: '/cooperative/intrants', label: 'Besoins en intrants', icon: Package },
      ]
    }
  ]

  const currentNav = isCoop ? coopNav : exploitantNav

  const handleLogout = () => {
    logout()
    navigate('/connexion')
  }

  const isActive = (path) => location.pathname === path

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
          <Link
            to="/dashboard/profil"
            className={`sidebar-link ${isActive('/dashboard/profil') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <User size={20} />
            <span>Mon Profil</span>
          </Link>
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
              {user?.prenom} {user?.nom} {user?.commune ? `• ${user.commune}` : ''}
            </p>
          </div>
        </div>

        <div className="dashboard-header-right">
          {/* Notifications Button */}
          <Link to="/dashboard/notifications" className="btn btn-ghost btn-icon relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="dropdown">
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
                  <span className="badge badge-primary mt-2">
                    {user?.role === 'cooperative' ? 'Coopérative' : 'Exploitant'}
                  </span>
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

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link
          to={isCoop ? '/cooperative/dashboard' : '/dashboard'}
          className={`mobile-nav-item ${isActive('/dashboard') || isActive('/cooperative/dashboard') ? 'active' : ''}`}
        >
          <LayoutDashboard />
          <span>Accueil</span>
        </Link>
        <Link
          to="/dashboard/campagnes"
          className={`mobile-nav-item ${isActive('/dashboard/campagnes') ? 'active' : ''}`}
        >
          <Calendar />
          <span>Campagnes</span>
        </Link>
        <Link
          to="/dashboard/depenses"
          className={`mobile-nav-item ${isActive('/dashboard/depenses') ? 'active' : ''}`}
        >
          <ArrowDownCircle />
          <span>Dépenses</span>
        </Link>
        <Link
          to="/dashboard/recettes"
          className={`mobile-nav-item ${isActive('/dashboard/recettes') ? 'active' : ''}`}
        >
          <ArrowUpCircle />
          <span>Recettes</span>
        </Link>
        <Link
          to="/dashboard/documents"
          className={`mobile-nav-item ${isActive('/dashboard/documents') ? 'active' : ''}`}
        >
          <FileText />
          <span>Docs</span>
        </Link>
      </nav>

      {/* Quick Action Floating Action Button (FAB) */}
      {!isCoop && <QuickActions />}
    </div>
  )
}
