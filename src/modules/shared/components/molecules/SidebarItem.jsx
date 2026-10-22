import { NavLink } from 'react-router-dom'

/**
 * Molécula: SidebarItem
 * Conceptos aplicados:
 * - Atomic Design: molécula (ícono + texto + link), "do one thing and do it well".
 * - Props: componente puro que recibe to, icon, label, onClick y end.
 * - React Router NavLink: className como función de isActive para resaltar la ruta activa.
 *   `end` evita que el ítem del Panel (/admin) quede activo en todas las subrutas.
 * - Tailwind: solo tokens del @theme (primary-*) y slate-* (convención del equipo).
 */
function SidebarItem({ to, icon: Icon, label, onClick, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
            }
        >
            {/* El ícono llega como componente (prop renombrada a mayúscula para usarla en JSX) */}
            {Icon && <Icon className="w-5 h-5 shrink-0" />}
            <span className="truncate">{label}</span>
        </NavLink>
    )
}

export default SidebarItem
