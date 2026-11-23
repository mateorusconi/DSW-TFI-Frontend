import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import HeaderSearch from "../../shared/components/molecules/HeaderSearch.jsx";
import RecordsCard from "../../shared/components/organisms/RecordsCard.jsx";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";
import { getDoctors } from "../../doctors/services/doctorsService.js";

const PAGE_SIZE = 5;

// "Dra. Laura Gómez" -> "LG": se salta el título para que las iniciales sean del nombre
function doctorInitials(name) {
  return name
    .split(" ")
    .filter((word) => word && !word.endsWith("."))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// Columnas del mockup; "Ver Detalle" lleva a la página de doctores (aclaración de la v1.4)
const COLUMNS = [
  {
    key: "name",
    header: "Nombre del Doctor",
    render: (doctor) => (
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700"
        >
          {doctorInitials(doctor.name)}
        </span>
        <span className="font-semibold text-primary-700">{doctor.name}</span>
      </div>
    ),
  },
  {
    key: "specialty",
    header: "Especialidad",
    render: (doctor) => (
      <span className="text-slate-600">{doctor.specialty?.name ?? "Sin especialidad"}</span>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    className: "text-right",
    render: () => (
      <Link to={PATHS.doctors} className="text-sm font-semibold text-primary-700 hover:underline">
        Ver Detalle
      </Link>
    ),
  },
];

function DoctorsDirectory() {
  const [filters, setFilters] = useState({ name: "" });
  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(getDoctors, { pageSize: PAGE_SIZE, filters });

  return (
    <RecordsCard
      title="Directorio de Profesionales Médicos"
      headerRight={
        <HeaderSearch
          placeholder="Buscar por nombre..."
          label="Buscar médico por nombre"
          onSearch={(name) => setFilters({ name })}
          className="sm:w-80"
        />
      }
      columns={COLUMNS}
      rows={items}
      loading={loading}
      error={error}
      onRetry={reload}
      total={total}
      pageIndex={pageIndex}
      pageSize={PAGE_SIZE}
      onPageChange={setPageIndex}
      emptyMessage="No hay doctores para mostrar"
    />
  );
}

export default DoctorsDirectory;
