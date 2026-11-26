export default function FilterChips({ filters, onRemove }) {
  if (filters.length === 0) return null;

  return (
    <ul aria-label="Filtros aplicados" className="mb-4 flex flex-wrap gap-2">
      {filters.map(({ key, label, value }) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Quitar filtro ${label}: ${value}`}
            className="rounded-full bg-sky-100 px-3 py-1.5 text-sm text-sky-900 hover:bg-sky-200"
          >
            {label}: {value} <span aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
