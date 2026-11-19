import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { homeFor } from '../helpers/homeFor'

// Solo para quien NO está logueado (los logins). Si ya hay sesión, va a su inicio.
function GuestRoute() {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={homeFor(role)} replace />
  }

  return <Outlet />
}

export default GuestRoute