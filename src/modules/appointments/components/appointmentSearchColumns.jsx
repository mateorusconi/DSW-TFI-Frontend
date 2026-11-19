import StatusBadge from "../../shared/components/atoms/StatusBadge.jsx";

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatScheduledAt(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : DATE_TIME_FORMAT.format(date);
}

export const appointmentSearchColumns = [
  {
    key: "scheduledAt",
    header: "Fecha",
    render: (turno) => formatScheduledAt(turno.scheduledAt),
  },
  {
    key: "doctor",
    header: "Especialidad / Médico",
    render: (turno) => (
      <>
        <span className="block">{turno.doctor?.specialty?.name ?? "—"}</span>
        <span className="text-sm text-slate-600">{turno.doctor?.name ?? "—"}</span>
      </>
    ),
  },
  {
    key: "patient",
    header: "Paciente",
    render: (turno) => (
      <>
        <span className="block">{turno.patient?.fullName || "Sin nombre"}</span>
        <span className="text-sm text-slate-600">DNI {turno.patient?.dni ?? "—"}</span>
      </>
    ),
  },
  {
    key: "appointmentsStatus",
    header: "Estado",
    render: ({ appointmentsStatus }) => <StatusBadge status={appointmentsStatus} />,
  },
];
