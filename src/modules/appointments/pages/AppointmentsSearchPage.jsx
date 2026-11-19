import { useState } from "react";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";
import { appointmentSearchColumns } from "../components/appointmentSearchColumns.jsx";
import AppointmentsFilters from "../components/AppointmentsFilters.jsx";
import FilterChips from "../components/FilterChips.jsx";
import { getActiveFilters } from "../helpers/getActiveFilters.js";
import { useAppointmentFilterOptions } from "../hooks/useAppointmentFilterOptions.js";
import { searchAppointments } from "../services/adminAppointmentsService.js";

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState();
  const options = useAppointmentFilterOptions();

  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(searchAppointments, { pageSize: DEFAULT_PAGE_SIZE, filters });

  function removeFilter(key) {
    setFilters((current) => ({ ...current, [key]: "" }));
  }

  return (
    <section>
      <PageHeader
        title="Búsqueda y filtrado de citas"
        subtitle="Consultá los turnos registrados y combiná los filtros."
      />
      <AppointmentsFilters
        appliedFilters={filters}
        specialties={options.specialties}
        doctors={options.doctors}
        optionsUnavailable={options.loading || Boolean(options.error)}
        onApply={setFilters}
      />

      {options.loading && <p role="status" className="mb-4">Cargando especialidades y médicos…</p>}
      {options.error && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-900">
          <p role="alert">No se pudieron cargar las opciones: {options.error}</p>
          <button type="button" className="mt-2 underline" onClick={options.reload}>
            Reintentar opciones
          </button>
        </div>
      )}

      <FilterChips
        filters={getActiveFilters(filters, options.specialties, options.doctors)}
        onRemove={removeFilter}
      />

      {error ? (
        <div className="rounded-md bg-red-50 p-3 text-red-800">
          <p role="alert">{error}</p>
          <button type="button" className="mt-2 underline" onClick={reload}>
            Reintentar búsqueda
          </button>
        </div>
      ) : (
        <DataTable
          columns={appointmentSearchColumns}
          rows={items}
          rowKey="appointmentsId"
          loading={loading}
        />
      )}

      {!loading && !error && total > 0 && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={DEFAULT_PAGE_SIZE}
          total={total}
          onPageChange={setPageIndex}
          itemLabel="turnos"
        />
      )}
    </section>
  );
}

export default AppointmentsSearchPage;
