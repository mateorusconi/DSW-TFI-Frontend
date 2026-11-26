import { instance } from "../../shared/api/axiosInstance.js";

export async function getDoctorSlots(doctorId, from, to, signal) {
  const { data } = await instance.get(
    `/doctors/${encodeURIComponent(doctorId)}/slots`,
    {
      params: { from, to, includeOccupied: true },
      signal,
    },
  );

  if (!Array.isArray(data)) {
    throw new Error("La API devolvió una agenda inválida.");
  }

  return data;
}

export async function createAppointment({
  doctorId,
  availabilityId,
  dni,
  reason,
}) {
  const { data } = await instance.post("/appointments", {
    doctorId,
    availabilityId,
    patient: { dni: Number(dni) },
    reason,
  });

  return data;
}
