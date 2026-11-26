import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId } from "react";
import Alert from "../molecules/Alert.jsx";
import DataTable from "./DataTable.jsx";

const pageButton =
  "rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40";

// Tarjeta blanca con título ("Registros de Doctores"), la tabla y el pie
// "Mostrando N de M registros" con flechas, como en los listados del mockup.
// `headerRight` es lo que va a la derecha del título (por ejemplo, un buscador).
function RecordsCard({
  title,
  headerRight,
  columns,
  rows,
  loading,
  error,
  onRetry,
  total,
  pageIndex,
  pageSize,
  onPageChange,
  emptyMessage,
}) {
  const titleId = useId();
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 id={titleId} className="text-lg font-semibold text-primary-700">
          {title}
        </h2>
        {headerRight}
      </div>

      {error ? (
        <Alert variant="error" actionLabel="Reintentar" onAction={onRetry}>
          {error}
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyMessage={emptyMessage}
        />
      )}

      {!loading && !error && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span aria-live="polite">
            Mostrando {rows.length} de {total} registros
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={pageIndex <= 1}
              onClick={() => onPageChange(pageIndex - 1)}
              className={pageButton}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Página siguiente"
              disabled={pageIndex >= lastPage}
              onClick={() => onPageChange(pageIndex + 1)}
              className={pageButton}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default RecordsCard;
