import { useState } from "react";
import DataTable from "../components/organisms/DataTable.jsx";
import Pagination from "../components/molecules/Pagination.jsx";
import SearchBar from "../components/molecules/SearchBar.jsx";
import { fetchDemoRows } from "../data/paginatedListDemo.js";
import { usePaginatedList } from "../hooks/usePaginatedList.js";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "name", header: "Especialidad" },
  { key: "description", header: "Descripción" },
];

function ComponentsDemoPage() {
  const [filters, setFilters] = useState({ name: "" });

  const {
    items,
    total,
    pageIndex,
    setPageIndex,
    loading,
    error,
    reload,
  } = usePaginatedList(fetchDemoRows, {
    pageSize: PAGE_SIZE,
    filters,
  });

  function handleSearch(text) {
    setFilters({ name: text });
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Componentes compartidos
        </h1>

        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
        >
          Recargar
        </button>
      </div>

      <p className="mb-6 text-sm text-slate-600">
        Tabla, búsqueda y paginación mediante un custom hook.
        Los 25 registros son ficticios y no se consulta la API.
      </p>

      <SearchBar
        placeholder="Buscar especialidad..."
        onSearch={handleSearch}
      />

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {error}
        </p>
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={items}
          loading={loading}
        />
      )}

      {!loading && !error && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPageIndex}
          itemLabel="especialidades"
        />
      )}
    </main>
  );
}

export default ComponentsDemoPage;