// Píldora de estado; el back devuelve isActive en cada especialidad
function SpecialtyStatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? "Activa" : "Inactiva"}
    </span>
  );
}

export default SpecialtyStatusBadge;
