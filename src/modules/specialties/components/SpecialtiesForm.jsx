import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../shared/components/atoms/Button.jsx";
import Input from "../../shared/components/atoms/Input.jsx";
import Textarea from "../../shared/components/atoms/Textarea.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import {
  SPECIALTY_DESCRIPTION_RULES,
  SPECIALTY_NAME_RULES,
} from "../validation/specialtyFormRules.js";

const EMPTY_VALUES = {
  name: "",
  description: "",
};

function SpecialtyForm({
  onSubmit,
  cancelTo,
  submitLabel = "Guardar especialidad",
  initialValues = EMPTY_VALUES,
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });

  async function submitForm(data) {
    clearErrors();

    try {
      await onSubmit(data);
    } catch (error) {
      if (error?.errorCode === "SPECIALITY_NAME_CONFLICT") {
        setError(
          "name",
          {
            type: "server",
            message: "Ya existe una especialidad con ese nombre.",
          },
          { shouldFocus: true },
        );

        return;
      }

      const hasFieldErrors = applyFieldErrors(error, setError, [
        "name",
        "description",
      ]);

      if (!hasFieldErrors) {
        setError("root.server", {
          type: "server",
          message: getErrorMessage(error),
        });
      }
    }
  }

  return (
    <form
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
      onSubmit={handleSubmit(submitForm)}
      aria-busy={isSubmitting}
      noValidate
    >
      <Input
        id="specialty-name"
        label="Nombre de la especialidad"
        placeholder="Ej.: Cardiología"
        required
        readOnly={isSubmitting}
        error={errors.name?.message ?? ""}
        {...register("name", SPECIALTY_NAME_RULES)}
      />

      <Textarea
        id="specialty-description"
        label="Descripción"
        rows={5}
        placeholder="Describí el alcance de la especialidad."
        required
        readOnly={isSubmitting}
        error={errors.description?.message ?? ""}
        {...register("description", SPECIALTY_DESCRIPTION_RULES)}
      />

      {errors.root?.server && (
        <Alert variant="error">{errors.root.server.message}</Alert>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Link
          to={cancelTo}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default SpecialtyForm;
