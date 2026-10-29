import { Link, useParams } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { specialties } from "../Data/SpecialtiesMock.js";
import SpecialtyForm from "../components/SpecialtiesForm.jsx";

function SpecialtyFormPage() {
  const { id } = useParams();
  const isEditing = id !== undefined;

  const specialty = specialties.find((item) => item.id === id);

  if (isEditing && !specialty) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Especialidad no encontrada</h1>

        <Link
          to={PATHS.specialties}
          className="mt-4 inline-block text-sky-800 underline"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const title = isEditing ? "Editar especialidad" : "Registrar nueva especialidad";

  const initialValues = {
    name: specialty?.name ?? "",
    description: specialty?.description ?? "",
  };

  function handleSave(data) {
    console.log("Datos válidos, todavía sin guardar:", {
      id,
      ...data,
    });
  }

  return (
    <section>
      <PageHeader
        title={title}
        subtitle="Completá la información de la especialidad médica."
        breadcrumb={[
          { label: "Especialidades", to: PATHS.specialties },
          { label: title },
        ]}
      />

      <p className="mb-4 text-sm text-slate-500">
        Prototipo: los datos todavía no se guardan.
      </p>

      <SpecialtyForm
        // React Hook Form toma los valores iniciales al montar el formulario.
        key={id ?? "new"}
        initialValues={initialValues}
        onSubmit={handleSave}
        cancelTo={PATHS.specialties}
        submitLabel={isEditing ? "Guardar cambios" : "Guardar especialidad"}
      />
    </section>
  );
}

export default SpecialtyFormPage;
