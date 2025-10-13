// Common utility types yang digunakan di seluruh aplikasi

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface TimestampEntity {
  createdAt: Date;
  updatedAt: Date;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// File upload types
export interface FileUpload {
  file: File;
  type: "image" | "document" | "video" | "audio";
  maxSize?: number; // dalam bytes
  allowedTypes?: string[];
}

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
  timestamp: Date;
}

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: Date;
}

// Status types
export interface Status {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

export interface StatusChange {
  from: string;
  to: string;
  changedAt: Date;
  changedBy: string;
  reason?: string;
}

// Audit types
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete" | "view";
  userId: string;
  userEmail: string;
  changes?: Record<string, { from: any; to: any }>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Configuration types
export interface AppConfig {
  environment: "development" | "staging" | "production";
  version: string;
  buildNumber: string;
  apiUrl: string;
  appUrl: string;
  features: Record<string, boolean>;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PickFields<T, K extends keyof T> = Pick<T, K>;
export type ExcludeFields<T, K extends keyof T> = Omit<T, K>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
}

export interface DomainEvent extends BaseEvent {
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: Record<string, any>;
}

// Cache types
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
  accessedAt: Date;
  accessCount: number;
}

export interface CacheConfig {
  ttl: number; // seconds
  maxSize: number;
  evictionPolicy: "lru" | "lfu" | "fifo";
}
