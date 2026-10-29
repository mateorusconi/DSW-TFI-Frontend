import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginPatientForm from "../components/LoginPatientForm.jsx";
import "./LoginPageStyle.css";

function LoginPatientPage() {
  function handleLogin(data) {
    console.log("Formato válido. Todavía no se llamó al backend.", {
      email: data.email,
    });
  }

  return (
    <AuthLayout className="login-page login-page--patient">
      <h1 className="login-page__title">MedPortal</h1>
      <h2 className="login-page__subtitle">Acceso al paciente</h2>
      <p className="login-page__help">
        Ingrese sus datos en los campos correspondientes para continuar
      </p>

      <LoginPatientForm onSubmit={handleLogin} />

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
