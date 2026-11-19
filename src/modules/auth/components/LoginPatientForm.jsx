import { useForm } from "react-hook-form";
import Button from "../../shared/components/atoms/Button.jsx";
import Input from "../../shared/components/atoms/Input.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { dniRules, emailRules } from "../validation/loginRules.js";

function LoginPatientForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      dni: "",
    },
    mode: "onSubmit",
  });

  async function submit(data) {
    try {
      await onSubmit(data);
    } catch (error) {
      if (applyFieldErrors(error, setError, ["email", "dni"])) {
        return;
      }

      setError("root.server", { message: getErrorMessage(error) });
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(submit)}
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

      {errors.root?.server && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.server.message}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="min-h-11">
        Ingresar
      </Button>
    </form>
  );
}

export default LoginPatientForm;
