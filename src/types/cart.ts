import { Product, ProductImage, Category } from "@/lib/api";

// Backend CartItem structure
export interface BackendCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product; // Full product details
}

// Backend Cart structure
export interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  createdAt: string;
  updatedAt: string;
}

// Frontend Cart Item State
export interface CartItemState {
  id: string; // cartItemId
  product: Product;
  quantity: number;
}

// Frontend Cart State
export interface CartState {
  items: CartItemState[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// Frontend Cart Actions
export interface CartActions {
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Cart context type
export interface CartContextType extends CartState, CartActions {
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// API response types
export interface AddToCartResponse {
  message: string;
  cartItem: BackendCartItem;
}

export interface GetCartResponse {
  message: string;
  cart: BackendCart | null;
  totalItems: number;
  totalAmount: number;
}

export interface UpdateCartItemResponse {
  message: string;
  cartItem: BackendCartItem;
}

export interface RemoveFromCartResponse {
  message: string;
}

export interface ClearCartResponse {
  message: string;
}
