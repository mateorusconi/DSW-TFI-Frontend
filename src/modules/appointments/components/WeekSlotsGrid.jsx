import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../shared/components/atoms/Button.jsx";
import { toLocalISODate } from "../../shared/helpers/dates.js";

const WEEK_DAYS = 5; // lunes a viernes, como el mockup

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Agrupa los horarios por día: { "2026-11-24": [slot, slot], ... }
function groupByDay(slots) {
  return slots.reduce((groups, slot) => {
    const day = slot.date.slice(0, 10);
    (groups[day] ??= []).push(slot);
    return groups;
  }, {});
}

function WeekSlotsGrid({ weekStart, slots, selectedSlotId, onSelect, onPrevWeek, onNextWeek, canGoPrev }) {
  const days = Array.from({ length: WEEK_DAYS }, (_, index) => addDays(weekStart, index));
  const slotsByDay = groupByDay(slots);
  const title = `${days[0].toLocaleDateString("es-AR", { weekday: "long", day: "numeric" })} - ${days[WEEK_DAYS - 1].toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}`;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={onPrevWeek} disabled={!canGoPrev} aria-label="Semana anterior">
          <ChevronLeft size={20} aria-hidden="true" />
        </Button>
        <h2 className="text-center font-semibold first-letter:uppercase">{title}</h2>
        <Button variant="ghost" onClick={onNextWeek} aria-label="Semana siguiente">
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      </div>

      {slots.length === 0 && (
        <p className="mb-4 text-center text-sm text-slate-600">
          Este médico no tiene turnos libres esta semana, probá la siguiente.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        {days.map((day) => {
          const dayKey = toLocalISODate(day);
          const daySlots = slotsByDay[dayKey] ?? [];

          return (
            <div key={dayKey}>
              <p className="mb-2 text-center text-sm font-semibold uppercase text-slate-600">
                {day.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" })}
              </p>

              {daySlots.length === 0 ? (
                <p className="text-center text-xs text-slate-400">No hay turnos disponibles para este día</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
                  {daySlots.map((slot) => {
                    const selected = slot.id === selectedSlotId;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelect(slot)}
                        className={`rounded-md border px-2 py-1.5 text-sm ${
                          selected
                            ? "border-teal-600 bg-teal-500 text-white"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekSlotsGrid;