import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { toLocalISODate } from "../../shared/helpers/dates.js";
import { getDoctorSlots } from "../services/bookingService.js";

// Trae los horarios libres de un médico para la semana (lunes a viernes) que empieza en weekStart
export function useDoctorSlots(doctorId, weekStart) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, slots: [], error: "" });

  // Identifica el pedido actual: si cambia el médico, la semana o se reintenta, es otro pedido
  const key = doctorId ? `${doctorId}|${toLocalISODate(weekStart)}|${attempt}` : null;

  useEffect(() => {
    if (!doctorId) return;

    let active = true;
    const friday = new Date(weekStart);
    friday.setDate(friday.getDate() + 4);

    getDoctorSlots(doctorId, toLocalISODate(weekStart), toLocalISODate(friday))
      .then((slots) => {
        if (active) setResult({ key, slots, error: "" });
      })
      .catch((error) => {
        if (active) setResult({ key, slots: [], error: getErrorMessage(error) });
      });

    return () => {
      active = false;
    };
  }, [doctorId, weekStart, key]);

  const loading = key !== null && result.key !== key;

  return {
    slots: loading ? [] : result.slots,
    loading,
    error: loading ? "" : result.error,
    reload: () => setAttempt((current) => current + 1),
  };
}