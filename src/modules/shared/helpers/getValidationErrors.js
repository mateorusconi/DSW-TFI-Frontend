import { ApiError, toApiError } from "../api/apiError.js";

export function getValidationErrors(error) {
  const apiError = toApiError(error);

  if (!(apiError instanceof ApiError) || apiError.status !== 400) {
    return {};
  }

  const validDetails = apiError.details.filter(
    (detail) =>
      typeof detail?.field === "string" &&
      detail.field.trim() !== "" &&
      typeof detail?.issue === "string" &&
      detail.issue.trim() !== "",
  );

  return Object.fromEntries(
    validDetails.map(({ field, issue }) => {
      const fieldName = field.trim();
      const normalizedField =
        fieldName.charAt(0).toLowerCase() + fieldName.slice(1);

      return [
        normalizedField,
        issue === "required" ? "Este campo es obligatorio." : issue,
      ];
    }),
  );
}