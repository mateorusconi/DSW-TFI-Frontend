import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../hooks/useAuth.js";
import { loginAdmin } from "../services/authService.js";
import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginAdminForm from "../components/LoginAdminForm.jsx";

function LoginAdminPage() {
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    const { token, role } = await loginAdmin({ email, password });
    login({ token, role, email });
  }

  return (
    <AuthLayout
      footer={
        <p className="flex gap-3 text-sm leading-6 text-slate-600">
          <ShieldCheck
            size={22}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-primary-600"
          />
          <span>
            <strong className="text-slate-800">Solo Acceso Seguro:</strong> Este
            sistema es para personal médico autorizado. Los intentos de acceso
            no autorizados son registrados y monitoreados para su cumplimiento.
          </span>
        </p>
      }
      below={
        <Link
          to={PATHS.patientLogin}
          className="inline-flex items-center gap-1.5 hover:text-white hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al Portal de Pacientes
        </Link>
      }
    >
      <h1 className="text-2xl font-bold tracking-tight text-primary-700">
        Bienvenido de nuevo
      </h1>
      <p className="mt-2 mb-6 text-sm text-slate-600">
        Por favor, autentíquese para acceder al portal.
      </p>

      <LoginAdminForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}

export default LoginAdminPage;
