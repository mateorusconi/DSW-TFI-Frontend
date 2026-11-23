import { ArrowRight } from "lucide-react";
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
    <AuthLayout
      below={
        <Link to={PATHS.adminLogin} className="inline-flex items-center gap-1.5 hover:text-white hover:underline">
          ¿Es personal administrativo o médico? Ingrese aquí
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      }
    >
      <h1 className="text-2xl font-bold tracking-tight text-primary-700">Portal del Paciente</h1>
      <p className="mt-2 mb-6 text-sm text-slate-600">
        Inicia sesión para reservar y consultar tus turnos médicos
      </p>

      <LoginPatientForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}

export default LoginPatientPage;
