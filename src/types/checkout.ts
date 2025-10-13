export interface CartItem {
  productId: string;
  quantity: number;
  price: number;

  // Product details for display
  product?: {
    id: string;
    name: string;
    images?: string[];
    stock: number;
  };
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface CheckoutPayload {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  addressId: string;
  paymentMethod: PaymentMethod;
  discountCode?: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentUrl?: string;
  totalAmount: number;
  estimatedDelivery?: string;
}

export interface ShippingOption {
  courier: string;
  service: string;
  cost: number;
  estimatedDays: number;
}

export interface ShippingCalculationPayload {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
    weight?: number;
  }[];
}

export interface ShippingCalculationResponse {
  options: ShippingOption[];
  totalWeight: number;
}

// Import types yang dibutuhkan
import { PaymentMethod } from "./order";
