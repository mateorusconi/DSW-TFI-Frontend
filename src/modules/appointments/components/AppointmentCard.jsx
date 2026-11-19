import { XCircle } from "lucide-react";
import Button from "../../shared/components/atoms/Button.jsx";
import StatusBadge from "../../shared/components/atoms/StatusBadge.jsx";
import { formatLongDate, formatTime } from "../../shared/helpers/dates.js";

function AppointmentCard({ appointment, onCancel }) {
  const { scheduledAt, doctorName, specialtyName, reason, status } = appointment;
  const canCancel = status === "BOOKED";

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-900 first-letter:uppercase">
            {formatLongDate(scheduledAt)}, {formatTime(scheduledAt?.slice(11))} hs
          </p>
          <StatusBadge status={status} />
        </div>

        <p className="text-sm text-slate-700">
          {doctorName} · {specialtyName}
        </p>

        {reason && <p className="text-sm text-slate-500">Motivo: {reason}</p>}
      </div>

      {canCancel && (
        <Button
          variant="danger"
          icon={XCircle}
          onClick={() => onCancel(appointment)}
        >
          Cancelar turno
        </Button>
      )}
    </article>
  );
}

export default AppointmentCard;
