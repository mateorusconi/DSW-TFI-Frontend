import { instance } from "../../shared/api/axiosInstance.js";

export async function getSpecialties({
  pageIndex = 1,
  pageSize = 10,
  name = "",
} = {}) {
  const response = await instance.get("/specialties", {
    params: {
      pageIndex,
      pageSize,
      name,
    },
  });

  return response.data;
}

export async function createSpecialty({ name, description }) {
  const response = await instance.post("/specialties", {
    name,
    description,
  });

  return response.data;
}
export async function updateSpecialty(id, { name, description }) {
  const response = await instance.put(`/specialties/${id}`, {
    name,
    description,
  });

  return response.data;
}
export async function deleteSpecialty(id) {
  const response = await instance.delete(`/specialties/${id}`);

  return response.data;
}