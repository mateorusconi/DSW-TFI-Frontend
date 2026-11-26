import { instance } from "../../shared/api/axiosInstance.js";

export async function getDoctors({
  pageIndex = 1,
  pageSize = 10,
  name = "",
  specialtyId = "",
} = {}) {
  const response = await instance.get("/doctors", {
    params: {
      pageIndex,
      pageSize,
      name,
      specialtyId,
    },
  });

  return response.data;
}

export async function createDoctor({ name, licenseNumber, specialtyId }) {
  const response = await instance.post("/doctors", {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
}

export async function updateDoctor(id, { name, licenseNumber, specialtyId }) {
  const response = await instance.put(`/doctors/${id}`, {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
}

export async function deleteDoctor(id) {
  const response = await instance.delete(`/doctors/${id}`);

  return response.data;
}
