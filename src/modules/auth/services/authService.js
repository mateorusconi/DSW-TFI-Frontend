import { instance } from "../../shared/api/axiosInstance.js";

export async function loginAdmin({ email, password }) {
  const { data } = await instance.post(
    "/auth/admin/login",
    { email, password },
    { skipAuth: true },
  );
  return data;
}

export async function loginPatient({ email, dni }) {
  const { data } = await instance.post(
    "/auth/patient/login",
    { email, dni: Number(dni) },
    { skipAuth: true },
  );

  if (data.role !== "PACIENTE" || !data.token) {
    throw new Error("Respuesta inválida del servidor");
  }

  return data;
}
