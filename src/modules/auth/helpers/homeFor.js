import { PATHS } from '../../../router/paths'

// Pantalla de inicio de cada rol. La usan ProtectedRoute, GuestRoute y los logins.
export function homeFor(role) {
  return role === 'ADMINISTRADOR' ? PATHS.adminHome : PATHS.bookAppointment
}