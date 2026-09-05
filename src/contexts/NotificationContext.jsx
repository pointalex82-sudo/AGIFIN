import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [notifications, setNotifications] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString(36)
    setNotifications(prev => [{ id, ...notification, read: false, date: new Date().toISOString() }, ...prev])
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      notifications,
      addNotification,
      markAsRead,
      unreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

export default NotificationContext
