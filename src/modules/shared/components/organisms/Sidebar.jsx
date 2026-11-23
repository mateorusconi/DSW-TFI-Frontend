import { LayoutGrid, BriefcaseMedical, SquarePlus, UserSearch, LogOut } from 'lucide-react'
import SidebarItem from '../molecules/SidebarItem'
import { PATHS } from '../../../../router/paths'
import { getInitials } from '../../helpers/initials'

/**
 * Organismo: Sidebar (menú lateral del administrador)
 * Conceptos aplicados:
 * - Atomic Design: organismo compuesto por moléculas SidebarItem (diapositiva: "el Sidebar es un organismo").
 * - Listas con .map y key estable (la ruta `to`, que es única).
 * - SOLID D: no sabe cómo se cierra la sesión ni quién está logueado; recibe `onLogout` y `email` del template.
 * - Hijo → padre: `onNavigate` avisa al layout que se eligió un ítem (para cerrar el menú en mobile).
 * - HTML semántico: <aside> + <nav>.
 * - Ítems, íconos y bloque de usuario al pie según el mockup del TPI (v1.4).
 */
const ITEMS = [
    { to: PATHS.adminHome, icon: LayoutGrid, label: 'Tablero', end: true },
    { to: PATHS.doctors, icon: BriefcaseMedical, label: 'Doctores' },
    { to: PATHS.specialties, icon: SquarePlus, label: 'Especialidades' },
    { to: PATHS.appointmentsSearch, icon: UserSearch, label: 'Búsqueda de Pacientes' },
]

function Sidebar({ email, onLogout, onNavigate }) {

    return (
        <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-6">
                <p className="text-lg font-bold text-primary-700">Admin Portal</p>
                <p className="text-sm text-slate-500">Healthcare Management</p>
            </div>

            <nav aria-label="Menú principal" className="flex-1 space-y-1 overflow-y-auto py-4 pl-3">
                {ITEMS.map((item) => (
                    <SidebarItem key={item.to} {...item} onClick={onNavigate} />
                ))}
            </nav>

            <div className="border-t border-slate-200 px-3 py-3">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    Cerrar Sesión
                </button>
            </div>

            {/* Bloque de usuario: iniciales del email en un círculo, como "AD / Admin User" del mockup */}
            <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-4">
                <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700"
                >
                    {getInitials(email)}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{email}</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
