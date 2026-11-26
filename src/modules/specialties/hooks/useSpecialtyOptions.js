import { useEffect, useState } from "react";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getSpecialties } from "../services/specialtiesService.js";

// Especialidades para llenar un <Select>. Lo usan el alta de médicos y la reserva de turnos.
export function useSpecialtyOptions() {
  const [result, setResult] = useState({
    specialties: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;

    // shortcut: trae hasta 100 especialidades; si crecen, pedir al back un endpoint sin paginar
    getSpecialties({ pageIndex: 1, pageSize: 100 })
      .then((page) => {
        if (active) {
          setResult({ specialties: page.data, loading: false, error: "" });
        }
      })
      .catch((error) => {
        if (active) {
          setResult({
            specialties: [],
            loading: false,
            error: getErrorMessage(error),
          });
        }
      });

    // Cleanup: si la página se desmonta antes de la respuesta, no se toca el estado
    return () => {
      active = false;
    };
  }, []);

  return result;
}
