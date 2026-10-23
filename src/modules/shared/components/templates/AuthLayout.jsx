import { Outlet } from 'react-router-dom'

/**
 * Template: AuthLayout (marco de las pantallas de login)
 * Conceptos aplicados:
 * - Atomic Design: template; la tarjeta centrada es el marco y el login entra por <Outlet />.
 * - Flexbox para centrar: min-h-svh + flex items-center justify-center.
 * - Tailwind mobile first: en celular la tarjeta ocupa casi todo el ancho (w-full + px-4);
 *   en pantallas grandes se limita con max-w-md (~420px).
 * - Mismo fondo y tarjeta que los logins actuales (LoginPatientPageStyle.css).
 */
// La foto no es un color ni un token: va por style porque Tailwind no arma clases con variables
const BACKGROUND_URL = 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=870&auto=format&fit=crop'

function AuthLayout() {
    return (
        <main
            className="flex min-h-svh items-center justify-center bg-primary-700 bg-cover bg-center px-4 py-6"
            style={{ backgroundImage: `url(${BACKGROUND_URL})` }}
        >
            <section className="w-full max-w-md rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
                <Outlet />
            </section>
        </main>
    )
}

export default AuthLayout