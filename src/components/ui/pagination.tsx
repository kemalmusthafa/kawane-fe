"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination, UsePaginationReturn } from "@/hooks/usePagination";

interface PaginationProps {
  pagination: UsePaginationReturn;
  className?: string;
  showLimitSelector?: boolean;
  showInfo?: boolean;
  limitOptions?: number[];
}

export function Pagination({
  pagination,
  className = "",
  showLimitSelector = true,
  showInfo = true,
  limitOptions = [5, 10, 20, 50, 100],
}: PaginationProps) {
  // Add safety check for pagination prop
  if (!pagination) {
    return null;
  }

  const {
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
    getPaginationInfo,
  } = pagination;

  const { showing } = getPaginationInfo();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">{showing}</div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Limit Selector */}
        {showLimitSelector && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!hasPrev}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => {
            // Show ellipsis if there's a gap
            const showEllipsisBefore = index === 0 && page > 1;
            const showEllipsisAfter =
              index === visiblePages.length - 1 && page < totalPages;

            return (
              <div key={page} className="flex items-center">
                {showEllipsisBefore && (
                  <div className="flex items-center justify-center h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>

                {showEllipsisAfter && (
                  <div className="flex items-center justify-center h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Legacy Pagination component for backward compatibility
export function LegacyPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const visiblePages = [];
  const maxVisible = 5;
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust if we're near the beginning or end
  if (endPage - startPage + 1 < maxVisible) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisible - 1);
    } else {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const showing =
    totalItems === 0
      ? "No items"
      : `Showing ${startItem}-${endItem} of ${totalItems}`;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Info */}
      <div className="text-sm text-muted-foreground">{showing}</div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => {
            const showEllipsisBefore = index === 0 && page > 1;
            const showEllipsisAfter =
              index === visiblePages.length - 1 && page < totalPages;

            return (
              <div key={page} className="flex items-center">
                {showEllipsisBefore && (
                  <div className="flex items-center justify-center h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>

                {showEllipsisAfter && (
                  <div className="flex items-center justify-center h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Compact version for tables
export function CompactPagination({
  pagination,
  className = "",
}: Omit<PaginationProps, "showLimitSelector" | "showInfo" | "limitOptions">) {
  return (
    <Pagination
      pagination={pagination}
      className={className}
      showLimitSelector={false}
      showInfo={false}
    />
  );
}

// Full version with all features
export function FullPagination({
  pagination,
  className = "",
  limitOptions = [5, 10, 20, 50, 100],
}: PaginationProps) {
  return (
    <Pagination
      pagination={pagination}
      className={className}
      showLimitSelector={true}
      showInfo={true}
      limitOptions={limitOptions}
    />
  );
}
