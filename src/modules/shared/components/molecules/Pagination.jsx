const buttonClassName =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40";

function Pagination({
  pageIndex,
  pageSize,
  total,
  onPageChange,
  itemLabel = "resultados",
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const firstItem = total === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const lastItem = Math.min(pageIndex * pageSize, total);

  // Mostramos hasta cinco números para no generar cientos de botones.
  const visibleCount = Math.min(totalPages, 5);
  const firstVisiblePage = Math.max(
    1,
    Math.min(pageIndex - 2, totalPages - visibleCount + 1),
  );

  const pages = Array.from(
    { length: visibleCount },
    (_, index) => firstVisiblePage + index,
  );

  function changePage(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === pageIndex
    ) {
      return;
    }

    onPageChange(nextPage);
  }

  return (
    <nav
      aria-label={`Paginación de ${itemLabel}`}
      className="mt-4 flex flex-wrap items-center justify-between gap-4"
    >
      <p className="text-sm text-slate-600" aria-live="polite">
        Mostrando {firstItem}–{lastItem} de {total} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={buttonClassName}
          aria-label="Página anterior"
          disabled={pageIndex <= 1}
          onClick={() => changePage(pageIndex - 1)}
        >
          <span aria-hidden="true">◀</span>
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-label={`Página ${page}`}
            aria-current={page === pageIndex ? "page" : undefined}
            className={`${buttonClassName} ${
              page === pageIndex
                ? "bg-sky-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            onClick={() => changePage(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={buttonClassName}
          aria-label="Página siguiente"
          disabled={pageIndex >= totalPages}
          onClick={() => changePage(pageIndex + 1)}
        >
          <span aria-hidden="true">▶</span>
        </button>
      </div>
    </nav>
  );
}

export default Pagination;