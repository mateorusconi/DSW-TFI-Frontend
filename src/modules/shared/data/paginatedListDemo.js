export const DEMO_ROWS = Array.from({ length: 25 }, (_, index) => ({
  id: `demo-${index + 1}`,
  name: `Especialidad ${index + 1}`,
  description: `Descripción de prueba ${index + 1}`,
}));

export async function fetchDemoRows({
  pageIndex = 1,
  pageSize = 10,
  name = "",
} = {}) {
  const filteredRows = DEMO_ROWS.filter((row) =>
    row.name.toLowerCase().includes(name.toLowerCase()),
  );

  const startIndex = (pageIndex - 1) * pageSize;

  return {
    pageIndex,
    pageSize,
    data: filteredRows.slice(startIndex, startIndex + pageSize),
    total: filteredRows.length,
  };
}