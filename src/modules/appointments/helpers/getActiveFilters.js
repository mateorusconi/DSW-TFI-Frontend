export function getActiveFilters(filters, specialties, doctors) {
  if (!filters) return [];

  const { dni, specialtyId, doctorId, date } = filters;
  const specialtyName = specialties.find(({ id }) => id === specialtyId)?.name;
  const doctorName = doctors.find(({ id }) => id === doctorId)?.name;

  return [
    { key: "dni", label: "DNI", value: dni },
    {
      key: "specialtyId",
      label: "Especialidad",
      value: specialtyName ?? specialtyId,
    },
    {
      key: "doctorId",
      label: "Médico",
      value: doctorName ?? doctorId,
    },
    { key: "date", label: "Fecha", value: date ? date.split("-").reverse().join("/") : "" },
  ].filter(({ value }) => value);
}
