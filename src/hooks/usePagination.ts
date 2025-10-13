"use client";

import { useState, useCallback, useMemo } from "react";

export interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  maxVisiblePages?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  visiblePages: number[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
  setTotalItems: (total: number) => void;
  resetPagination: () => void;
  getOffset: () => number;
  getPaginationInfo: () => {
    startItem: number;
    endItem: number;
    showing: string;
  };
}

export const usePagination = (
  options: UsePaginationOptions = {}
): UsePaginationReturn => {
  const { initialPage = 1, initialLimit = 10, maxVisiblePages = 5 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrev]);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  }, []);

  const setTotalItemsCallback = useCallback(
    (total: number) => {
      setTotalItems(total);
      // If current page is beyond total pages, go to last page
      if (currentPage > Math.ceil(total / limit)) {
        setCurrentPage(Math.ceil(total / limit) || 1);
      }
    },
    [currentPage, limit]
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setLimitState(initialLimit);
    setTotalItems(0);
  }, [initialPage, initialLimit]);

  const getOffset = useCallback(() => {
    return (currentPage - 1) * limit;
  }, [currentPage, limit]);

  const getPaginationInfo = useCallback(() => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);
    const showing =
      totalItems === 0
        ? "No items"
        : `Showing ${startItem}-${endItem} of ${totalItems}`;

    return { startItem, endItem, showing };
  }, [currentPage, limit, totalItems]);

  return {
    currentPage,
    limit,
    totalItems,
    totalPages,
    hasNext,
    hasPrev,
    visiblePages,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    setTotalItems: setTotalItemsCallback,
    resetPagination,
    getOffset,
    getPaginationInfo,
  };
};
