// Mismo contrato que el átomo Input (id, label, error) para que los formularios usen los dos igual.
// Con placeholder={null} no se agrega la opción vacía (para selects que siempre tienen un valor).
function Select({
  id,
  label,
  options,
  placeholder = "Seleccione...",
  error = "",
  className = "",
  ...selectProps
}) {
  const hasError = error !== "";
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>

      <select
        {...selectProps}
        id={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`min-h-10 w-full px-3 aria-invalid:border-red-600 ${className}`}
      >
        {placeholder !== null && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <p id={errorId} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
