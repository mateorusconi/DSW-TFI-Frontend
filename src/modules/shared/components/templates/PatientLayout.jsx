import { Outlet, useNavigate } from "react-router-dom";
import PatientNavbar from "../organisms/PatientNavbar";
import { useAuth } from "../../../auth/hooks/useAuth";
import { PATHS } from "../../../../router/paths";

/**
 * Template: PatientLayout (marco de las pantallas del paciente)
 * Conceptos aplicados:
 * - Atomic Design: template, define la estructura (navbar arriba, contenido centrado), no el contenido.
 * - React Router: <Outlet /> es el hueco donde se dibuja la página de /paciente/*.
 * - Tailwind: contenido centrado con max-w-5xl mx-auto.
 * - HTML semántico: <main> para el contenido.
 */
function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PATHS.patientLogin, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PatientNavbar email={user?.email} onLogout={handleLogout} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
