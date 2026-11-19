import { instance } from "../../shared/api/axiosInstance.js";

export async function getDoctorSlots(doctorId, from, to) {
  const { data } = await instance.get(`/doctors/${doctorId}/slots`, {
    params: { from, to },
  });

  return data;
}