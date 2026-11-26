import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { toLocalISODate } from "../../shared/helpers/dates.js";
import { BOOKING_WEEK_DAYS, getBookingDay } from "../helpers/bookingWeek.js";
import { getDoctorSlots } from "../services/bookingService.js";

// Trae los bloques que informó la API para la semana del médico.
export function useDoctorSlots(doctorId, weekStart) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, slots: [], error: "" });

  // Identifica el pedido actual: si cambia el médico, la semana o se reintenta, es otro pedido
  const from = toLocalISODate(weekStart);
  const to = toLocalISODate(getBookingDay(weekStart, BOOKING_WEEK_DAYS - 1));
  const key = doctorId ? `${doctorId}|${from}|${attempt}` : null;

  useEffect(() => {
    if (!doctorId) return;

    const controller = new AbortController();

    getDoctorSlots(doctorId, from, to, controller.signal)
      .then((slots) => {
        if (!controller.signal.aborted) setResult({ key, slots, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ key, slots: [], error: getErrorMessage(error) });
        }
      });

    return () => controller.abort();
  }, [doctorId, from, to, key]);

  const loading = key !== null && result.key !== key;

  return {
    slots: key && !loading ? result.slots : [],
    loading,
    error: key && !loading ? result.error : "",
    reload: () => setAttempt((current) => current + 1),
  };
}
