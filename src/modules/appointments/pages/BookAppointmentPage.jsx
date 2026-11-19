import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import Button from "../../shared/components/atoms/Button.jsx";
import Select from "../../shared/components/atoms/Select.jsx";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { startOfWeek } from "../../shared/helpers/dates.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getDoctors } from "../../doctors/services/doctorsService.js";
import { getSpecialties } from "../../specialties/services/specialtiesService.js";
import BookingConfirmBar from "../components/BookingConfirmBar.jsx";
import WeekSlotsGrid from "../components/WeekSlotsGrid.jsx";
import { useDoctorSlots } from "../hooks/useDoctorSlots.js";
import { createAppointment } from "../services/bookingService.js";

// Errores después de los cuales el horario elegido ya no sirve y hay que recargar la grilla
const SLOT_ERRORS = ["APPOINTMENT_CONFLICT", "APPOINTMENT_PAST_DATE"];

function describeSlot(slot) {
  const date = new Date(slot.date);
  const weekday = date.toLocaleDateString("es-AR", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${weekday} ${day}/${month} a las ${slot.startTime}`;
}

function BookAppointmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [optionsError, setOptionsError] = useState("");
  const [searchedDoctor, setSearchedDoctor] = useState(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notice, setNotice] = useState(null);

  const { slots, loading, error, reload } = useDoctorSlots(searchedDoctor?.id, weekStart);

  // Al montar: las especialidades
  useEffect(() => {
    let active = true;

    // shortcut: trae hasta 100 especialidades; si crecen, pedir al back un endpoint sin paginar
    getSpecialties({ pageIndex: 1, pageSize: 100 })
      .then((page) => {
        if (active) setSpecialties(page.data);
      })
      .catch((error) => {
        if (active) setOptionsError(getErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, []);

  // Al cambiar la especialidad: sus médicos
  useEffect(() => {
    if (!specialtyId) return;

    let active = true;

    getDoctors({ pageIndex: 1, pageSize: 100, specialtyId })
      .then((page) => {
        if (active) setDoctors(page.data);
      })
      .catch((error) => {
        if (active) setOptionsError(getErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, [specialtyId]);

  function handleSpecialtyChange(event) {
    setSpecialtyId(event.target.value);
    setDoctorId("");
    setDoctors([]);
    setSearchedDoctor(null);
    setSelectedSlot(null);
  }

  function handleSearch() {
    setNotice(null);
    setSearchedDoctor(doctors.find((doctor) => doctor.id === doctorId) ?? null);
    setWeekStart(startOfWeek(new Date()));
    setSelectedSlot(null);
  }

  function moveWeek(days) {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
    setSelectedSlot(null);
  }

  function selectSlot(slot) {
    setNotice(null);
    setSelectedSlot(slot);
  }

  async function handleConfirm(reason) {
    setNotice(null);

    try {
      await createAppointment({
        doctorId: searchedDoctor.id,
        availabilityId: selectedSlot.id,
        dni: user.dni,
        reason,
      });
      setNotice({
        type: "success",
        text: `¡Turno confirmado para el ${describeSlot(selectedSlot)}!`,
      });
      setSelectedSlot(null);
      reload();
    } catch (error) {
      // Los errores del motivo los muestra el formulario debajo del campo
      if (error.errorCode === "VALIDATION_ERROR") {
        throw error;
      }

      setNotice({ type: "error", text: getErrorMessage(error) });

      if (SLOT_ERRORS.includes(error.errorCode)) {
        setSelectedSlot(null);
        reload();
      }
    }
  }

  const canGoPrev = weekStart > startOfWeek(new Date());

  return (
    <section>
      <PageHeader
        title="Reservar Turno Médico"
        subtitle="Seleccioná la especialidad y el profesional para ver los horarios disponibles."
      />

      {optionsError && <Alert variant="error">{optionsError}</Alert>}

      <div className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Select
          id="booking-specialty"
          label="Seleccionar especialidad"
          placeholder="Seleccione una especialidad"
          options={specialties.map((specialty) => ({ value: specialty.id, label: specialty.name }))}
          value={specialtyId}
          onChange={handleSpecialtyChange}
        />

        <Select
          id="booking-doctor"
          label="Seleccionar doctor"
          placeholder={specialtyId ? "Seleccione un doctor" : "Primero elegí una especialidad"}
          options={doctors.map((doctor) => ({ value: doctor.id, label: doctor.name }))}
          value={doctorId}
          onChange={(event) => setDoctorId(event.target.value)}
          disabled={!specialtyId}
        />

        <Button icon={Search} onClick={handleSearch} disabled={!doctorId}>
          Buscar disponibilidad
        </Button>
      </div>

      {searchedDoctor && (
        <>
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{searchedDoctor.name}</p>
            <p className="text-sm text-slate-600">{searchedDoctor.specialty?.name}</p>
          </div>

          {notice && (
            <Alert
              variant={notice.type}
              actionLabel={notice.type === "success" ? "Ver mis turnos" : undefined}
              onAction={
                notice.type === "success"
                  ? () => navigate(PATHS.myAppointments)
                  : undefined
              }
            >
              {notice.text}
            </Alert>
          )}

          {error ? (
            <Alert variant="error" actionLabel="Reintentar" onAction={reload}>
              {error}
            </Alert>
          ) : loading ? (
            <p className="flex items-center gap-2 text-slate-600">
              <Spinner /> Buscando horarios...
            </p>
          ) : (
            <WeekSlotsGrid
              weekStart={weekStart}
              slots={slots}
              selectedSlotId={selectedSlot?.id}
              onSelect={selectSlot}
              onPrevWeek={() => moveWeek(-7)}
              onNextWeek={() => moveWeek(7)}
              canGoPrev={canGoPrev}
            />
          )}

          {selectedSlot && (
            <BookingConfirmBar
              key={selectedSlot.id}
              slot={selectedSlot}
              doctor={searchedDoctor}
              onConfirm={handleConfirm}
              onCancel={() => setSelectedSlot(null)}
            />
          )}
        </>
      )}
    </section>
  );
}

export default BookAppointmentPage;