import LoginForm from "../components/LoginAdminForm.jsx";
import "./LoginAdminPageStyle.css";
import { ShieldPlus } from "lucide-react";
import Card from "../../shared/components/atoms/Card.jsx";
function LoginPage() {
  return (
    <main className="PaginaInicioSesion">
      <div className="MarcaMedPortal">
        <div className="IconoMedPortal">
          <ShieldPlus size={38} aria-hidden="true" />
        </div>

        <h2 className="TituloPrincipal">MedPortal</h2>
      </div>
     <Card className="AdminLoginCard">
        <h1 className="TituloConsultorioAdmin">Bienvenido de nuevo</h1>
        <p className="TextoAyuda">
          Porfavor,autentiquense para acceder al portal de proveedores.{" "}
        </p>
        <LoginForm />
        <div className="SoporteAcceso">
          <p className="TextoSoporte">
            <strong>🛡 Solo acceso seguro:</strong> Este sistema es para personal médico
            autorizado.Los intentos de acceso no autorizados son registrados y
            monitoreados para su cumplimiento.
          </p>
        </div>
    </Card>
    </main>
  );
}

export default LoginPage;
