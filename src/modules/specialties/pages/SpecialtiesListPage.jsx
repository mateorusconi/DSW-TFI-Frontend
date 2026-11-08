import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import SearchBar from "../../shared/components/molecules/SearchBar.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";

import SpecialtyActions from "../components/SpecialtyActions.jsx";
import {
  deleteSpecialty,
  getSpecialties,
} from "../services/specialtiesService.js";
import "./SpecialtiesListPageStyle.css";

const PAGE_SIZE = 10;

function SpecialtiesListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ name: "" });
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const successMessage = location.state?.successMessage;

  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(getSpecialties, {
      pageSize: PAGE_SIZE,
      filters,
    });

  function handleSearch(text) {
    setFilters({ name: text });
  }

  function dismissSuccessMessage() {
    navigate(PATHS.specialties, {
      replace: true,
      state: null,
    });
  }

  function openDeleteDialog(specialty) {
    setDeleteError("");
    setSpecialtyToDelete(specialty);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;

    setSpecialtyToDelete(null);
    setDeleteError("");
  }

  async function handleDelete() {
    if (!specialtyToDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteSpecialty(specialtyToDelete.id);
    } catch (error) {
      setDeleteError(getErrorMessage(error));
      return;
    } finally {
      setIsDeleting(false);
    }

    setSpecialtyToDelete(null);

    navigate(PATHS.specialties, {
      replace: true,
      state: {
        successMessage: "Especialidad eliminada correctamente.",
      },
    });

    reload();
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
        <SpecialtyActions specialty={specialty} onDelete={openDeleteDialog} />
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

      {successMessage && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <p>{successMessage}</p>

          <button
            type="button"
            onClick={dismissSuccessMessage}
            className="rounded-md px-2 py-1 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

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
          message={`¿Querés eliminar la especialidad "${specialtyToDelete.name}"?`}
          confirmLabel="Eliminar"
          loading={isDeleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={closeDeleteDialog}
        />
      )}
    </section>
  );
}

export default SpecialtiesListPage;
