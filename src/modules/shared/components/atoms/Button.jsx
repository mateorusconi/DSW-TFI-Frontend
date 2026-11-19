import { LoaderCircle } from "lucide-react";

// SOLID O: cada variante es una entrada del objeto; sumar una no cambia el componente
const VARIANTS = {
  primary: "bg-sky-900 text-white hover:bg-sky-800",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-red-700 text-white hover:bg-red-800",
  ghost: "text-slate-600 hover:bg-slate-100",
};

function Button({
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={18} aria-hidden="true" />
      )}
      {loading ? "Procesando..." : children}
    </button>
  );
}

export default Button;