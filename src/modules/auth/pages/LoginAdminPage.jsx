import { ShieldPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../hooks/useAuth.js";
import { loginAdmin } from "../services/authService.js";
import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginAdminForm from "../components/LoginAdminForm.jsx";
import "./LoginPageStyle.css";

function LoginAdminPage() {
  const { login } = useAuth();

  async function handleLogin({ email, password }) {
    const { token, role } = await loginAdmin({ email, password });
    login({ token, role, email });
  }

  return (
    <AuthLayout
      className="login-page login-page--admin"
      brand={
        <div className="login-page__brand">
          <div className="login-page__brand-icon">
            <ShieldPlus size={38} aria-hidden="true" />
          </div>
          <h2 className="login-page__brand-title">MedPortal</h2>
        </div>
      }
    >
      <h1 className="login-page__title">Bienvenido de nuevo</h1>
      <p className="login-page__help">
        Por favor, autenticáte para acceder al portal.
      </p>

      <LoginAdminForm onSubmit={handleLogin} />

      <Link to={PATHS.patientLogin} className="login-page__support-link">
        ¿Sos paciente? Ingresá acá
      </Link>

      <div>
        <p className="login-page__support-text">
          <strong>🛡 Solo acceso seguro:</strong> Este sistema es para personal médico
          autorizado.Los intentos de acceso no autorizados son registrados y
          monitoreados para su cumplimiento.
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginAdminPage;
