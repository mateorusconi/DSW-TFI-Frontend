import { Menu } from 'lucide-react'

/**
 * Organismo: AdminHeader (barra superior, solo en celular)
 * Conceptos aplicados:
 * - Atomic Design: organismo (diapositiva: "el Header es un organismo").
 * - Hijo → padre: el botón ☰ llama a `onToggleMenu`; el estado del menú vive en el template.
 * - Tailwind mobile first: se ve por defecto y `md:hidden` lo oculta desde 768px
 *   (en desktop el sidebar ya está fijo, como en el dashboard del Ej. 20/22).
 * - Accesibilidad: aria-label porque el botón solo tiene un ícono.
 */
function AdminHeader({ onToggleMenu }) {
    return (
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            <button
                type="button"
                onClick={onToggleMenu}
                aria-label="Abrir menú"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
                <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-primary-700">Admin Portal</span>
        </header>
    )
}

export default AdminHeader