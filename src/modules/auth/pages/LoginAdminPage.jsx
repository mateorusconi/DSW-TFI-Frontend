import { ShieldPlus } from "lucide-react";
import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginAdminForm from "../components/LoginAdminForm.jsx";
import "./LoginPageStyle.css";

function LoginAdminPage() {
  function handleLogin(data) {
    console.log("Formato válido. Todavía no se llamó al backend.", {
      email: data.email,
    });
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
        Porfavor,autentiquense para acceder al portal de proveedores.
      </p>

      <LoginAdminForm onSubmit={handleLogin} />

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
