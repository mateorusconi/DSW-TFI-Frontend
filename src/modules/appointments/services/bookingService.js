import { instance } from "../../shared/api/axiosInstance.js";

export async function getDoctorSlots(doctorId, from, to) {
  const { data } = await instance.get(`/doctors/${doctorId}/slots`, {
    params: { from, to },
  });

  return data;
}

export async function createAppointment({ doctorId, availabilityId, dni, reason }) {
  const { data } = await instance.post("/appointments", {
    doctorId,
    availabilityId,
    patient: { dni: Number(dni) },
    reason,
  });

  return data;
}
