import { useLocation } from 'react-router-dom'
import { LayoutDashboard, Stethoscope, Activity, Clock, Search, LogOut } from 'lucide-react'
import SidebarItem from '../molecules/SidebarItem'
import { PATHS } from '../../../../router/paths'

/**
 * Organismo: Sidebar (menú lateral del administrador)
 * Conceptos aplicados:
 * - Atomic Design: organismo compuesto por moléculas SidebarItem (diapositiva: "el Sidebar es un organismo").
 * - Listas con .map y key estable (la ruta `to`, que es única).
 * - SOLID D: no sabe cómo se cierra la sesión; recibe `onLogout` del template.
 * - Hijo → padre: `onNavigate` avisa al layout que se eligió un ítem (para cerrar el menú en mobile).
 * - HTML semántico: <aside> + <nav>.
 */
function Sidebar({ onLogout, onNavigate }) {
    const { pathname } = useLocation()

    // Disponibilidad cuelga de /admin/medicos: sin esto se resaltarían "Médicos" y "Disponibilidad" a la vez.
    const isAvailability = pathname.endsWith('/disponibilidad')

    const items = [
        { to: PATHS.adminHome, icon: LayoutDashboard, label: 'Panel', end: true },
        { to: PATHS.doctors, icon: Stethoscope, label: 'Médicos', active: pathname.startsWith(PATHS.doctors) && !isAvailability },
        { to: PATHS.specialties, icon: Activity, label: 'Especialidades' },
        { to: PATHS.availability, icon: Clock, label: 'Disponibilidad', active: isAvailability },
        { to: PATHS.appointmentsSearch, icon: Search, label: 'Turnos' },
    ]

    return (
        <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
            <div className="px-5 py-6">
                <p className="text-lg font-bold text-primary-700">Admin Portal</p>
                <p className="text-xs text-slate-500">Healthcare Management</p>
            </div>

            <nav aria-label="Menú principal" className="flex-1 space-y-1 overflow-y-auto px-3">
                {items.map((item) => (
                    <SidebarItem key={item.to} {...item} onClick={onNavigate} />
                ))}
            </nav>

            <div className="border-t border-slate-200 p-3">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}

export default Sidebar