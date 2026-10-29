import axios from "axios";

export function getValidationErrors(error) {
  if (
    !axios.isAxiosError(error) ||
    error.response?.status !== 400
  ) {
    return {};
  }

  const details = error.response.data?.details;

  if (!Array.isArray(details)) {
    return {};
  }

  const validDetails = details.filter(
    (detail) =>
      typeof detail?.field === "string" &&
      detail.field.trim() !== "" &&
      typeof detail?.issue === "string" &&
      detail.issue.trim() !== ""
  );

  return Object.fromEntries(
    validDetails.map(({ field, issue }) => [
      field,
      issue === "required" ? "Este campo es obligatorio." : issue,
    ])
  );
}