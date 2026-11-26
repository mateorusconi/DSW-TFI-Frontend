import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homeFor } from "../helpers/homeFor";
import { PATHS } from "../../../router/paths";
import { ROLES } from "../../shared/constants/roles";

// Guardián de rutas: deja pasar solo si hay sesión y el rol está en allowedRoles.
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Sin sesión → al login que corresponde, recordando a dónde quería ir
  if (!isAuthenticated) {
    const loginPath = allowedRoles.includes(ROLES.ADMIN)
      ? PATHS.adminLogin
      : PATHS.patientLogin;
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Sesión con un rol que no está en la lista → a su propia pantalla de inicio
  if (!allowedRoles.includes(role)) {
    return <Navigate to={homeFor(role)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
