import { useForm } from "react-hook-form";
import "./LoginAdminFormStyle.css";
import Input from "../../../../shared/components/Input.jsx";

function LoginForm() {
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
        id="admin-email"
        label="Email"
        type="email"
        autoComplete="username"
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
        id="admin-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="Contraseña"
        required
        error={errors.password?.message ?? ""}
        {...register("password", {
          required: "La contraseña es obligatoria.",
          minLength: {
            value: 8,
            message: "La contraseña debe tener al menos 8 caracteres.",
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
