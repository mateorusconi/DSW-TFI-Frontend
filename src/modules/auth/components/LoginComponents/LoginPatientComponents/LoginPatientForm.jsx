import { useForm } from "react-hook-form";
import Input from "../../../../shared/components/atoms/Input.jsx";
import "./LoginPatientFormStyle.css";

function LoginForm() {
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

  function onSubmit(data) {
    console.log("Formato válido. Todavía no se llamó al backend.", {
      email: data.email,
    });
  }

  return (
    <form
      className="FormularioInicioSesion"
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
        {...register("email", {
          required: "El email es obligatorio.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Ingresá un email válido.",
          },
        })}
      />

      <Input
        id="patient-dni"
        label="DNI / Número de identificación"
        type="text"
        inputMode="numeric"
        placeholder="Número de documento"
        required
        error={errors.dni?.message ?? ""}
        {...register("dni", {
          required: "El DNI es obligatorio.",
          pattern: {
            value: /^[1-9][0-9]{6,7}$/,
            message:
              "Ingresá un DNI de 7 u 8 dígitos, sin puntos ni espacios y sin cero inicial.",
          },
        })}
      />

      <button className="BotonIngresar" type="submit">
        Ingresar
      </button>
    </form>
  );
}

export default LoginForm;
