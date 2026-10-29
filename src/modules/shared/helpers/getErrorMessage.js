import axios from "axios";

const HTTP_MESSAGES = {
  400: "Revisá los datos ingresados.",
  401: "No se pudo autenticar la solicitud.",
  403: "No tenés permisos para realizar esta acción.",
  404: "No se encontró el recurso solicitado.",
  409: "La operación entra en conflicto con los datos existentes.",
  429: "Realizaste demasiadas solicitudes. Esperá antes de reintentar.",
};

export function getErrorMessage(
  error,
  fallback = "Ocurrió un error inesperado.",
) {
  if (axios.isCancel(error)) {
    return "";
  }

  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "El servidor tardó demasiado en responder.";
  }

  if (error.response) {
    const status = error.response.status;

    if (status >= 500) {
      return "El servicio no pudo completar la solicitud. Intentá más tarde.";
    }

    const message = error.response.data?.message;

    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }

    return HTTP_MESSAGES[status] ?? fallback;
  }

  if (error.request || error.code === "ERR_NETWORK") {
    return "No se pudo obtener una respuesta del servidor.";
  }

  return fallback;
}
