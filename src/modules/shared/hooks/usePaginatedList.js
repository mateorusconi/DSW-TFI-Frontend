import { useEffect, useState } from "react";
import { getErrorMessage } from "../helpers/getErrorMessage.js";

const EMPTY_FILTERS = {};
const EMPTY_ITEMS = [];

export function usePaginatedList(
  fetchFn,
  { pageSize = 10, filters = EMPTY_FILTERS } = {},
) {
  const [request, setRequest] = useState({
    fetchFn,
    filters,
    pageSize,
    pageIndex: 1,
  });

  const [result, setResult] = useState({
    request: null,
    items: EMPTY_ITEMS,
    total: 0,
    error: "",
  });

  if (
    request.filters !== filters ||
    request.pageSize !== pageSize ||
    request.fetchFn !== fetchFn
  ) {
    setRequest({ fetchFn, filters, pageSize, pageIndex: 1 });
  }

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const page = await request.fetchFn({
          ...request.filters,
          pageIndex: request.pageIndex,
          pageSize: request.pageSize,
        });

        if (!active) return;

        if (
          !Array.isArray(page?.data) ||
          !Number.isInteger(page.total) ||
          page.total < 0
        ) {
          throw new Error("Respuesta paginada inválida.");
        }

        const lastPage = Math.max(
          1,
          Math.ceil(page.total / request.pageSize),
        );

        if (request.pageIndex > lastPage) {
          setRequest((current) =>
            current === request
              ? { ...current, pageIndex: lastPage }
              : current,
          );
          return;
        }

        setResult({
          request,
          items: page.data,
          total: page.total,
          error: "",
        });
      } catch (error) {
        if (active) {
          setResult({
            request,
            items: EMPTY_ITEMS,
            total: 0,
            error: getErrorMessage(error),
          });
        }
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [request]);

  function setPageIndex(nextPage) {
    setRequest((current) => {
      const pageIndex =
        typeof nextPage === "function"
          ? nextPage(current.pageIndex)
          : nextPage;

      if (
        !Number.isInteger(pageIndex) ||
        pageIndex < 1 ||
        pageIndex === current.pageIndex
      ) {
        return current;
      }

      return { ...current, pageIndex };
    });
  }

  function reload() {
    setRequest((current) => ({ ...current }));
  }

  const loading = result.request !== request;

  return {
    items: loading ? EMPTY_ITEMS : result.items,
    total: loading ? 0 : result.total,
    pageIndex: request.pageIndex,
    setPageIndex,
    loading,
    error: loading ? "" : result.error,
    reload,
  };
}