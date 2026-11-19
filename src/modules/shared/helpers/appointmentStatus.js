export const APPOINTMENT_STATUS = {
  BOOKED: { label: "Confirmado", tone: "success" },
  CANCELLED: { label: "Cancelado", tone: "danger" },
  ATTENDED: { label: "Atendido", tone: "neutral" },
  NO_SHOW: { label: "Ausente", tone: "warning" },
};

export function getAppointmentStatus(status) {
  if (typeof status !== "string" || status.trim() === "") {
    return { label: "Sin estado", tone: "neutral" };
  }

  const normalizedStatus = status.trim().toUpperCase();
  const key = normalizedStatus === "NOSHOW" ? "NO_SHOW" : normalizedStatus;

  return APPOINTMENT_STATUS[key] ?? { label: status, tone: "neutral" };
}
