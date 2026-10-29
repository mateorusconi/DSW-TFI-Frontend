import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

function SpecialtyActions({ specialty, onDelete }) {
  return (
    <div className="table-actions">
      <Link
        to={PATHS.specialtyEdit(specialty.id)}
        aria-label={`Editar ${specialty.name}`}
        title="Editar especialidad"
      >
        <Pencil size={18} aria-hidden="true" />
      </Link>

      <button
        type="button"
        className="table-actions__delete"
        aria-label={`Eliminar ${specialty.name}`}
        title="Eliminar especialidad"
        onClick={() => onDelete(specialty)}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default SpecialtyActions;
