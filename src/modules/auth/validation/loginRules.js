export const emailRules = {
  required: "El email es obligatorio.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Ingresá un email válido.",
  },
};

export const passwordRules = {
  required: "La contraseña es obligatoria.",
  minLength: {
    value: 8,
    message: "La contraseña debe tener al menos 8 caracteres.",
  },
};

export const dniRules = {
  required: "El DNI es obligatorio.",
  pattern: {
    value: /^[1-9][0-9]{6,7}$/,
    message:
      "Ingresá un DNI de 7 u 8 dígitos, sin puntos ni espacios y sin cero inicial.",
  },
};
