import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { PATHS } from "../../../router/paths.js";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import SpecialtyForm from "../components/SpecialtiesForm.jsx";
import {
  createSpecialty,
  updateSpecialty,
} from "../services/specialtiesService.js";

function SpecialtyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEditing = id !== undefined;
  const specialty = location.state?.specialty;

  const hasEditingData =
    specialty?.id === id &&
    typeof specialty?.name === "string" &&
    typeof specialty?.description === "string";

  if (isEditing && !hasEditingData) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Volvé al listado para editar</h1>

        <p className="mt-2 text-sm text-slate-600">
          Seleccioná una especialidad desde el listado para cargar sus datos.
        </p>

        <Link
          to={PATHS.specialties}
          className="mt-4 inline-block text-sky-800 underline"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const title = isEditing
    ? "Editar Especialidad"
    : "Registrar Nueva Especialidad";

  const initialValues = {
    name: isEditing ? specialty.name : "",
    description: isEditing ? specialty.description : "",
    // Al editar se precarga el estado actual; una especialidad nueva arranca activa
    isActive: String(isEditing ? specialty.isActive !== false : true),
  };

  async function handleSave(data) {
    const payload = { ...data, isActive: data.isActive === "true" };

    if (isEditing) {
      await updateSpecialty(id, payload);
    } else {
      await createSpecialty(payload);
    }

    navigate(PATHS.specialties, {
      replace: true,
      state: {
        successMessage: isEditing
          ? "Especialidad actualizada correctamente."
          : "Especialidad creada correctamente.",
      },
    });
  }

  return (
    <section>
      <PageHeader
        title={title}
        subtitle="Complete la información técnica y administrativa para dar de alta una especialidad médica en el sistema."
        breadcrumb={[
          { label: "Especialidades", to: PATHS.specialties },
          {
            label: isEditing
              ? "Editar Especialidad"
              : "Agregar Nueva Especialidad",
          },
        ]}
      />

      <SpecialtyForm
        key={id ?? "new"}
        initialValues={initialValues}
        onSubmit={handleSave}
        cancelTo={PATHS.specialties}
        submitLabel={isEditing ? "Guardar cambios" : "Guardar Especialidad"}
      />
    </section>
  );
}

export default SpecialtyFormPage;
