import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Button from "../../shared/components/atoms/Button.jsx";
import Select from "../../shared/components/atoms/Select.jsx";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import PageHeader from "../../shared/components/molecules/PageHeader.jsx";
import { startOfWeek } from "../../shared/helpers/dates.js";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getDoctors } from "../../doctors/services/doctorsService.js";
import { getSpecialties } from "../../specialties/services/specialtiesService.js";
import WeekSlotsGrid from "../components/WeekSlotsGrid.jsx";
import { useDoctorSlots } from "../hooks/useDoctorSlots.js";

function BookAppointmentPage() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [optionsError, setOptionsError] = useState("");
  const [searchedDoctor, setSearchedDoctor] = useState(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);

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
              onSelect={setSelectedSlot}
              onPrevWeek={() => moveWeek(-7)}
              onNextWeek={() => moveWeek(7)}
              canGoPrev={canGoPrev}
            />
          )}
        </>
      )}
    </section>
  );
}

export default BookAppointmentPage;