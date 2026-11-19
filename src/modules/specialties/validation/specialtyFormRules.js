export const SPECIALTY_NAME_RULES = {
  setValueAs: (value) => value.trim(),
  required: "El nombre es obligatorio.",
  minLength: {
    value: 3,
    message: "El nombre debe tener al menos 3 caracteres.",
  },
  maxLength: {
    value: 100,
    message: "El nombre no puede superar los 100 caracteres.",
  },
};

export const SPECIALTY_DESCRIPTION_RULES = {
  setValueAs: (value) => value.trim(),
  required: "La descripción es obligatoria.",
  minLength: {
    value: 10,
    message: "La descripción debe tener al menos 10 caracteres.",
  },
  maxLength: {
    value: 100,
    message: "La descripción no puede superar los 100 caracteres.",
  },
};
