import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import SearchBar from "../../shared/components/molecules/SearchBar.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";

import SpecialtyActions from "../components/SpecialtyActions.jsx";
import { getSpecialties } from "../services/specialtiesService.js";
import "./SpecialtiesListPageStyle.css";

const PAGE_SIZE = 10;

function SpecialtiesListPage() {
  const [filters, setFilters] = useState({ name: "" });
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);

  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(getSpecialties, {
      pageSize: PAGE_SIZE,
      filters,
    });

  function handleSearch(text) {
    setFilters({ name: text });
  }

  const columns = [
    {
      key: "name",
      header: "Nombre de la especialidad",
    },
    {
      key: "description",
      header: "Descripción",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (specialty) => (
        <SpecialtyActions
          specialty={specialty}
          onDelete={setSpecialtyToDelete}
        />
      ),
    },
  ];

  return (
    <section className="specialties-page">
      <PageHeader
        title="Directorio de Especialidades"
        subtitle="Administrá las especialidades médicas del consultorio."
        actions={
          <Link
            to={PATHS.specialtyNew}
            className="inline-flex rounded-md bg-sky-900 px-4 py-2 text-sm text-white hover:bg-sky-800"
          >
            Nueva especialidad
          </Link>
        }
      />

      <SearchBar placeholder="Buscar especialidad..." onSearch={handleSearch} />

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-md border border-red-300 px-3 py-2 text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <DataTable columns={columns} rows={items} loading={loading} />
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

      {specialtyToDelete !== null && (
        <ConfirmDialog
          title="Eliminar especialidad"
          message={`¿Querés eliminar la especialidad "${specialtyToDelete.name}"? La eliminación todavía no está habilitada.`}
          confirmLabel="Eliminar"
          confirmDisabled
          onCancel={() => setSpecialtyToDelete(null)}
        />
      )}
    </section>
  );
}

export default SpecialtiesListPage;
