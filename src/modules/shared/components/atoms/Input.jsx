import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Input({
  id,
  label,
  type = "text",
  error = "",
  icon: Icon,
  revealable = false,
  className = "",
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);
  const hasError = error !== "";
  const errorId = `${id}-error`;
  // `revealable` agrega el ojito para ver lo escrito en un campo oculto (contraseña o DNI)
  const canReveal = revealable && type === "password";
  const inputType = canReveal && visible ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          {...inputProps}
          id={id}
          type={inputType}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`min-h-10 w-full px-3 aria-invalid:border-red-600 ${Icon ? "pl-10" : ""} ${canReveal ? "pr-10" : ""} ${className}`}
        />

        {canReveal && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
            aria-pressed={visible}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
          >
            {visible ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p id={errorId} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
