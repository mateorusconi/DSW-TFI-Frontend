import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../router/paths.js";
import Button from "../../shared/components/atoms/Button.jsx";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import {
  DAYS,
  fromApi,
  toApi,
  UnsupportedScheduleError,
  validateDays,
} from "../helpers/availabilityMapper.js";
import {
  createAvailabilities,
  getDoctorAvailabilities,
  updateAvailabilities,
} from "../services/availabilitiesService.js";
import DayScheduleRow from "./DayScheduleRow.jsx";

function getScheduleError(error) {
  if (error instanceof UnsupportedScheduleError) return error.message;
  if (
    error?.details?.some(
      ({ issue }) => issue === "no_future_slots_available_in_current_month",
    )
  ) {
    return "No quedan días de este mes para los días de la semana seleccionados.";
  }
  return getErrorMessage(error);
}

export default function AvailabilitySchedule({ doctorId }) {
  const [schedule, setSchedule] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSchedule() {
      try {
        const list = await getDoctorAvailabilities(doctorId, controller.signal);
        if (!controller.signal.aborted) {
          setSchedule({ days: fromApi(list), exists: list.length > 0 });
        }
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(getScheduleError(error));
      }
    }

    loadSchedule();
    return () => controller.abort();
  }, [doctorId, attempt]);

  function retry() {
    setLoadError("");
    setAttempt((current) => current + 1);
  }

  function changeDay(day, nextValue) {
    setSaved(false);
    setSaveError("");
    setSchedule((current) => ({
      ...current,
      days: current.days.map((entry) =>
        entry.day === day ? nextValue : entry,
      ),
    }));
  }

  async function saveSchedule(event) {
    event.preventDefault();
    if (!schedule || saving) return;
    setSubmitted(true);
    setSaved(false);
    setSaveError("");
    const { errors, message } = validateDays(schedule.days);
    if (message || Object.keys(errors).length) return;

    const save = schedule.exists ? updateAvailabilities : createAvailabilities;
    setSaving(true);
    try {
      await save(toApi(doctorId, schedule.days));
      setSchedule((current) => ({ ...current, exists: true }));
      setSubmitted(false);
      setSaved(true);
    } catch (error) {
      setSaveError(getScheduleError(error));
    } finally {
      setSaving(false);
    }
  }

  const validation = submitted && schedule ? validateDays(schedule.days) : null;

  return (
    <section className="min-w-0 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold">Configuración de horarios</h2>
        <p className="text-sm text-slate-600">
          Intervalos automáticos de 30 minutos.
        </p>
      </div>

      {loadError ? (
        <Alert variant="error" actionLabel="Volver a cargar" onAction={retry}>
          {loadError}
        </Alert>
      ) : !schedule ? (
        <p role="status" className="flex items-center gap-2">
          <Spinner /> Cargando horario…
        </p>
      ) : (
        <form
          onSubmit={saveSchedule}
          className="space-y-4"
          aria-busy={saving}
          noValidate
        >
          {DAYS.map(({ key, label }, index) => (
            <DayScheduleRow
              key={key}
              dayLabel={label}
              value={schedule.days[index]}
              onChange={(value) => changeDay(key, value)}
              error={validation?.errors[key]}
              disabled={saving}
            />
          ))}
          {validation?.message && (
            <Alert variant="error">{validation.message}</Alert>
          )}
          {saveError && <Alert variant="error">{saveError}</Alert>}
          {saved && (
            <Alert variant="success">
              Disponibilidad guardada. Se actualizaron los horarios libres hasta
              fin de mes.
            </Alert>
          )}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              to={PATHS.doctors}
              className="px-4 py-2 text-sm text-sky-900 underline"
            >
              Cancelar
            </Link>
            <Button type="submit" loading={saving}>
              Guardar disponibilidad
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
