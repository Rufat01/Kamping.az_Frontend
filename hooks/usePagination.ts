"use client";

import { useState, useCallback, useRef } from "react";
import type { PaginatedResponse } from "@/types";

interface UsePaginationReturn<T> {
  data: PaginatedResponse<T> | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  totalPages: number;
  fetchPage: (page: number, extraParams?: Record<string, string>) => Promise<void>;
}

export function usePagination<T>(
  baseUrl: string,
  defaultPageSize = 12
): UsePaginationReturn<T> {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  const pageSizeRef = useRef(defaultPageSize);
  const lastExtraParamsRef = useRef<Record<string, string>>({});

  const fetchPage = useCallback(
    async (page: number, extraParams?: Record<string, string>) => {
      if (extraParams !== undefined) {
        lastExtraParamsRef.current = extraParams;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(pageSizeRef.current));

        for (const [key, value] of Object.entries(lastExtraParamsRef.current)) {
          if (value) params.set(key, value);
        }

        const sep = baseUrl.includes("?") ? "&" : "?";
        const url = `${baseUrl}${sep}${params.toString()}`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: PaginatedResponse<T> = await res.json();
        setData(json);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Xəta baş verdi");
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  const setPageSize = useCallback((size: number) => {
    pageSizeRef.current = size;
    setPageSizeState(size);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      fetchPage(page);
    },
    [fetchPage]
  );

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    setPageSize,
    goToPage,
    totalPages,
    fetchPage,
  };
}
