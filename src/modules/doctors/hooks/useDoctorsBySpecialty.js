import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getDoctors } from "../services/doctorsService.js";

// Médicos de una especialidad. Se vuelve a pedir cada vez que cambia specialtyId.
export function useDoctorsBySpecialty(specialtyId) {
  const [result, setResult] = useState({
    specialtyId: null,
    doctors: [],
    error: "",
  });

  useEffect(() => {
    if (!specialtyId) return;

    let active = true;

    getDoctors({ pageIndex: 1, pageSize: 100, specialtyId })
      .then((page) => {
        if (active) setResult({ specialtyId, doctors: page.data, error: "" });
      })
      .catch((error) => {
        if (active) {
          setResult({
            specialtyId,
            doctors: [],
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [specialtyId]);

  // Mientras llega la respuesta de la especialidad nueva no se muestran los médicos de la anterior
  const isCurrent = result.specialtyId === specialtyId;

  return {
    doctors: isCurrent ? result.doctors : [],
    error: isCurrent ? result.error : "",
  };
}
