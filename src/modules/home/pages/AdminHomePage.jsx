import { SquarePlus, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import Button from "../../shared/components/atoms/Button.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";
import { formatLongDate, toLocalISODate } from "../../shared/helpers/dates.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";
import DashboardStats from "../components/DashboardStats.jsx";
import { todayAppointmentsColumns } from "../components/todayAppointmentsColumns.jsx";
import { getAppointmentsByDate } from "../services/todayAppointmentsService.js";

function AdminHomePage() {
  const navigate = useNavigate();
  const [filters] = useState(() => ({ date: toLocalISODate(new Date()) }));
  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(getAppointmentsByDate, {
      pageSize: DEFAULT_PAGE_SIZE,
      filters,
    });

  return (
    <div>
      <PageHeader
        title="Vista General de Gestión"
        subtitle="Configure el personal médico y las especialidades del departamento."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button icon={UserPlus} onClick={() => navigate(PATHS.doctorNew)}>
              Agregar nuevo doctor
            </Button>
            <Button
              variant="secondary"
              icon={SquarePlus}
              onClick={() => navigate(PATHS.specialtyNew)}
            >
              Agregar nueva especialidad
            </Button>
          </div>
        }
      />

      <DashboardStats date={filters.date} />

      <section aria-labelledby="today-appointments-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="today-appointments-title" className="text-lg font-semibold text-slate-900">
              Turnos de hoy
            </h2>
            <time dateTime={filters.date} className="text-sm text-slate-600">
              {formatLongDate(filters.date)}
            </time>
          </div>
          <Link
            to={PATHS.appointmentsSearch}
            className="text-sm font-medium text-sky-900 underline"
          >
            Ver búsqueda avanzada <span aria-hidden="true">→</span>
          </Link>
        </div>

        {error ? (
          <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            <p role="alert">{error}</p>
            <Button variant="secondary" onClick={reload}>Reintentar</Button>
          </div>
        ) : (
          <DataTable
            columns={todayAppointmentsColumns}
            rows={items}
            rowKey="appointmentsId"
            loading={loading}
            emptyMessage="No hay turnos para hoy"
          />
        )}

        {!loading && !error && total > DEFAULT_PAGE_SIZE && (
          <Pagination
            pageIndex={pageIndex}
            pageSize={DEFAULT_PAGE_SIZE}
            total={total}
            onPageChange={setPageIndex}
            itemLabel="turnos"
          />
        )}
      </section>
    </div>
  );
}

export default AdminHomePage;
