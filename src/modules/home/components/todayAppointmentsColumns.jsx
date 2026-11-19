import StatusBadge from "../../shared/components/atoms/StatusBadge.jsx";

const TIME_FORMAT = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function formatAppointmentTime(scheduledAt) {
  if (!scheduledAt) return "—";
  const date = new Date(scheduledAt);
  return Number.isNaN(date.getTime()) ? "—" : TIME_FORMAT.format(date);
}

export const todayAppointmentsColumns = [
  {
    key: "scheduledAt",
    header: "Hora",
    render: ({ scheduledAt }) => formatAppointmentTime(scheduledAt),
  },
  {
    key: "patient",
    header: "Paciente",
    render: ({ patient }) => (
      <>
        <span className="block">{patient?.fullName || "Sin nombre"}</span>
        <span className="text-sm text-slate-600">DNI {patient?.dni ?? "—"}</span>
      </>
    ),
  },
  {
    key: "doctor",
    header: "Médico",
    render: ({ doctor }) => doctor?.name ?? "—",
  },
  {
    key: "specialty",
    header: "Especialidad",
    render: ({ doctor }) => doctor?.specialty?.name ?? "—",
  },
  {
    key: "appointmentsStatus",
    header: "Estado",
    render: ({ appointmentsStatus }) => <StatusBadge status={appointmentsStatus} />,
  },
];
