import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import {
  cancelAppointment,
  getMyAppointments,
} from "../services/myAppointmentsService.js";

function sortByDate(appointments) {
  return [...appointments].sort(
    (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt),
  );
}

// Turnos activos del paciente: carga, reintento y cancelación.
export function useMyAppointments(dni) {
  const [loadId, setLoadId] = useState(0);
  const [result, setResult] = useState({ loadId: -1, items: [], error: "" });

  useEffect(() => {
    let active = true;

    getMyAppointments(dni)
      .then((data) => {
        if (active) setResult({ loadId, items: sortByDate(data), error: "" });
      })
      .catch((error) => {
        if (active) {
          setResult({ loadId, items: [], error: getErrorMessage(error) });
        }
      });

    return () => {
      active = false;
    };
  }, [dni, loadId]);

  function reload() {
    setLoadId((current) => current + 1);
  }

  // Si la API acepta la cancelación, se quita el turno de la lista sin volver a pedirla.
  // Si falla, el error sube a la página para que decida qué mostrar.
  async function cancel(appointmentId) {
    await cancelAppointment(appointmentId);
    setResult((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== appointmentId),
    }));
  }

  return {
    appointments: result.items,
    loading: result.loadId !== loadId,
    error: result.error,
    reload,
    cancel,
  };
}
