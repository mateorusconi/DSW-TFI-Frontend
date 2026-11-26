import { instance } from "../../shared/api/axiosInstance.js";

export async function getMyAppointments(dni) {
  const { data } = await instance.get("/appointments/patient", {
    params: { dni },
  });
  return data;
}

export async function cancelAppointment(id) {
  await instance.delete(`/appointments/${id}`);
}
