import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useActivite } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import OfflineSyncService from '../../services/OfflineSyncService'

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
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react'
import QuickActions from '../ui/QuickActions'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { isAgri, isElevage, typeActivite } = useActivite()
  const { unreadCount, addToast } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // État Réseau & Synchronisation Offline
  const [networkState, setNetworkState] = useState({
    isOnline: OfflineSyncService.isOnline(),
    pendingCount: OfflineSyncService.getQueue().length
  })

  useEffect(() => {
    const unsubscribe = OfflineSyncService.subscribe(({ isOnline, pendingCount }) => {
      setNetworkState(prev => {
        // Détecte la reconnexion automatique
        if (!prev.isOnline && isOnline && pendingCount > 0) {
          OfflineSyncService.syncPendingOperations((count) => {
            addToast(`Connexion rétablie : ${count} opération(s) hors-ligne synchronisée(s) !`, 'success')
          })
        }
        return { isOnline, pendingCount }
      })
    })
    return () => unsubscribe()
  }, [addToast])

  const handleManualSync = async () => {
    if (!networkState.isOnline) {
      addToast('Vous êtes actuellement en mode hors-ligne.', 'warning')
      return
    }
    const res = await OfflineSyncService.syncPendingOperations((count) => {
      addToast(`${count} opération(s) synchronisée(s) avec succès !`, 'success')
    })
    if (res.syncedCount === 0) {
      addToast('Toutes vos données sont déjà synchronisées.', 'info')
    }
  }

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

  const activiteLabel = {
    agriculture: 'Agriculture',
    elevage: 'Élevage',
    mixte: 'Agri + Élevage',
  }[typeActivite] || 'Exploitant'

  const activiteIcon = typeActivite === 'agriculture' ? Leaf
    : typeActivite === 'elevage' ? Bird
    : typeActivite === 'mixte' ? Layers
    : Sprout

  // Navigation dynamique
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
      group: 'COMPTABILITÉ PAR ATELIER',
      items: [
        { path: '/dashboard/depenses', label: 'Dépenses d\'Atelier', icon: ArrowDownCircle },
        { path: '/dashboard/recettes', label: 'Recettes d\'Atelier', icon: ArrowUpCircle },
        { path: '/dashboard/historique', label: 'Historique des flux', icon: History },
        { path: '/dashboard/rentabilite', label: 'Marge par Atelier', icon: TrendingUp },
      ],
    })

    nav.push({
      group: 'FINANCEMENT & DOSSIER',
      items: [
        { path: '/dashboard/compte-exploitation', label: 'Compte exploitation', icon: FileText },
        { path: '/dashboard/demande-credit', label: 'Demande de crédit', icon: Landmark },
      ],
    })

    return nav
  }

  const buildCoopNav = () => [
    {
      group: 'GESTION COOPÉRATIVE',
      items: [
        { path: '/cooperative/dashboard', label: 'Tableau de bord coop', icon: LayoutDashboard },
        { path: '/cooperative/membres', label: 'Gestion des membres', icon: Users },
        { path: '/cooperative/campagnes', label: 'Campagnes collectives', icon: Calendar },
        { path: '/cooperative/intrants', label: 'Besoins en intrants', icon: Package },
      ],
    },
  ]

  const currentNav = isCoop ? buildCoopNav() : buildExploitantNav()

  const mobileNavItems = isCoop ? [
    { path: '/cooperative/dashboard', icon: LayoutDashboard, label: 'Accueil' },
    { path: '/cooperative/membres', icon: Users, label: 'Membres' },
    { path: '/cooperative/campagnes', icon: Calendar, label: 'Campagnes' },
    { path: '/cooperative/intrants', icon: Package, label: 'Intrants' },
  ] : [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
    { path: '/dashboard/depenses', icon: ArrowDownCircle, label: 'Dépenses' },
    { path: '/dashboard/recettes', icon: ArrowUpCircle, label: 'Recettes' },
    { path: '/dashboard/rentabilite', icon: TrendingUp, label: 'Ateliers' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/connexion')
  }

  const ActiviteBadgeIcon = activiteIcon

  return (
    <div className="dashboard-layout">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Sprout size={22} />
            </div>
            <span className="logo-text">AgriFin</span>
          </Link>
          <button
            className="btn btn-ghost btn-icon lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {!isCoop && (
          <div className="px-4 py-2 my-2 mx-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActiviteBadgeIcon size={16} className="text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">{activiteLabel}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Profil Actif
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

        <div className="dashboard-header-right flex items-center gap-2">
          {/* BADGE RESEAU OFFLINE-FIRST (DEMANDE UTILISATEUR) */}
          <div 
            onClick={handleManualSync}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              networkState.isOnline 
                ? networkState.pendingCount > 0 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-orange-100 text-orange-900 border-orange-400 animate-pulse'
            }`}
            title="Cliquez pour forcer la synchronisation"
          >
            {networkState.isOnline ? (
              <>
                <Wifi size={13} className="text-emerald-600" />
                <span className="hidden sm:inline">En Ligne</span>
                {networkState.pendingCount > 0 && (
                  <span className="badge badge-warning text-[10px] px-1.5 py-0">
                    {networkState.pendingCount} synchro...
                  </span>
                )}
              </>
            ) : (
              <>
                <WifiOff size={13} className="text-orange-600" />
                <span>Hors-Ligne</span>
                <span className="badge badge-warning text-[10px] px-1.5 py-0">
                  {networkState.pendingCount} en attente
                </span>
              </>
            )}
          </div>

          {/* Notifications Button */}
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
      <main className="dashboard-main pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation — ergonomie terrain tactile */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={20} />
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
