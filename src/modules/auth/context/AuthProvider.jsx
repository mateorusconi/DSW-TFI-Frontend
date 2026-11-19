import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { clearSession, getSession, saveSession } from '../../shared/helpers/tokenStorage'

// Lee el payload del JWT (la parte del medio, JSON en base64url) sin librerías.
// No valida la firma (eso lo hace el back): solo evita mostrar logueado un token vencido o roto.
function isTokenExpired(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return typeof exp !== 'number' || exp * 1000 <= Date.now() // exp viene en segundos
  } catch {
    return true // token mal formado = inválido
  }
}

function getInitialSession() {
  const session = getSession()
  if (session && isTokenExpired(session.token)) {
    clearSession()
    return null
  }
  return session
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(getInitialSession)

  useEffect(() => {
    const handleExpired = () => setSession(null)
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  const login = ({ token, role, email, dni }) => {
    saveSession({ token, role, email, dni }) // si token o rol son inválidos, tira error y no sigue
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