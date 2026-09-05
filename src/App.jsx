import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider, useNotification } from './contexts/NotificationContext'
import DashboardLayout from './components/layout/DashboardLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import FeaturesPage from './pages/public/FeaturesPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import FAQPage from './pages/public/FAQPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Farmer Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import ExploitationPage from './pages/dashboard/ExploitationPage'
import ParcellesPage from './pages/dashboard/ParcellesPage'
import CampagnesPage from './pages/dashboard/CampagnesPage'
import CyclesElevagePage from './pages/dashboard/CyclesElevagePage'
import DepensesPage from './pages/dashboard/DepensesPage'
import RecettesPage from './pages/dashboard/RecettesPage'
import ProductionPage from './pages/dashboard/ProductionPage'
import RentabilitePage from './pages/dashboard/RentabilitePage'
import HistoriquePage from './pages/dashboard/HistoriquePage'
import DocumentsPage from './pages/dashboard/DocumentsPage'
import FinancementPage from './pages/dashboard/FinancementPage'
import ProfilPage from './pages/dashboard/ProfilPage'
import ParametresPage from './pages/dashboard/ParametresPage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import AutorisationsPage from './pages/dashboard/AutorisationsPage'

// Cooperative Pages
import CoopDashboard from './pages/cooperative/CoopDashboard'
import MembresPage from './pages/cooperative/MembresPage'
import CampagnesCollectives from './pages/cooperative/CampagnesCollectives'
import BesoinsIntrants from './pages/cooperative/BesoinsIntrants'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="p-8 text-center"><div className="spinner mx-auto" /></div>
  if (!isAuthenticated) return <Navigate to="/connexion" replace />
  return <DashboardLayout>{children}</DashboardLayout>
}

function ToastContainer() {
  const { toasts, removeToast } = useNotification()
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/fonctionnalites" element={<FeaturesPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />

          {/* Farmer Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/exploitation" element={<ProtectedRoute><ExploitationPage /></ProtectedRoute>} />
          <Route path="/dashboard/parcelles" element={<ProtectedRoute><ParcellesPage /></ProtectedRoute>} />
          <Route path="/dashboard/campagnes" element={<ProtectedRoute><CampagnesPage /></ProtectedRoute>} />
          <Route path="/dashboard/cycles-elevage" element={<ProtectedRoute><CyclesElevagePage /></ProtectedRoute>} />
          <Route path="/dashboard/depenses" element={<ProtectedRoute><DepensesPage /></ProtectedRoute>} />
          <Route path="/dashboard/recettes" element={<ProtectedRoute><RecettesPage /></ProtectedRoute>} />
          <Route path="/dashboard/production" element={<ProtectedRoute><ProductionPage /></ProtectedRoute>} />
          <Route path="/dashboard/rentabilite" element={<ProtectedRoute><RentabilitePage /></ProtectedRoute>} />
          <Route path="/dashboard/historique" element={<ProtectedRoute><HistoriquePage /></ProtectedRoute>} />
          <Route path="/dashboard/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/dashboard/financement" element={<ProtectedRoute><FinancementPage /></ProtectedRoute>} />
          <Route path="/dashboard/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
          <Route path="/dashboard/parametres" element={<ProtectedRoute><ParametresPage /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/dashboard/autorisations" element={<ProtectedRoute><AutorisationsPage /></ProtectedRoute>} />

          {/* Cooperative Protected Routes */}
          <Route path="/cooperative/dashboard" element={<ProtectedRoute><CoopDashboard /></ProtectedRoute>} />
          <Route path="/cooperative/membres" element={<ProtectedRoute><MembresPage /></ProtectedRoute>} />
          <Route path="/cooperative/campagnes" element={<ProtectedRoute><CampagnesCollectives /></ProtectedRoute>} />
          <Route path="/cooperative/intrants" element={<ProtectedRoute><BesoinsIntrants /></ProtectedRoute>} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}
