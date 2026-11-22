import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, BriefcaseMedical } from 'lucide-react'
import { PATHS } from '../../../../router/paths'
import { getInitials } from '../../helpers/initials'

/**
 * Organismo: PatientNavbar (barra superior del paciente)
 * Conceptos aplicados:
 * - Atomic Design: organismo (una sección completa de la pantalla).
 * - React Router NavLink: className como función de isActive para resaltar la ruta actual.
 * - Estado local con useState: el menú ☰ solo le importa al navbar, así que el estado vive acá.
 * - SOLID D: recibe `email` y `onLogout` por props; no sabe de dónde salen (useAuth en el template).
 * - Tailwind mobile first: en celular los links van en el menú desplegable;
 *   desde md: se ven en la barra (`hidden md:flex`).
 * - Diseño según el mockup v1.4: logo "Portal Salud", link activo relleno, iniciales y botón "Salir".
 *   La campana del mockup no se agrega porque el enunciado deja afuera las notificaciones.
 */
const LINKS = [
    { to: PATHS.bookAppointment, label: 'Reservar Turno' },
    { to: PATHS.myAppointments, label: 'Mis Turnos' },
]

// La misma regla de resaltado sirve para los links de desktop y los del menú mobile
const linkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
        ? 'bg-primary-700 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

const logoutClass = 'rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600'

function UserBadge({ email }) {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700"
            >
                {getInitials(email)}
            </span>
            <span className="truncate text-sm font-semibold text-slate-900">{email}</span>
        </div>
    )
}

function PatientNavbar({ email, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-3">
                <span className="flex items-center gap-2 text-lg font-bold text-primary-700">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white">
                        <BriefcaseMedical className="h-5 w-5" aria-hidden="true" />
                    </span>
                    Portal Salud
                </span>

                {/* Desktop: links en la barra */}
                <nav aria-label="Menú del paciente" className="hidden flex-1 gap-2 md:flex">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={linkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto hidden items-center gap-4 md:flex">
                    <UserBadge email={email} />
                    <button type="button" onClick={onLogout} className={logoutClass}>
                        Salir
                    </button>
                </div>

                {/* Mobile: botón ☰ (aria-expanded avisa si el menú está abierto) */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuOpen}
                    className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile: menú desplegable, se cierra al elegir un link */}
            {menuOpen && (
                <nav aria-label="Menú del paciente" className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 md:hidden">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={linkClass} onClick={closeMenu}>
                            {link.label}
                        </NavLink>
                    ))}
                    <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                        <UserBadge email={email} />
                        <button type="button" onClick={onLogout} className={logoutClass}>
                            Salir
                        </button>
                    </div>
                </nav>
            )}
        </header>
    )
}

export default PatientNavbar
