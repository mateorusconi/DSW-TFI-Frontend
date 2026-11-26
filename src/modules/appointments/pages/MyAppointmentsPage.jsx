import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import Button from "../../shared/components/atoms/Button.jsx";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import ConfirmDialog from "../../shared/components/molecules/ConfirmDialog.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { formatTime } from "../../shared/helpers/dates.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import AppointmentCard from "../components/AppointmentCard.jsx";
import { useMyAppointments } from "../hooks/useMyAppointments.js";

function describeAppointment(appointment) {
  const date = new Date(appointment.scheduledAt);
  const weekday = date.toLocaleDateString("es-AR", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${weekday} ${day}/${month} a las ${formatTime(appointment.scheduledAt?.slice(11))}`;
}

function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dni = user?.dni;

  // Cargar, reintentar y cancelar viven en el hook; la página solo maneja la UI
  const {
    appointments,
    loading,
    error: loadError,
    reload,
    cancel,
  } = useMyAppointments(dni);

  const [notice, setNotice] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  function openCancel(appointment) {
    setCancelError("");
    setToCancel(appointment);
  }

  function closeCancel() {
    setToCancel(null);
    setCancelError("");
  }

  async function confirmCancel() {
    setCanceling(true);
    setCancelError("");

    try {
      await cancel(toCancel.id);
      setToCancel(null);
      setNotice({ type: "success", text: "Turno cancelado." });
    } catch (error) {
      if (error.errorCode === "APPOINTMENT_INVALID_STATE") {
        setToCancel(null);
        setNotice({ type: "error", text: getErrorMessage(error) });
        reload();
      } else {
        setCancelError(getErrorMessage(error));
      }
    } finally {
      setCanceling(false);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <p className="flex items-center gap-2 text-slate-600">
          <Spinner /> Cargando turnos...
        </p>
      );
    }

    if (loadError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {loadError}
          <Button variant="secondary" onClick={reload}>
            Reintentar
          </Button>
        </div>
      );
    }

    if (appointments.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">No tenés turnos activos.</p>
          <Button
            icon={CalendarPlus}
            onClick={() => navigate(PATHS.bookAppointment)}
          >
            Reservar un turno
          </Button>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <AppointmentCard appointment={appointment} onCancel={openCancel} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <PageHeader
        title="Mis turnos"
        subtitle="Tus turnos activos. Podés cancelar los que todavía no fueron atendidos."
      />

      {notice && (
        <p
          role={notice.type === "error" ? "alert" : "status"}
          className={`mb-4 rounded-md border p-3 text-sm ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {notice.text}
        </p>
      )}

      {renderContent()}

      {toCancel && (
        <ConfirmDialog
          title="Cancelar turno"
          message={`¿Cancelar el turno del ${describeAppointment(toCancel)} con ${toCancel.doctorName}?`}
          confirmLabel="Sí, cancelar turno"
          onCancel={closeCancel}
          onConfirm={confirmCancel}
          loading={canceling}
          error={cancelError}
        />
      )}
    </section>
  );
}

export default MyAppointmentsPage;
