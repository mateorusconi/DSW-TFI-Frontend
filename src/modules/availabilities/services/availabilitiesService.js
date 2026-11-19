import { instance } from "../../shared/api/axiosInstance.js";

export async function getDoctorAvailabilities(doctorId, signal) {
  const { data } = await instance.get(
    `/doctors/${encodeURIComponent(doctorId)}/availabilities`,
    { signal },
  );
  return data;
}

export async function createAvailabilities(payload) {
  await instance.post("/availabilities", payload);
}

export async function updateAvailabilities(payload) {
  await instance.put("/availabilities", payload);
}
