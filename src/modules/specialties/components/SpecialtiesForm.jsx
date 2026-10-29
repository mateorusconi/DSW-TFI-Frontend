import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../../shared/components/atoms/Input.jsx";

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
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  return (
    <form
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Input
        id="specialty-name"
        label="Nombre de la especialidad"
        placeholder="Ej.: Cardiología"
        required
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

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Link
          to={cancelTo}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          className="rounded-md bg-sky-900 px-4 py-2 text-sm text-white hover:bg-sky-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default SpecialtyForm;
