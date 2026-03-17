export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock: number;
  categoryId?: string;
  size?: string; // Ukuran produk (XL, L, M, S, 32, 34, 36, etc.)
  soldCount?: number | null;
  displayRating?: number | null;
  displayReviewCount?: number | null;
  rating?: number;
  _count?: {
    reviews: number;
    wishlist: number;
  };
  createdAt: Date;
  updatedAt: Date;

  // Relations
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  products?: Product[];
}

export interface ProductCreatePayload {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock: number;
  categoryId?: string;
  size?: string; // Ukuran produk (XL, L, M, S, 32, 34, 36, etc.)
  images?: string[]; // URLs
  soldCount?: number | null;
  displayRating?: number | null;
  displayReviewCount?: number | null;
}

export interface ProductUpdatePayload {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  categoryId?: string;
  size?: string; // Ukuran produk (XL, L, M, S, 32, 34, 36, etc.)
  soldCount?: number | null;
  displayRating?: number | null;
  displayReviewCount?: number | null;
}

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CategoryCreatePayload {
  name: string;
}

export interface CategoryUpdatePayload {
  name: string;
}
