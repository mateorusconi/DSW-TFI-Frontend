function Input({
  id,
  label,
  type = "text",
  error = "",
  icon: Icon,
  className = "",
  ...inputProps
}) {
  const hasError = error !== "";
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id}>{label}</label>

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
          type={type}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`min-h-10 w-full px-3 aria-invalid:border-red-600 ${Icon ? "pl-10" : ""} ${className}`}
        />
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