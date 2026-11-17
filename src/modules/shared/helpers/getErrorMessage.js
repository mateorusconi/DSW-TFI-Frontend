import { ApiError, toApiError } from "../api/apiError.js";

const CODE_MESSAGES = {
  NETWORK_ERROR: "No se pudo conectar con el servidor.",
  AUTHENTICATION_FAILED: "No se pudo iniciar sesión con esos datos.",
  AUTHORIZATION_FAILED: "No tenés permisos para esta operación.",
  VALIDATION_ERROR: "Revisá los datos ingresados.",
  ENTITY_NOTFOUND: "El registro ya no existe.",
  SPECIALITY_NAME_CONFLICT: "Ya existe una especialidad con ese nombre.",
  DOCTOR_LICENSE_CONFLICT: "Ya existe un médico con esa matrícula.",
  AVAILABILITY_CONFLICT: "El horario se superpone con una disponibilidad existente.",
  APPOINTMENT_CONFLICT: "Ese turno ya fue tomado. Elegí otro.",
  APPOINTMENT_PAST_DATE: "No se pueden reservar turnos en el pasado.",
  APPOINTMENT_INVALID_STATE: "Este turno no permite realizar esa operación.",
  RATE_LIMIT_EXCEEDED: "Demasiados intentos. Esperá antes de reintentar.",
};

const HTTP_MESSAGES = {
  400: "Revisá los datos ingresados.",
  401: "No se pudo autenticar la solicitud.",
  403: "No tenés permisos para esta operación.",
  404: "No se encontró el recurso solicitado.",
  409: "La operación entra en conflicto con los datos existentes.",
  429: "Demasiados intentos. Esperá antes de reintentar.",
};

export function getErrorMessage(
  error,
  fallback = "Ocurrió un error inesperado.",
) {
  const apiError = toApiError(error);

  // El conversor conserva las cancelaciones sin transformarlas en ApiError.
  if (!(apiError instanceof ApiError)) {
    return "";
  }

  if (apiError.status >= 500) {
    return "El servicio no pudo completar la solicitud. Intentá más tarde.";
  }

  return (
    CODE_MESSAGES[apiError.errorCode] ??
    HTTP_MESSAGES[apiError.status] ??
    fallback
  );
}