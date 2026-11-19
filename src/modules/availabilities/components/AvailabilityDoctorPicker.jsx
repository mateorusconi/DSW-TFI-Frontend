import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { getDoctors } from "../../doctors/services/doctorsService.js";
import Select from "../../shared/components/atoms/Select.jsx";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { usePaginatedList } from "../../shared/hooks/usePaginatedList.js";

const DOCTOR_OPTIONS_LIMIT = 100;

function DoctorDetails({ doctor }) {
  if (!doctor) return null;

  return (
    <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">{doctor.name}</p>
      <p>Matrícula: {doctor.licenseNumber ?? "—"}</p>
      <p>Especialidad: {doctor.specialty?.name ?? "—"}</p>
    </div>
  );
}

function DoctorSelect({ doctorId, onSelect }) {
  const { items, total, loading, error, reload } = usePaginatedList(getDoctors, {
    pageSize: DOCTOR_OPTIONS_LIMIT,
  });

  if (loading) {
    return <p role="status" className="flex items-center gap-2"><Spinner /> Cargando médicos…</p>;
  }
  if (error) {
    return <Alert variant="error" actionLabel="Reintentar" onAction={reload}>{error}</Alert>;
  }

  const doctor = items.find(({ id }) => id === doctorId);
  const options = items.map(({ id, name }) => ({ value: id, label: name }));
  if (doctorId && !doctor) {
    options.push({ value: doctorId, label: "Profesional de la ruta actual" });
  }

  return (
    <div className="space-y-3">
      <Select
        id="availability-doctor"
        label="Médico"
        options={options}
        value={doctorId}
        placeholder={items.length ? "Elegí un médico" : "No hay médicos disponibles"}
        onChange={(event) => onSelect(event.target.value)}
      />
      <DoctorDetails doctor={doctor} />
      {total > DOCTOR_OPTIONS_LIMIT && (
        <p className="text-sm text-slate-600">
          Se muestran los primeros {DOCTOR_OPTIONS_LIMIT}. Para elegir otro, usá el{" "}
          <Link to={PATHS.doctors} className="text-sky-900 underline">directorio de médicos</Link>.
        </p>
      )}
    </div>
  );
}

export default function AvailabilityDoctorPicker({ fixedDoctor, doctorId, onSelect }) {
  return (
    <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Seleccionar profesional</h2>
      {fixedDoctor ? (
        <DoctorDetails doctor={fixedDoctor} />
      ) : (
        <DoctorSelect doctorId={doctorId} onSelect={onSelect} />
      )}
      <Alert variant="info">
        Los cambios solo afectan los turnos libres desde hoy hasta fin de mes.
        Los turnos ya reservados no se modifican.
      </Alert>
    </aside>
  );
}
