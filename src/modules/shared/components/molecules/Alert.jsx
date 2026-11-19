import Button from "../atoms/Button.jsx";

// SOLID O: cada tipo de aviso se define acá; para sumar uno nuevo se agrega una entrada, sin tocar el componente
const VARIANTS = {
  success: {
    role: "status",
    className: "border-green-200 bg-green-50 text-green-800",
  },
  error: {
    role: "alert",
    className: "border-red-200 bg-red-50 text-red-800",
  },
  warning: {
    role: "alert",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
};

function Alert({ variant = "error", children, actionLabel, onAction }) {
  const { role, className } = VARIANTS[variant];

  return (
    <div
      role={role}
      className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border p-4 ${className}`}
    >
      <p>{children}</p>

      {onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default Alert;
