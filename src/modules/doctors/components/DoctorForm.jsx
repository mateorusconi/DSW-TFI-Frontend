import { IdCard, Save, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../../shared/components/atoms/Button.jsx";
import Input from "../../shared/components/atoms/Input.jsx";
import Select from "../../shared/components/atoms/Select.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";

const EMPTY_VALUES = {
  name: "",
  specialtyId: "",
  licenseNumber: "",
};

function DoctorForm({
  title,
  subtitle,
  onSubmit,
  onCancel,
  specialtyOptions,
  submitLabel = "Guardar Doctor",
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
      if (error?.errorCode === "DOCTOR_LICENSE_CONFLICT") {
        setError(
          "licenseNumber",
          {
            type: "server",
            message: "Ya existe un médico con esa matrícula.",
          },
          { shouldFocus: true },
        );

        return;
      }

      const hasFieldErrors = applyFieldErrors(error, setError, [
        "name",
        "specialtyId",
        "licenseNumber",
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
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      onSubmit={handleSubmit(submitForm)}
      aria-busy={isSubmitting}
      noValidate
    >
      {/* Encabezado dentro de la tarjeta, con ícono, como en el mockup */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h1 className="flex items-center gap-3 text-xl font-semibold text-primary-700">
          <UserPlus size={22} aria-hidden="true" />
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="space-y-5 p-6">
        <Input
          id="doctor-name"
          label="Nombre Completo del Doctor"
          placeholder="Ej.: Dr. Alejandro Martínez"
          icon={User}
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

        <div className="grid gap-5 md:grid-cols-2">
          <Select
            id="doctor-specialty"
            label="Especialidad"
            placeholder="Seleccione especialidad"
            options={specialtyOptions}
            error={errors.specialtyId?.message ?? ""}
            {...register("specialtyId", {
              required: "La especialidad es obligatoria.",
            })}
          />

          <Input
            id="doctor-license"
            label="Número de Licencia Médica"
            placeholder="MED-00000"
            icon={IdCard}
            readOnly={isSubmitting}
            error={errors.licenseNumber?.message ?? ""}
            {...register("licenseNumber", {
              setValueAs: (value) => value.trim(),
              required: "La matrícula es obligatoria.",
              minLength: {
                value: 3,
                message: "La matrícula debe tener al menos 3 caracteres.",
              },
              maxLength: {
                value: 20,
                message: "La matrícula no puede superar los 20 caracteres.",
              },
            })}
          />
        </div>

        {errors.root?.server && (
          <Alert variant="error">{errors.root.server.message}</Alert>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button type="submit" icon={Save} loading={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DoctorForm;