import { instance } from "../../shared/api/axiosInstance.js";

export async function getDashboardStats(date, signal) {
  const { data } = await instance.get("/dashboard/stats", {
    params: { date },
    signal,
  });

  if (
    !["activeDoctors", "activeSpecialties", "confirmedAppointmentsToday"].every(
      (field) => Number.isSafeInteger(data?.[field]) && data[field] >= 0,
    )
  ) {
    throw new Error("La API devolvió estadísticas inválidas.");
  }

  return data;
}
