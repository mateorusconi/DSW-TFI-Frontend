import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { PATHS } from '../../../../router/paths'

/**
 * Organismo: PatientNavbar (barra superior del paciente)
 * Conceptos aplicados:
 * - Atomic Design: organismo (una sección completa de la pantalla).
 * - React Router NavLink: className como función de isActive para resaltar la ruta actual.
 * - Estado local con useState: el menú ☰ solo le importa al navbar, así que el estado vive acá.
 * - SOLID D: recibe `email` y `onLogout` por props; no sabe de dónde salen (después, de useAuth).
 * - Tailwind mobile first: en celular los links van en el menú desplegable;
 *   desde md: se ven en la barra (`hidden md:flex`).
 * - Listas con .map y key estable (la ruta `to`).
 */
const LINKS = [
    { to: PATHS.bookAppointment, label: 'Reservar turno' },
    { to: PATHS.myAppointments, label: 'Mis turnos' },
]

// La misma regla de resaltado sirve para los links de desktop y los del menú mobile
const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm transition-colors ${isActive
        ? 'bg-primary-50 font-semibold text-primary-700'
        : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

const logoutClass = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600'

function PatientNavbar({ email, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
                <span className="text-lg font-bold text-primary-700">MedPortal</span>

                {/* Desktop: links en la barra */}
                <nav aria-label="Menú del paciente" className="hidden flex-1 gap-1 md:flex">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} className={linkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto hidden items-center gap-3 md:flex">
                    <span className="text-sm text-slate-500">{email}</span>
                    <button type="button" onClick={onLogout} className={logoutClass}>
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
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
                    <p className="px-3 pt-2 text-sm text-slate-500">{email}</p>
                    <button type="button" onClick={onLogout} className={logoutClass}>
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                    </button>
                </nav>
            )}
        </header>
    )
}

export default PatientNavbar