import { getValidationErrors } from "./getValidationErrors.js";

export function applyFieldErrors(error, setError, allowedFields) {
  const fieldErrors = getValidationErrors(error);
  let applied = false;

  for (const [field, message] of Object.entries(fieldErrors)) {
    if (allowedFields && !allowedFields.includes(field)) {
      continue;
    }

    setError(field, {
      type: "server",
      message,
    });

    applied = true;
  }

  return applied;
}