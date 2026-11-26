function Textarea({
  id,
  label,
  error = "",
  maxLength,
  currentLength,
  className = "",
  ...textareaProps
}) {
  const hasError = error !== "";
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
      </label>

      <textarea
        rows={4}
        {...textareaProps}
        id={id}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`w-full resize-y p-3 aria-invalid:border-red-600 ${className}`}
      />

      {hasError && (
        <p id={errorId} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {currentLength !== undefined && (
        <p className="text-right text-xs text-slate-500">
          {currentLength}/{maxLength}
        </p>
      )}
    </div>
  );
}

export default Textarea;
