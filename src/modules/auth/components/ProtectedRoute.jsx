import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { homeFor } from '../helpers/homeFor'
import { PATHS } from '../../../router/paths'

function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  // Sin sesión → al login que corresponde, recordando a dónde quería ir
  if (!isAuthenticated) {
    const loginPath = allowedRole === 'ADMINISTRADOR' ? PATHS.adminLogin : PATHS.patientLogin
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  // Sesión de otro rol → a su propia pantalla de inicio
  if (role !== allowedRole) {
    return <Navigate to={homeFor(role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute