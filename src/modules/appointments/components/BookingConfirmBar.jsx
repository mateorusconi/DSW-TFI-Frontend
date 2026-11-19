import { useForm, useWatch } from "react-hook-form";
import { CheckCircle } from "lucide-react";
import Button from "../../shared/components/atoms/Button.jsx";
import Textarea from "../../shared/components/atoms/Textarea.jsx";
import { applyFieldErrors } from "../../shared/helpers/applyFieldErrors.js";
import { formatLongDate } from "../../shared/helpers/dates.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";

const REASON_MAX = 300;

const reasonRules = {
  required: "Contanos el motivo de la consulta.",
  validate: (value) =>
    value.trim().length >= 5 || "El motivo debe tener al menos 5 caracteres.",
  maxLength: {
    value: REASON_MAX,
    message: `El motivo puede tener hasta ${REASON_MAX} caracteres.`,
  },
};

function BookingConfirmBar({ slot, doctor, onConfirm, onCancel }) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reason: "" } });

  const reason = useWatch({ control, name: "reason" });

  async function submit(data) {
    try {
      await onConfirm(data.reason.trim());
    } catch (error) {
      if (!applyFieldErrors(error, setError, ["reason"])) {
        setError("root.server", { message: getErrorMessage(error) });
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="mt-6 space-y-4 rounded-lg border border-teal-200 bg-teal-50 p-4"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Turno seleccionado
        </p>
        <p className="text-lg font-semibold text-slate-900 first-letter:uppercase">
          {formatLongDate(slot.date)}, {slot.startTime} hs
        </p>
        <p className="text-sm text-slate-600">
          {doctor.name}
          {doctor.specialty?.name && ` · ${doctor.specialty.name}`}
        </p>
      </div>

      <Textarea
        id="booking-reason"
        label="Motivo de la consulta"
        maxLength={REASON_MAX}
        currentLength={reason?.length ?? 0}
        error={errors.reason?.message ?? ""}
        {...register("reason", reasonRules)}
      />

      {errors.root?.server && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.server.message}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cambiar horario
        </Button>
        <Button type="submit" icon={CheckCircle} loading={isSubmitting}>
          Confirmar turno
        </Button>
      </div>
    </form>
  );
}

export default BookingConfirmBar;
