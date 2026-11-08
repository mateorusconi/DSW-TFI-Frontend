import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../../shared/components/atoms/Input.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";

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
        {...register("name", {
          setValueAs: (value) => value.trim(),
          required: "El nombre es obligatorio.",
          minLength: {
            value: 3,
            message: "El nombre debe tener al menos 3 caracteres.",
          },
          maxLength: {
            value: 100,
            message: "El nombre no puede superar los 100 caracteres.",
          },
        })}
      />

      <div className="space-y-2">
        <label htmlFor="specialty-description" className="block text-sm">
          Descripción
        </label>

        <textarea
          id="specialty-description"
          rows={5}
          className="block w-full resize-y p-3"
          placeholder="Describí el alcance de la especialidad."
          required
          readOnly={isSubmitting}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "specialty-description-error" : undefined
          }
          {...register("description", {
            setValueAs: (value) => value.trim(),
            required: "La descripción es obligatoria.",
            minLength: {
              value: 10,
              message: "La descripción debe tener al menos 10 caracteres.",
            },
            maxLength: {
              value: 100,
              message: "La descripción no puede superar los 100 caracteres.",
            },
          })}
        />

        {errors.description && (
          <p
            id="specialty-description-error"
            className="text-sm text-red-700"
            role="alert"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      {errors.root?.server && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {errors.root.server.message}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Link
          to={cancelTo}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-sky-900 px-4 py-2 text-sm text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default SpecialtyForm;
