import { toLocalISODate } from "../../shared/helpers/dates.js";

export const BOOKING_WEEK_DAYS = 5;
const SLOT_TIME = /^((?:[01]\d|2[0-3]):[0-5]\d)(?::[0-5]\d)?$/;

export function getBookingDay(weekStart, offset) {
  const day = new Date(weekStart);
  day.setDate(day.getDate() + offset);
  return day;
}

export function buildBookingWeek(weekStart, slots) {
  const days = Array.from({ length: BOOKING_WEEK_DAYS }, (_, index) => {
    const day = getBookingDay(weekStart, index);
    return { day, date: toLocalISODate(day), byTime: new Map() };
  });
  const byDate = new Map(days.map(({ date, byTime }) => [date, byTime]));

  for (const slot of slots) {
    const date = typeof slot?.date === "string" ? slot.date.slice(0, 10) : "";
    const startTime = SLOT_TIME.exec(slot?.startTime)?.[1];
    const daySlots = byDate.get(date);
    if (!daySlots || !startTime) continue;

    // La API anterior solo devuelve libres, sin status. Gris necesita un OCCUPIED explícito.
    const occupied = slot.status === "OCCUPIED";
    const available =
      (slot.status === "AVAILABLE" || slot.status === undefined) &&
      typeof slot.id === "string" &&
      slot.id.trim() !== "";
    if (!occupied && !available) continue;

    // Ante datos duplicados, un ocupado nunca puede quedar habilitado.
    if (daySlots.get(startTime)?.occupied) continue;

    daySlots.set(startTime, {
      startTime,
      occupied,
      selectableSlot: occupied ? null : { id: slot.id, date, startTime },
    });
  }

  return days.map(({ day, date, byTime }) => ({
    day,
    date,
    blocks: [...byTime.values()].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    ),
  }));
}
