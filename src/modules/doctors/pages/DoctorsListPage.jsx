import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import Alert from "../../shared/components/molecules/Alert.jsx";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import Pagination from "../../shared/components/molecules/Pagination.jsx";
import SearchBar from "../../shared/components/molecules/SearchBar.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";
import { deleteDoctor, getDoctors } from "../services/doctorsService.js";
import { getDoctorsColumns } from "../components/doctorsColumns.jsx";
const PAGE_SIZE = 10;

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
      <PageHeader
        title="Directorio de Doctores"
        subtitle="Gestioná el personal médico del consultorio."
        actions={
          <>
            <Link
              to={PATHS.availability}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Clock size={18} aria-hidden="true" />
              Disponibilidad Horaria
            </Link>

            <Link
              to={PATHS.doctorNew}
              className="inline-flex items-center gap-2 rounded-md bg-sky-900 px-4 py-2 text-sm text-white hover:bg-sky-800"
            >
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

      <SearchBar placeholder="Buscar doctor por nombre..." onSearch={handleSearch} />

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
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPageIndex}
          itemLabel="doctores registrados"
        />
      )}

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