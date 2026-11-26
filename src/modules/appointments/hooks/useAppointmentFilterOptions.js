import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getAppointmentFilterOptions } from "../services/adminAppointmentsService.js";

const INITIAL_STATE = {
  specialties: [],
  doctors: [],
  loading: true,
  error: "",
};

export function useAppointmentFilterOptions() {
  const [options, setOptions] = useState(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const catalogs = await getAppointmentFilterOptions();
        if (active) {
          setOptions({ ...catalogs, loading: false, error: "" });
        }
      } catch (error) {
        if (active) {
          setOptions({
            ...INITIAL_STATE,
            loading: false,
            error: getErrorMessage(error),
          });
        }
      }
    }

    loadOptions();
    return () => {
      active = false;
    };
  }, [attempt]);

  function reload() {
    setOptions(INITIAL_STATE);
    setAttempt((current) => current + 1);
  }

  return { ...options, reload };
}
