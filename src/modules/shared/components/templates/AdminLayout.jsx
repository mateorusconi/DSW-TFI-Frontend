import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../organisms/Sidebar'
import AdminHeader from '../organisms/AdminHeader'

/**
 * Template: AdminLayout (marco de todas las pantallas del administrador)
 * Conceptos aplicados:
 * - Atomic Design: template, define dónde va cada cosa pero no el contenido.
 * - React Router: <Outlet /> es el hueco donde se dibuja la página de la ruta hija;
 *   al navegar solo cambia el Outlet, el sidebar no se vuelve a montar.
 * - Estado en el padre: `menuOpen` vive acá; AdminHeader lo abre y Sidebar lo cierra (hijo → padre).
 * - Tailwind mobile first: en celular el sidebar es un panel fijo que entra con translate-x;
 *   desde md: queda siempre visible a la izquierda (como el dashboard del Ej. 20/22).
 * - HTML semántico: <main> para el contenido.
 */
function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)
    // shortcut: logout vacío hasta SCRUM-23; ahí va useAuth().logout + navigate(PATHS.adminLogin)
    const handleLogout = () => {}

    return (
        <div className="min-h-screen bg-slate-50 md:flex">
            {/* Fondo oscuro detrás del menú, solo en celular y con el menú abierto */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 z-40 transition-transform md:sticky md:top-0 md:h-screen md:shrink-0 md:translate-x-0 ${
                    menuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar onLogout={handleLogout} onNavigate={closeMenu} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader onToggleMenu={() => setMenuOpen((open) => !open)} />
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout