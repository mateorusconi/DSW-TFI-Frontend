import { Outlet } from 'react-router-dom'

// Provisorio (SCRUM-22): por ahora deja pasar a todos.
// En SCRUM-24 se completa: redirige según la sesión y el rol (con useAuth).
// eslint-disable-next-line no-unused-vars
function ProtectedRoute({ allowedRole }) {
  return <Outlet />
}

export default ProtectedRoute
