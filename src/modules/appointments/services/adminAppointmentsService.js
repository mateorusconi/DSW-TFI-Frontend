import { instance } from "../../shared/api/axiosInstance.js";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";
import { getSpecialties } from "../../specialties/services/specialtiesService.js";

const OPTION_PAGE_SIZE = 100;

// Esta rama todavía no incluye el servicio de médicos de SCRUM-34.
async function getDoctorsPage(params) {
  const response = await instance.get("/doctors", { params });
  return response.data;
}

async function loadCatalog(getPage) {
  const options = [];
  let pageCount = 1;

  for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
    const { data, total } = await getPage({
      pageIndex,
      pageSize: OPTION_PAGE_SIZE,
    });

    if (!Array.isArray(data) || !Number.isInteger(total) || total < 0) {
      throw new Error("El catálogo no devolvió una respuesta paginada válida.");
    }

    if (pageIndex === 1) {
      pageCount = Math.ceil(total / OPTION_PAGE_SIZE);
    }
    options.push(...data);
  }

  return options;
}

export async function getAppointmentFilterOptions() {
  const [specialties, doctors] = await Promise.all([
    loadCatalog(getSpecialties),
    loadCatalog(getDoctorsPage),
  ]);

  return { specialties, doctors };
}

export async function searchAppointments({
  pageIndex = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  specialtyId,
  doctorId,
  dni,
  date,
} = {}) {
  const response = await instance.get("/appointments/search", {
    params: { pageIndex, pageSize, specialtyId, doctorId, dni, date },
  });

  return response.data;
}
