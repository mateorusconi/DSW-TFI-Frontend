// Iniciales para el avatar: "juan.perez@mail.com" -> "JP", "admin@system.com" -> "AD"
export function getInitials(email) {
  const name = (email ?? "").split("@")[0];
  const parts = name.split(/[._\-\s]+/).filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "?";
}
