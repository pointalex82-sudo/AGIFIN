import { createContext, useContext, useReducer, useEffect } from 'react'
import DataService from '../services/DataService'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false }
    case 'LOGOUT':
      return { ...initialState, loading: false }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    case 'LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const sessionUserId = localStorage.getItem('agrifin_session')
    if (sessionUserId) {
      const user = DataService.read('users', sessionUserId)
      if (user) {
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        localStorage.removeItem('agrifin_session')
        dispatch({ type: 'LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'LOADING', payload: false })
    }
  }, [])

  const login = (email, password) => {
    const users = DataService.list('users')
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('agrifin_session', user.id)
      dispatch({ type: 'SET_USER', payload: user })
      return { success: true }
    }
    return { success: false, error: 'Email ou mot de passe incorrect' }
  }

  const register = (userData) => {
    const users = DataService.list('users')
    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    const user = DataService.create('users', {
      ...userData,
      role: userData.role || 'exploitant',
    })
    // Créer une exploitation par défaut
    DataService.create('exploitations', {
      userId: user.id,
      nom: `Exploitation de ${userData.prenom || userData.nom || ''}`.trim(),
      typeActivite: '',
      localisation: '',
      superficie: '',
      cultures: '',
      elevage: '',
    })
    localStorage.setItem('agrifin_session', user.id)
    dispatch({ type: 'SET_USER', payload: user })
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('agrifin_session')
    dispatch({ type: 'LOGOUT' })
  }

  const updateProfile = (data) => {
    if (state.user) {
      const updated = DataService.update('users', state.user.id, data)
      dispatch({ type: 'UPDATE_USER', payload: data })
      return updated
    }
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
