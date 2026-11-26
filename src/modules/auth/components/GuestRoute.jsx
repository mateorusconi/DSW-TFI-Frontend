import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homeFor } from "../helpers/homeFor";

// Solo para quien NO está logueado (los logins). Si ya hay sesión, lo manda a la página
// que quería ver antes del login (location.state.from) o, si no había ninguna, a su inicio.
function GuestRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate to={location.state?.from?.pathname ?? homeFor(role)} replace />
    );
  }

  return <Outlet />;
}

export default GuestRoute;
