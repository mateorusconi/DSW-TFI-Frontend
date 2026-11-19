import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import Alert from "../../shared/components/molecules/Alert.jsx";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import SearchBar from "../../shared/components/molecules/SearchBar.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";

import { getSpecialtyListColumns } from "../components/specialtyListColumns.jsx";
import {
  deleteSpecialty,
  getSpecialties,
} from "../services/specialtiesService.js";
import "./SpecialtiesListPageStyle.css";

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
      pageSize: DEFAULT_PAGE_SIZE,
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

  const columns = getSpecialtyListColumns(openDeleteDialog);

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
        <Alert
          variant="success"
          actionLabel="Cerrar"
          onAction={dismissSuccessMessage}
        >
          {successMessage}
        </Alert>
      )}

      <SearchBar placeholder="Buscar especialidad..." onSearch={handleSearch} />

      {error ? (
        <Alert variant="error" actionLabel="Reintentar" onAction={reload}>
          {error}
        </Alert>
      ) : (
        <DataTable columns={columns} rows={items} loading={loading} />
      )}

      {!loading && !error && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={DEFAULT_PAGE_SIZE}
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
