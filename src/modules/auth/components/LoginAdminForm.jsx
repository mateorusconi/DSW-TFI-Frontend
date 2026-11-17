import { useForm } from "react-hook-form";
import Input from "../../shared/components/atoms/Input.jsx";
import { emailRules, passwordRules } from "../validation/loginRules.js";
import "./LoginFormStyle.css";

function LoginAdminForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Input
        id="admin-email"
        label="Email"
        type="email"
        autoComplete="username"
        placeholder="Nombre@correo.com"
        required
        error={errors.email?.message ?? ""}
        {...register("email", emailRules)}
      />

      <Input
        id="admin-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="Contraseña"
        required
        error={errors.password?.message ?? ""}
        {...register("password", passwordRules)}
      />

      <button className="login-form__submit" type="submit">
        Ingresar
      </button>
    </form>
  );
}

export default LoginAdminForm;
