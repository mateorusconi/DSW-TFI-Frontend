import DataTable from "../../shared/components/organisms/DataTable.jsx";
import Card from "../../shared/components/atoms/Card.jsx";
import { Pencil, Trash2 } from "lucide-react";
import "./SpecialtiesListPageStyle.css";
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
        <button
          type="button"
          aria-label={`Editar ${row.name}`}
          title="Editar especialidad"
          onClick={() => console.log("Editar especialidad:", row.id)}
        >
          <Pencil size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="table-actions__delete"
          aria-label={`Eliminar ${row.name}`}
          title="Eliminar especialidad"
          onClick={() => console.log("Eliminar especialidad:", row.id)}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    ),
  },
];

const specialties = [
  {
    id: "1",
    name: "Cardiología",
    description: "Diagnóstico y tratamiento de enfermedades del corazón.",
  },
  {
    id: "2",
    name: "Neurología",
    description:
      "Diagnóstico y tratamiento de enfermedades del sistema nervioso.",
  },
  {
    id: "3",
    name: "Dermatología",
    description: "Atención de enfermedades de la piel.",
  },
];

function SpecialtiesListPage() {
  return (
    <section className="specialties-page">
      <header>
        <h1>Directorio de Especialidades</h1>
        <p>Administrá las especialidades médicas del consultorio.</p>
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
    </section>
  );
}

export default SpecialtiesListPage;
