import { BriefcaseMedical, CalendarDays, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getDashboardStats } from "../services/dashboardStatsService.js";

const numberFormat = new Intl.NumberFormat("es-AR");
// Mismos íconos y etiquetas que las tarjetas del mockup; solo la de turnos lleva la etiqueta "Hoy"
const STATS = [
  { key: "activeDoctors", label: "Doctores activos", icon: BriefcaseMedical },
  { key: "activeSpecialties", label: "Especialidades activas", icon: LayoutGrid },
  {
    key: "confirmedAppointmentsToday",
    label: "Turnos confirmados para hoy",
    icon: CalendarDays,
    tag: "Hoy",
  },
];

function DashboardStats({ date }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const requestKey = `${date}|${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    getDashboardStats(date, controller.signal)
      .then((stats) => {
        if (!controller.signal.aborted) {
          setResult({ requestKey, stats });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          const message = getErrorMessage(error, "No se pudieron cargar las estadísticas.");
          setResult({ requestKey, error: message });
        }
      });

    return () => controller.abort();
  }, [date, requestKey]);

  const currentResult = result?.requestKey === requestKey ? result : null;
  const loading = currentResult === null;

  return (
    <section className="mb-8" aria-label="Indicadores del tablero">
      <dl className="grid gap-5 sm:grid-cols-3" aria-busy={loading}>
        {STATS.map(({ key, label, icon: Icon, tag }) => {
          const value = currentResult?.stats?.[key];

          return (
            <div key={key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <span className="inline-flex rounded-lg bg-primary-50 p-2.5 text-primary-700">
                  <Icon size={22} aria-hidden="true" />
                </span>
                {tag && (
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    {tag}
                  </span>
                )}
              </div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                {label}
              </dt>
              <dd className="mt-1 min-h-10 text-4xl font-bold tabular-nums text-primary-700">
                {loading ? (
                  <Spinner />
                ) : value === undefined ? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Sin dato</span>
                  </>
                ) : (
                  numberFormat.format(value)
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {currentResult?.error && (
        <div className="mt-3">
          <Alert
            actionLabel="Reintentar estadísticas"
            onAction={() => setAttempt((current) => current + 1)}
          >
            {currentResult.error}
          </Alert>
        </div>
      )}
    </section>
  );
}

export default DashboardStats;
