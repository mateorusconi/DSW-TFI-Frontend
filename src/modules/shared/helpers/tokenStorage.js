const SESSION_KEY = "session";

function isValidSession(session) {
  return (
    session !== null &&
    typeof session === "object" &&
    typeof session.token === "string" &&
    session.token.trim() !== "" &&
    ["ADMINISTRADOR", "PACIENTE"].includes(session.role)
  );
}

export function saveSession({ token, role, email, dni }) {
  const session = { token, role, email, dni };

  if (!isValidSession(session)) {
    throw new Error("La sesión debe contener un token y un rol válidos.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession() {
  try {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (storedSession === null) {
      return null;
    }

    const session = JSON.parse(storedSession);

    return isValidSession(session) ? session : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}