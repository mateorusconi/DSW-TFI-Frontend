import { Clock, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

const iconClassName =
  "inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900";

function DoctorActions({ doctor, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <Link
        to={PATHS.doctorAvailability(doctor.id)}
        state={{ doctor }}
        aria-label={`Disponibilidad de ${doctor.name}`}
        title="Disponibilidad horaria"
        className={iconClassName}
      >
        <Clock size={18} aria-hidden="true" />
      </Link>

      <Link
        to={PATHS.doctorEdit(doctor.id)}
        state={{ doctor }}
        aria-label={`Editar ${doctor.name}`}
        title="Editar médico"
        className={iconClassName}
      >
        <Pencil size={18} aria-hidden="true" />
      </Link>

      <button
        type="button"
        onClick={() => onDelete(doctor)}
        aria-label={`Eliminar ${doctor.name}`}
        title="Eliminar médico"
        className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default DoctorActions;
