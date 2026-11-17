import { useForm } from "react-hook-form";
import Input from "../../shared/components/atoms/Input.jsx";
import { dniRules, emailRules } from "../validation/loginRules.js";
import "./LoginFormStyle.css";

function LoginPatientForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      dni: "",
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
        id="patient-email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Nombre@correo.com"
        required
        error={errors.email?.message ?? ""}
        {...register("email", emailRules)}
      />

      <Input
        id="patient-dni"
        label="DNI / Número de identificación"
        type="text"
        inputMode="numeric"
        placeholder="Número de documento"
        required
        error={errors.dni?.message ?? ""}
        {...register("dni", dniRules)}
      />

      <button className="login-form__submit" type="submit">
        Ingresar
      </button>
    </form>
  );
}

export default LoginPatientForm;
