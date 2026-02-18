// Re-export API types dari common.ts
export type { ApiResponse, PaginationMeta } from "./common";

// Legacy API types untuk backward compatibility
export interface LegacyApiResponse<T> {
  data: T;
  message?: string;
}

export interface LegacyPaginatedResponse<T> extends LegacyApiResponse<T> {
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
