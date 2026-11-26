export const DAYS = [
  { key: "LUNES", label: "Lunes" },
  { key: "MARTES", label: "Martes" },
  { key: "MIÉRCOLES", label: "Miércoles" },
  { key: "JUEVES", label: "Jueves" },
  { key: "VIERNES", label: "Viernes" },
  { key: "SÁBADO", label: "Sábado" },
  { key: "DOMINGO", label: "Domingo" },
];

const knownDays = new Set(DAYS.map(({ key }) => key));
const API_TIME = /^((?:[01]\d|2[0-3]):[0-5]\d)(?::00)?$/;
const HALF_HOUR_TIME = /^(?:[01]\d|2[0-3]):(?:00|30)$/;

export class UnsupportedScheduleError extends Error {}

export function fromApi(list) {
  if (!Array.isArray(list)) {
    throw new UnsupportedScheduleError("No se pudo leer el horario guardado.");
  }

  const rangesByDay = new Map();

  for (const range of list) {
    const day = range?.day?.trim()?.toUpperCase();
    const startTime = API_TIME.exec(range?.startTime)?.[1];
    const endTime = API_TIME.exec(range?.endTime)?.[1];

    if (!knownDays.has(day) || !startTime || !endTime) {
      throw new UnsupportedScheduleError(
        "El horario guardado tiene un formato que esta pantalla no puede editar.",
      );
    }
    if (rangesByDay.has(day)) {
      throw new UnsupportedScheduleError(
        "Este médico tiene más de un rango en un mismo día. Esta pantalla admite uno; no se modificó su horario.",
      );
    }

    rangesByDay.set(day, { day, active: true, startTime, endTime });
  }

  return DAYS.map(
    ({ key }) =>
      rangesByDay.get(key) ?? {
        day: key,
        active: false,
        startTime: "08:00",
        endTime: "16:00",
      },
  );
}

export function validateDays(days) {
  const selected = days.filter(({ active }) => active);
  const errors = {};

  for (const { day, startTime, endTime } of selected) {
    if (!startTime || !endTime) {
      errors[day] = "Ingresá el horario de entrada y salida.";
    } else if (
      !HALF_HOUR_TIME.test(startTime) ||
      !HALF_HOUR_TIME.test(endTime)
    ) {
      errors[day] = "Elegí horarios que terminen en :00 o :30.";
    } else if (startTime >= endTime) {
      errors[day] = "La salida debe ser posterior a la entrada.";
    }
  }

  return { errors, message: selected.length ? "" : "Activá al menos un día." };
}

export function toApi(doctorId, days) {
  return {
    doctorId,
    days: days
      .filter(({ active }) => active)
      .map(({ day, startTime, endTime }) => ({
        day,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      })),
  };
}
