import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Página no encontrada</h1>
      <p className="text-slate-500">La dirección que buscás no existe.</p>
      <Link to="/" className="font-medium text-primary-700 hover:underline">
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFoundPage
