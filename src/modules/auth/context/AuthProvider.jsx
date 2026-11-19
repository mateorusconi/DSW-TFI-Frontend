import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { clearSession, getSession, saveSession } from '../../shared/helpers/tokenStorage'

function AuthProvider({ children }) {
  // La API valida el JWT; el cliente solo restaura la sesión guardada.
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    const handleExpired = () => setSession(null)
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  const login = ({ token, role, email, dni }) => {
    saveSession({ token, role, email, dni })
    setSession({ token, role, email, dni })
  }

  const logout = () => {
    clearSession()
    setSession(null)
  }

  const value = {
    user: session,
    isAuthenticated: !!session,
    role: session?.role,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
