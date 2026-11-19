import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";

import Alert from "../../shared/components/molecules/Alert.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getSpecialties } from "../../specialties/services/specialtiesService.js";

import DoctorForm from "../components/DoctorForm.jsx";
import { createDoctor, updateDoctor } from "../services/doctorsService.js";

function DoctorFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  useEffect(() => {
    let active = true;

    // shortcut: trae hasta 100 especialidades en una página; si crecen, pedir al back un endpoint sin paginar
    getSpecialties({ pageIndex: 1, pageSize: 100 })
      .then((page) => {
        if (!active) return;

        setSpecialtyOptions(
          page.data.map((specialty) => ({
            value: specialty.id,
            label: specialty.name,
          })),
        );
      })
      .catch((error) => {
        if (active) setOptionsError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoadingOptions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const isEditing = id !== undefined;
  const doctor = location.state?.doctor;
  const hasEditingData = doctor?.id === id;

  if (isEditing && !hasEditingData) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Volvé al listado para editar</h1>

        <p className="mt-2 text-sm text-slate-600">
          Seleccioná un médico desde el listado para cargar sus datos.
        </p>

        <Link to={PATHS.doctors} className="mt-4 inline-block text-sky-800 underline">
          Volver al listado
        </Link>
      </section>
    );
  }

  const title = isEditing ? "Editar Doctor" : "Registrar Nuevo Doctor";

  const initialValues = isEditing
    ? {
        name: doctor.name,
        specialtyId: doctor.specialty?.id ?? "",
        licenseNumber: doctor.licenseNumber,
      }
    : undefined;

  async function handleSave(data) {
    if (isEditing) {
      await updateDoctor(id, data);
    } else {
      await createDoctor(data);
    }

    navigate(PATHS.doctors, {
      replace: true,
      state: {
        successMessage: isEditing
          ? "Médico actualizado correctamente."
          : "Médico registrado correctamente.",
      },
    });
  }

  return (
    <section>
      <PageHeader
        title={title}
        subtitle="Completá todos los campos obligatorios."
        breadcrumb={[{ label: "Doctores", to: PATHS.doctors }, { label: title }]}
      />

      {optionsError ? (
        <Alert variant="error">{optionsError}</Alert>
      ) : loadingOptions ? (
        <p className="text-sm text-slate-600">Cargando especialidades...</p>
      ) : (
        <DoctorForm
          key={id ?? "new"}
          initialValues={initialValues}
          specialtyOptions={specialtyOptions}
          onSubmit={handleSave}
          onCancel={() => navigate(PATHS.doctors)}
          submitLabel={isEditing ? "Guardar cambios" : "Guardar Doctor"}
        />
      )}
    </section>
  );
}

export default DoctorFormPage;