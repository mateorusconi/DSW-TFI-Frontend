import DataTable from "../../shared/components/organisms/DataTable.jsx";
import Card from "../../shared/components/atoms/Card.jsx";
import { Pencil, Trash2 } from "lucide-react";
import "./SpecialtiesListPageStyle.css";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { specialties } from "../Data/SpecialtiesMock.js";
import { useState } from "react";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";

function SpecialtiesListPage() {
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);
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
      render: (row) => (
        <div className="table-actions">
          <Link
            to={PATHS.specialtyEdit(row.id)}
            aria-label={`Editar ${row.name}`}
            title="Editar especialidad"
          >
            <Pencil size={18} aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="table-actions__delete"
            aria-label={`Eliminar ${row.name}`}
            title="Eliminar especialidad"
            onClick={() => setSpecialtyToDelete(row)}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="specialties-page">
      <header>
        <h1>Directorio de Especialidades</h1>
        <p>Administrá las especialidades médicas del consultorio.</p>
        <Link
          to={PATHS.specialtyNew}
          className="mt-4 inline-flex rounded-md bg-sky-900 px-4 py-2 text-sm text-white hover:bg-sky-800"
        >
          Nueva especialidad
        </Link>
      </header>
      <div>
        <DataTable columns={columns} rows={specialties} />
      </div>
      <ul className="specialties-stats" aria-label="Resumen de especialidades">
        <li>
          <Card className="specialties-stat">
            <h2>Total especialidades</h2>
            <p>{specialties.length}</p>
            <small>Especialidades de esta prueba</small>
          </Card>
        </li>

        <li>
          <Card className="specialties-stat">
            <h2>Más demandada</h2>
            <p>Cardiología</p>
            <small>Dato de ejemplo</small>
          </Card>
        </li>

        <li>
          <Card className="specialties-stat">
            <h2>Nuevas este mes</h2>
            <p>03</p>
            <small>Dato de ejemplo</small>
          </Card>
        </li>
      </ul>

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
