import { CalendarCheck, LayoutGrid, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "../../shared/components/atoms/Spinner.jsx";
import Alert from "../../shared/components/molecules/Alert.jsx";
import { getErrorMessage } from "../../shared/helpers/getErrorMessage.js";
import { getDashboardStats } from "../services/dashboardStatsService.js";

const STATS_ENABLED = import.meta.env.VITE_DASHBOARD_STATS_ENABLED === "true";
const numberFormat = new Intl.NumberFormat("es-AR");
const STATS = [
  { key: "activeDoctors", label: "Doctores activos", icon: Stethoscope },
  { key: "activeSpecialties", label: "Especialidades activas", icon: LayoutGrid },
  {
    key: "confirmedAppointmentsToday",
    label: "Turnos confirmados para hoy",
    icon: CalendarCheck,
  },
];

function DashboardStats({ date }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const requestKey = `${date}|${attempt}`;

  useEffect(() => {
    if (!STATS_ENABLED) return;

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
  const loading = STATS_ENABLED && currentResult === null;

  return (
    <section className="mb-6" aria-label="Indicadores del tablero">
      <dl className="grid gap-3 sm:grid-cols-3" aria-busy={loading}>
        {STATS.map(({ key, label, icon: Icon }) => {
          const value = currentResult?.stats?.[key];

          return (
            <div key={key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="mb-3 inline-flex rounded-lg bg-sky-50 p-2 text-sky-900">
                <Icon size={19} aria-hidden="true" />
              </span>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {label}
              </dt>
              <dd className="mt-1 min-h-8 text-2xl font-bold tabular-nums text-sky-900">
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

      {!STATS_ENABLED && (
        <p className="mt-2 text-sm text-slate-600">
          Los indicadores se mostrarán cuando se habilite el servicio de estadísticas.
        </p>
      )}
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
