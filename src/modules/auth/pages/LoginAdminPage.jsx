import { ShieldPlus } from "lucide-react";
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
      brand={
        <div className="mb-6 flex flex-col items-center gap-px">
          <div className="flex h-14 w-12 items-center justify-center rounded-lg bg-white text-[#001661]">
            <ShieldPlus size={38} aria-hidden="true" />
          </div>
          <h2 className="text-2xl text-white">MedPortal</h2>
        </div>
      }
    >
      <h1 className="text-[1.2rem] font-semibold tracking-tight text-[#001661]">Bienvenido de nuevo</h1>
      <p className="mb-2.5 text-sm text-slate-700">
        Por favor, autenticáte para acceder al portal.
      </p>

      <LoginAdminForm onSubmit={handleLogin} />

      <Link to={PATHS.patientLogin} className="text-[0.8125rem] text-slate-800 hover:underline">
        ¿Sos paciente? Ingresá acá
      </Link>

      <div>
        <p className="text-[0.8125rem]">
          <strong>🛡 Solo acceso seguro:</strong> Este sistema es para personal médico
          autorizado. Los intentos de acceso no autorizados son registrados y
          monitoreados para su cumplimiento.
        </p>
      </div>
    </AuthLayout>
  );
}

export default LoginAdminPage;
