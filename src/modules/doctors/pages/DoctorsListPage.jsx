import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import Alert from "../../shared/components/molecules/Alert.jsx";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import HeaderSearch from "../../shared/components/molecules/HeaderSearch.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import RecordsCard from "../../shared/components/organisms/RecordsCard.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";
import { deleteDoctor, getDoctors } from "../services/doctorsService.js";
import { getDoctorsColumns } from "../components/doctorsColumns.jsx";
const PAGE_SIZE = 10;

const darkButton =
  "inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 text-sm font-medium text-white hover:bg-primary-600";

function DoctorsListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ name: "" });
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const successMessage = location.state?.successMessage;

  const { items, total, pageIndex, setPageIndex, loading, error, reload } =
    usePaginatedList(getDoctors, {
      pageSize: PAGE_SIZE,
      filters,
    });

  function handleSearch(text) {
    setFilters({ name: text });
  }

  function dismissSuccessMessage() {
    navigate(PATHS.doctors, { replace: true, state: null });
  }

  function openDeleteDialog(doctor) {
    setDeleteError("");
    setDoctorToDelete(doctor);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;

    setDoctorToDelete(null);
    setDeleteError("");
  }

  async function handleDelete() {
    if (!doctorToDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteDoctor(doctorToDelete.id);
    } catch (error) {
      setDeleteError(getErrorMessage(error));
      return;
    } finally {
      setIsDeleting(false);
    }

    setDoctorToDelete(null);

    navigate(PATHS.doctors, {
      replace: true,
      state: { successMessage: "Médico dado de baja correctamente." },
    });

    reload();
  }

  const columns = getDoctorsColumns(openDeleteDialog);

  return (
    <section>
      {/* Encabezado como el mockup: buscador y los dos botones a la derecha del título */}
      <PageHeader
        title="Directorio de Doctores"
        subtitle="Gestione el personal médico y supervise su disponibilidad actual."
        actions={
          <>
            <HeaderSearch
              placeholder="Buscar doctor por nombre..."
              label="Buscar doctor por nombre"
              onSearch={handleSearch}
            />

            <Link to={PATHS.availability} className={darkButton}>
              <Clock size={18} aria-hidden="true" />
              Agregar Disponibilidad Horaria
            </Link>

            <Link to={PATHS.doctorNew} className={darkButton}>
              <Plus size={18} aria-hidden="true" />
              Nuevo Doctor
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
        title="Registros de Doctores"
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={reload}
        total={total}
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        onPageChange={setPageIndex}
        emptyMessage="No hay doctores registrados"
      />

      {doctorToDelete !== null && (
        <ConfirmDialog
          title="Dar de baja al médico"
          message={`¿Querés dar de baja a "${doctorToDelete.name}"? Va a dejar de aparecer en el listado y no se le podrán reservar turnos.`}
          confirmLabel="Dar de baja"
          loading={isDeleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={closeDeleteDialog}
        />
      )}
    </section>
  );
}

export default DoctorsListPage;
