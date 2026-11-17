import axios from "axios";

export class ApiError extends Error {
  constructor({ status, errorCode, message, details = [] }) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.details = Array.isArray(details) ? details : [];
  }
}

export function toApiError(error) {
  if (error instanceof ApiError || axios.isCancel(error)) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      status: 0,
      errorCode: "UNHANDLED_ERROR",
      message: "Ocurrió un error inesperado.",
    });
  }

  if (!error.response) {
    return new ApiError({
      status: 0,
      errorCode: "NETWORK_ERROR",
      message: "No se pudo conectar con el servidor.",
    });
  }

  const { status, data } = error.response;

  return new ApiError({
    status,
    errorCode:
      typeof data?.errorCode === "string" ? data.errorCode : "UNHANDLED_ERROR",
    message:
      typeof data?.message === "string"
        ? data.message
        : "El servidor devolvió una respuesta inesperada.",
    details: data?.details,
  });
}