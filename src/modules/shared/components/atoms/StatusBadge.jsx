import { getAppointmentStatus } from "../../helpers/appointmentStatus.js";

const TONE_CLASSES = {
  success: "bg-emerald-100 text-emerald-900",
  danger: "bg-red-100 text-red-900",
  neutral: "bg-slate-100 text-slate-800",
  warning: "bg-amber-100 text-amber-900",
};

export default function StatusBadge({ status }) {
  const { label, tone } = getAppointmentStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
