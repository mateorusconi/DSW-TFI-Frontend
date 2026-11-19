const DATE_TIME_FORMAT = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const STATUS_LABELS = {
  BOOKED: "Reservado",
  CANCELLED: "Cancelado",
  ATTENDED: "Atendido",
  NO_SHOW: "Ausente",
  NOSHOW: "Ausente",
};

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
    render: ({ appointmentsStatus }) =>
      STATUS_LABELS[appointmentsStatus?.toUpperCase()] ?? appointmentsStatus ?? "—",
  },
];
