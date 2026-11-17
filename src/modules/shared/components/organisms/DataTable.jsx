import { LoaderCircle } from "lucide-react";
import "./DataTableStyle.css";

function DataTable({
  columns,
  rows = [],
  rowKey = "id",
  loading = false,
  emptyMessage = "No hay resultados",
}) {
  const columnCount = Math.max(columns.length, 1);

  return (
    <div className="data-table-container overflow-x-auto">
      <table className="data-table" aria-busy={loading}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.className}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount} className="data-table__state">
                <span
                  role="status"
                  className="inline-flex items-center gap-2"
                >
                  <LoaderCircle
                    className="size-5 animate-spin"
                    aria-hidden="true"
                  />
                  Cargando...
                </span>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="data-table__state">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;