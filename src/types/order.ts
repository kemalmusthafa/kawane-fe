export enum OrderStatus {
  CHECKOUT = "CHECKOUT",
  PAID = "PAID",
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  SUCCEEDED = "SUCCEEDED",
}

export enum PaymentMethod {
  MIDTRANS = "MIDTRANS",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  addressId?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  items?: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
  address?: Address;
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;

  // Relations
  product?: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  orderId: string;
  courier?: string;
  trackingNo?: string;
  cost: number;
  estimatedDays?: number;
  addressId?: string;
  createdAt: Date;

  // Relations
  address?: Address;
}

export interface OrderCreatePayload {
  items: {
    productId: string;
    quantity: number;
  }[];
  addressId: string;
  totalAmount: number;
}

export interface OrderUpdatePayload {
  status?: OrderStatus;
  totalAmount?: number;
  addressId?: string;
}

export interface PaymentCreatePayload {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}

export interface PaymentUpdatePayload {
  status?: PaymentStatus;
  transactionId?: string;
}

export interface ShipmentCreatePayload {
  orderId: string;
  courier: string;
  trackingNo?: string;
  cost: number;
  estimatedDays?: number;
  addressId: string;
}

export interface ShipmentUpdatePayload {
  courier?: string;
  trackingNo?: string;
  cost?: number;
  estimatedDays?: number;
  addressId?: string;
}

// Import types yang dibutuhkan
import { User } from "./user";
import { Product } from "./product";
import { Address } from "./user";
