import "./Input.css";

function Input({
  id,
  label,
  type = "text",
  error = "",
  ...inputProps
}) {
  const hasError = error !== "";
  const errorId = `${id}-error`;

  return (
    <div className="shared-input">
      <label htmlFor={id}>{label}</label>

      <input
        {...inputProps}
        id={id}
        type={type}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />

      {hasError && (
        <p
          id={errorId}
          className="shared-input__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;