function parseDate(value) {
  if (!(value instanceof Date) && typeof value !== "string") {
    return null;
  }

  // Una fecha sin hora debe interpretarse como fecha local, no UTC.
  const normalizedValue =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value;

  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toLocalISODate(value) {
  const date = parseDate(value);

  if (!date) {
    return "";
  }

  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function startOfWeek(value) {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  const daysSinceMonday = (date.getDay() + 6) % 7;

  date.setDate(date.getDate() - daysSinceMonday);
  date.setHours(0, 0, 0, 0);

  return date;
}

export function formatLongDate(value) {
  const date = parseDate(value);

  if (!date) {
    return "—";
  }

  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTime(value) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}/.test(value)) {
    return "—";
  }

  return value.slice(0, 5);
}