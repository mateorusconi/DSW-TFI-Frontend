import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Button from "../../shared/components/atoms/Button.jsx";
import { toLocalISODate } from "../../shared/helpers/dates.js";
import { buildBookingWeek } from "../helpers/bookingWeek.js";

const dayFormat = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
});
const weekEndFormat = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function WeekSlotsGrid({
  weekStart,
  slots,
  selectedSlotId,
  onSelect,
  onPrevWeek,
  onNextWeek,
  canGoPrev,
}) {
  const [mobileDate, setMobileDate] = useState(null);
  const days = buildBookingWeek(weekStart, slots);
  const hasBlocks = days.some(({ blocks }) => blocks.length > 0);
  const today = toLocalISODate(new Date());
  const mobileDay =
    days.find(({ date }) => date === mobileDate) ??
    days.find(({ date, blocks }) => date >= today && blocks.length > 0) ??
    days.find(({ date }) => date === today) ??
    days[0];
  const title = `${dayFormat.format(days[0].day)} – ${weekEndFormat.format(days.at(-1).day)}`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={onPrevWeek}
          disabled={!canGoPrev}
          aria-label="Semana anterior"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </Button>
        <h2 className="text-center text-sm font-semibold first-letter:uppercase sm:text-base">
          {title}
        </h2>
        <Button
          variant="ghost"
          onClick={onNextWeek}
          aria-label="Semana siguiente"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      </div>

      <ul
        aria-label="Referencias de horarios"
        className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-700"
      >
        <li className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-emerald-500"
          />
          Disponible
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-slate-400"
          />
          Ocupado
        </li>
      </ul>

      <div
        className="mb-4 grid grid-cols-5 gap-1 md:hidden"
        role="group"
        aria-label="Día de la semana"
      >
        {days.map(({ date, day }) => (
          <button
            key={date}
            type="button"
            aria-pressed={date === mobileDay.date}
            onClick={() => setMobileDate(date)}
            className={`min-h-11 rounded-md border px-1 text-xs font-semibold ${
              date === mobileDay.date
                ? "border-sky-900 bg-sky-900 text-white"
                : "border-slate-200 text-slate-700"
            }`}
          >
            {dayFormat.format(day)}
          </button>
        ))}
      </div>

      {hasBlocks ? (
        <div className="grid gap-3 md:grid-cols-5">
          {days.map(({ day, date, blocks }) => (
            <section
              key={date}
              aria-label={dayFormat.format(day)}
              className={date === mobileDay.date ? "block" : "hidden md:block"}
            >
              <h3 className="mb-2 hidden text-center text-sm font-semibold uppercase text-slate-600 md:block">
                {dayFormat.format(day)}
              </h3>
              {blocks.length === 0 ? (
                <p className="text-center text-xs text-slate-600">
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">
                    Sin horarios informados para este día
                  </span>
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
                  {blocks.map(({ startTime, occupied, selectableSlot }) => {
                    const selected =
                      !occupied && selectableSlot.id === selectedSlotId;
                    const colors = occupied
                      ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-700"
                      : selected
                        ? "border-emerald-800 bg-emerald-700 text-white ring-2 ring-emerald-700 ring-offset-1"
                        : "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100";

                    return (
                      <button
                        key={startTime}
                        type="button"
                        disabled={occupied}
                        aria-label={`${startTime}, ${occupied ? "ocupado" : "disponible"}`}
                        aria-pressed={occupied ? undefined : selected}
                        onClick={
                          occupied ? undefined : () => onSelect(selectableSlot)
                        }
                        className={`min-h-10 rounded-md border px-2 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${colors}`}
                      >
                        {startTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-slate-600">
          La agenda no devolvió horarios para esta semana.
        </p>
      )}
    </div>
  );
}

export default WeekSlotsGrid;
