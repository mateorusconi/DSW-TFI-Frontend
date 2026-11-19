import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../hooks/useAuth.js";
import { loginPatient } from "../services/authService.js";
import AuthLayout from "../../shared/components/templates/AuthLayout.jsx";
import LoginPatientForm from "../components/LoginPatientForm.jsx";

function LoginPatientPage() {
  const { login } = useAuth();

  async function handleLogin({ email, dni }) {
    const { token, role } = await loginPatient({ email, dni });
    login({ token, role, email, dni: Number(dni) });
  }

  return (
    <AuthLayout>
      <h1 className="text-center text-[1.6rem] font-semibold tracking-tight text-[#001661]">MedPortal</h1>
      <h2 className="mt-1 mb-2 text-center text-[1.15rem] font-medium">Acceso al paciente</h2>
      <p className="my-2.5 text-center text-sm text-slate-700">
        Ingrese sus datos en los campos correspondientes para continuar
      </p>

      <LoginPatientForm onSubmit={handleLogin} />

      <Link to={PATHS.adminLogin} className="text-[0.8125rem] text-slate-800 hover:underline">
        ¿Sos administrador? Ingresá acá
      </Link>

      <div>
        <p className="text-[0.8125rem]">
          ¿No tiene una cuenta o tiene problemas para acceder?
        </p>
        <a className="text-[0.8125rem] text-slate-800 hover:underline" href="LinkSoporte">
          Contactar con soporte técnico
        </a>
      </div>
    </AuthLayout>
  );
}

export default LoginPatientPage;
