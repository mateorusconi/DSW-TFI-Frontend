import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import DataTable from "../../shared/components/organisms/DataTable.jsx";
import { specialties } from "../Data/SpecialtiesMock.js";
import SpecialtiesStats from "../components/SpecialtiesStats.jsx";
import SpecialtyActions from "../components/SpecialtyActions.jsx";
import "./SpecialtiesListPageStyle.css";

function SpecialtiesListPage() {
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);

  const columns = [
    { key: "name", header: "Nombre de la especialidad" },
    { key: "description", header: "Descripción" },
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

      <DataTable columns={columns} rows={specialties} />
      <SpecialtiesStats total={specialties.length} />

      {specialtyToDelete !== null && (
        <ConfirmDialog
          title="Eliminar especialidad"
          message={`¿Querés eliminar la especialidad "${specialtyToDelete.name}"? La eliminación estará disponible cuando conectemos la API.`}
          confirmLabel="Eliminar"
          confirmDisabled
          onCancel={() => setSpecialtyToDelete(null)}
        />
      )}
    </section>
  );
}

export default SpecialtiesListPage;
