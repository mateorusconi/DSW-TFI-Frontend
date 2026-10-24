import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * Molécula: PageHeader
 * Conceptos aplicados:
 * - Atomic Design: molécula reutilizada por todas las páginas de admin (mismo encabezado en todas).
 * - Props: title obligatorio; subtitle, breadcrumb ([{ label, to }]) y actions son opcionales.
 * - Renderizado condicional con && (si no llega la prop, no se dibuja esa parte).
 * - Listas con .map y key estable (label + índice de posición, no aleatoria).
 * - SOLID O (composición): `actions` recibe cualquier JSX (botones), el header no sabe cuáles son.
 * - Tailwind mobile first: en celular las acciones bajan debajo del título (flex-col);
 *   desde md: van a la derecha (md:flex-row).
 * - HTML semántico: <header>, <nav aria-label="breadcrumb"> y <ol> para las migas.
 */
function PageHeader({ title, subtitle, breadcrumb, actions }) {
    return (
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
                {breadcrumb && breadcrumb.length > 0 && (
                    <nav aria-label="breadcrumb" className="mb-1">
                        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
                            {breadcrumb.map((crumb, index) => {
                                const isLast = index === breadcrumb.length - 1
                                return (
                                    <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                                        {/* La última miga es la página actual: va sin link */}
                                        {crumb.to && !isLast ? (
                                            <Link to={crumb.to} className="hover:text-primary-600 hover:underline">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className={isLast ? 'text-slate-700' : ''}>{crumb.label}</span>
                                        )}
                                        {!isLast && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
                                    </li>
                                )
                            })}
                        </ol>
                    </nav>
                )}

                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>

            {actions && <div className="flex flex-wrap gap-2 md:shrink-0">{actions}</div>}
        </header>
    )
}

export default PageHeader
