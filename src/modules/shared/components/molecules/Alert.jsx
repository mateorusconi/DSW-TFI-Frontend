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
        <button
          type="button"
          onClick={onAction}
          className="rounded-md border border-current px-3 py-1 text-sm hover:bg-white/60"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default Alert;