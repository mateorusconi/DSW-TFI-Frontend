import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import AvailabilityDoctorPicker from "../components/AvailabilityDoctorPicker.jsx";
import AvailabilitySchedule from "../components/AvailabilitySchedule.jsx";

function DoctorAvailabilityPage() {
  const { id = "" } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const fixedDoctor = id && state?.doctor?.id === id ? state.doctor : null;

  function selectDoctor(doctorId) {
    navigate(
      doctorId ? PATHS.doctorAvailability(doctorId) : PATHS.availability,
      {
        replace: true,
      },
    );
  }

  return (
    <div>
      <PageHeader
        title="Disponibilidad horaria"
        subtitle="Configurá los días y horarios de atención del médico."
        breadcrumb={[
          { label: "Médicos", to: PATHS.doctors },
          { label: "Disponibilidad horaria" },
        ]}
      />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(14rem,1fr)_minmax(0,2fr)]">
        <AvailabilityDoctorPicker
          fixedDoctor={fixedDoctor}
          doctorId={id}
          onSelect={selectDoctor}
        />
        {id ? (
          <AvailabilitySchedule key={id} doctorId={id} />
        ) : (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Elegí un médico para consultar o configurar su horario.
          </p>
        )}
      </div>
    </div>
  );
}

export default DoctorAvailabilityPage;
