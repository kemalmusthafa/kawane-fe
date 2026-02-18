export interface InventoryLog {
  id: string;
  productId: string;
  change: number; // +restock, -jual
  note?: string;
  createdAt: Date;

  // Relations
  product?: Product;
}

export interface InventoryLogCreatePayload {
  productId: string;
  change: number;
  note?: string;
}

export interface InventoryLogFilter {
  productId?: string;
  changeType?: "restock" | "sale";
  startDate?: Date;
  endDate?: Date;
}

export interface StockUpdatePayload {
  productId: string;
  change: number;
  note?: string;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  isLowStock: boolean;
}

// Import types yang dibutuhkan
import { Product } from "./product";
