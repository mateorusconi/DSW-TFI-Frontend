import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../hooks/useAuth.js";
import { loginPatient } from "../services/authService.js";
import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginPatientForm from "../components/LoginPatientForm.jsx";
import "./LoginPageStyle.css";

function LoginPatientPage() {
  const { login } = useAuth();

  async function handleLogin({ email, dni }) {
    const { token, role } = await loginPatient({ email, dni });
    login({ token, role, email, dni: Number(dni) });
  }

  return (
    <AuthLayout className="login-page login-page--patient">
      <h1 className="login-page__title">MedPortal</h1>
      <h2 className="login-page__subtitle">Acceso al paciente</h2>
      <p className="login-page__help">
        Ingrese sus datos en los campos correspondientes para continuar
      </p>

      <LoginPatientForm onSubmit={handleLogin} />

      <Link to={PATHS.adminLogin} className="login-page__support-link">
        ¿Sos administrador? Ingresá acá
      </Link>

      <div>
        <p className="login-page__support-text">
          ¿No tiene una cuenta o tiene problemas para acceder?
        </p>
        <a className="login-page__support-link" href="LinkSoporte">
          Contactar con soporte técnico
        </a>
      </div>
    </AuthLayout>
  );
}

export default LoginPatientPage;
