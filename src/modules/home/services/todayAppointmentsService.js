import { instance } from "../../shared/api/axiosInstance.js";
import { DEFAULT_PAGE_SIZE } from "../../shared/constants/pagination.js";

export async function getAppointmentsByDate({
  date,
  pageIndex = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const { data } = await instance.get("/appointments", {
    params: { date, pageIndex, pageSize },
  });
  return data;
}
