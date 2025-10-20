export interface Notification {
  id: string;
  isRead: boolean;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  url?: string;

  // Relations
  user?: User;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;

  // Relations
  user?: User;
  product?: Product;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: Date;

  // Relations
  user?: User;
  product?: Product;
}

export interface Discount {
  id: string;
  code: string;
  description?: string;
  percentage?: number;
  amount?: number;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
}

export interface NotificationCreatePayload {
  title: string;
  description: string;
  userId: string;
  url?: string;
}

export interface NotificationUpdatePayload {
  isRead?: boolean;
  title?: string;
  description?: string;
  url?: string;
}

export interface WishlistCreatePayload {
  userId: string;
  productId: string;
}

export interface ReviewCreatePayload {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
}

export interface ReviewUpdatePayload {
  rating?: number;
  comment?: string;
}

export interface DiscountCreatePayload {
  code: string;
  description?: string;
  percentage?: number;
  amount?: number;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
}

export interface DiscountUpdatePayload {
  description?: string;
  percentage?: number;
  amount?: number;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
}

export interface DiscountValidationPayload {
  code: string;
  orderAmount: number;
}

// Import types yang dibutuhkan
import { User } from "./user";
import { Product } from "./product";
