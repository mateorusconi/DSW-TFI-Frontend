import { useId } from "react";

function DayScheduleRow({ dayLabel, value, onChange, error, disabled }) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const timeInputClass = "min-h-10 w-full rounded-md border border-slate-300 px-2 disabled:bg-slate-100";

  return (
    <fieldset
      className="min-w-0 rounded-md border border-slate-200 px-3 pb-3"
      disabled={disabled}
    >
      <legend className="px-1 font-medium text-slate-900">{dayLabel}</legend>
      <div className="grid gap-3 sm:grid-cols-[minmax(6rem,1fr)_minmax(7rem,1fr)_minmax(7rem,1fr)] sm:items-end">
        <label className="flex min-h-10 items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            role="switch"
            aria-label={`Horario activo: ${dayLabel}`}
            className="size-4 accent-sky-900"
            checked={value.active}
            onChange={(event) => onChange({ ...value, active: event.target.checked })}
          />
          {value.active ? "Activo" : "Inactivo"}
        </label>
        <label htmlFor={`${id}-start`} className="grid gap-1 text-sm">
          Entrada
          <input
            id={`${id}-start`}
            type="time"
            step="1800"
            className={timeInputClass}
            value={value.startTime}
            disabled={!value.active}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            onChange={(event) => onChange({ ...value, startTime: event.target.value })}
          />
        </label>
        <label htmlFor={`${id}-end`} className="grid gap-1 text-sm">
          Salida
          <input
            id={`${id}-end`}
            type="time"
            step="1800"
            className={timeInputClass}
            value={value.endTime}
            disabled={!value.active}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            onChange={(event) => onChange({ ...value, endTime: event.target.value })}
          />
        </label>
      </div>
      {error && <p id={errorId} role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </fieldset>
  );
}

export default DayScheduleRow;
