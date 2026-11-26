import { ArrowRight, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../../shared/components/atoms/Button.jsx";
import Input from "../../shared/components/atoms/Input.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { emailRules, passwordRules } from "../validation/loginRules.js";

function LoginAdminForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function submit(data) {
    try {
      await onSubmit(data);
    } catch (error) {
      if (applyFieldErrors(error, setError, ["email", "password"])) {
        return;
      }

      const message =
        error.status === 401
          ? "Email o contraseña incorrectos."
          : getErrorMessage(error);

      setError("root.server", { message });
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <Input
        id="admin-email"
        label="Correo Electrónico"
        type="email"
        icon={Mail}
        autoComplete="username"
        placeholder="admin@medportal.com"
        required
        error={errors.email?.message ?? ""}
        {...register("email", emailRules)}
      />

      <Input
        id="admin-password"
        label="Contraseña"
        type="password"
        icon={Lock}
        revealable
        autoComplete="current-password"
        placeholder="••••••••"
        required
        error={errors.password?.message ?? ""}
        {...register("password", passwordRules)}
      />

      {errors.root?.server && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.server.message}
        </p>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        className="min-h-12 text-base"
      >
        Iniciar Sesión
        <ArrowRight size={18} aria-hidden="true" />
      </Button>
    </form>
  );
}

export default LoginAdminForm;
