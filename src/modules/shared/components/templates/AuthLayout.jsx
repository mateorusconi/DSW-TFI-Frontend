import { ShieldCheck } from "lucide-react";

// Marco de los logins según el mockup v1.4: logo arriba, tarjeta blanca y un link debajo.
// `footer` es la franja clara al pie de la tarjeta (el aviso de acceso seguro del admin)
// y `below` lo que va fuera de la tarjeta (el link al otro login).
function AuthLayout({ children, footer, below }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-primary-900 px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-lg">
          <ShieldCheck size={32} aria-hidden="true" />
        </span>
        <p className="text-3xl font-bold text-white">MedPortal</p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-8">{children}</div>
        {footer && <div className="bg-primary-50 px-6 py-5">{footer}</div>}
      </div>

      {below && <div className="mt-8 text-sm text-slate-300">{below}</div>}
    </main>
  );
}

export default AuthLayout;
