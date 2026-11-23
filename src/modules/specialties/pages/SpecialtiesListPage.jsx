import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import Alert from "../../shared/components/molecules/Alert.jsx";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import HeaderSearch from "../../shared/components/molecules/HeaderSearch.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import RecordsCard from "../../shared/components/organisms/RecordsCard.jsx";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";

import { getSpecialtyListColumns } from "../components/specialtyListColumns.jsx";
import {
  deleteSpecialty,
  getSpecialties,
} from "../services/specialtiesService.js";

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
    <section>
      <PageHeader
        title="Directorio de Especialidades"
        subtitle="Administre las categorías médicas, servicios y disponibilidad del personal especializado."
        actions={
          <>
            <HeaderSearch
              placeholder="Buscar especialidad..."
              label="Buscar especialidad"
              onSearch={handleSearch}
            />

            <Link
              to={PATHS.specialtyNew}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 text-sm font-medium text-white hover:bg-primary-600"
            >
              <Plus size={18} aria-hidden="true" />
              Nueva Especialidad
            </Link>
          </>
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

      <RecordsCard
        title="Registros de Especialidades"
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={reload}
        total={total}
        pageIndex={pageIndex}
        pageSize={DEFAULT_PAGE_SIZE}
        onPageChange={setPageIndex}
        emptyMessage="No hay especialidades registradas"
      />

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
