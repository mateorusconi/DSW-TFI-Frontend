//A chequear.
export async function loginPatient(email, dni) {
const response = await fetch("/api/auth/patient/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: email,
        dni: Number(dni),
    }),
});

let data;

try {
    data = await response.json();
    } catch {
    throw new Error(
    "No se recibió una respuesta JSON de la API. Comprobá que esté disponible.",
    );
}

if (!response.ok) {
    const error = new Error(data?.message ?? "No se pudo iniciar sesión.");

    error.errorCode = data?.errorCode;
    error.status = response.status;

    throw error;
}

if (
    typeof data?.token !== "string" ||
    data.token.trim() === "" ||
    data.role !== "PACIENTE"
) {
    throw new Error("La respuesta de inicio de sesión no es válida.");
}

return data;
}
