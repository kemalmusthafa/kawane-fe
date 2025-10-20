/**
 * Order Service
 * Handles order creation, payment processing, and order management
 */

import { apiClient } from "@/lib/api";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    size?: string;
  }>;
  totalAmount?: number; // Add total amount field
  shippingAddress: string;
  paymentMethod: string;
  addressId?: string | null;
  notes?: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentUrl?: string;
  paymentToken?: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "credit_card" | "e_wallet" | "convenience_store";
  icon?: string;
  description?: string;
}

export class OrderService {
  /**
   * Create new address
   */
  static async createAddress(data: {
    label?: string;
    detail: string;
    city: string;
    province: string;
    postalCode: string;
  }) {
    try {
      const addressData = {
        detail: data.detail,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        isDefault: false,
      };
      const response = await apiClient.createAddress(addressData);
      return response.data || null;
    } catch (error: any) {
      console.error("OrderService.createAddress - Error:", error);
      throw new Error(error.message || "Failed to create address");
    }
  }

  /**
   * Create new order
   */
  static async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    try {
      const response = await apiClient.createOrder(data as any);
      return (
        response.data || {
          orderId: "",
          orderNumber: "",
          totalAmount: 0,
          status: "failed",
        }
      );
    } catch (error: any) {
      console.error("OrderService.createOrder - Error:", error);
      console.error("OrderService.createOrder - Error message:", error.message);
      console.error(
        "OrderService.createOrder - Error response:",
        error.response
      );
      throw new Error(error.message || "Failed to create order");
    }
  }

  /**
   * Get order by ID
   */
  static async getOrder(orderId: string) {
    try {
      const response = await apiClient.getOrder(orderId);
      return response.data || null;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get order");
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    try {
      const response = await apiClient.getUserOrders(params);
      return (
        response.data || {
          orders: [],
          pagination: {
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        }
      );
    } catch (error: any) {
      throw new Error(error.message || "Failed to get orders");
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await apiClient.updateOrderStatus(orderId, status);
      return response.data || { message: "Failed to update order status" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update order status");
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string) {
    try {
      const response = await apiClient.cancelOrder(orderId);
      return response.data || { message: "Failed to cancel order" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to cancel order");
    }
  }

  /**
   * Get available payment methods
   */
  static getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "bca",
        name: "BCA Virtual Account",
        type: "bank_transfer",
        icon: "🏦",
        description: "Transfer ke BCA Virtual Account",
      },
      {
        id: "bni",
        name: "BNI Virtual Account",
        type: "bank_transfer",
        icon: "🏦",
        description: "Transfer ke BNI Virtual Account",
      },
      {
        id: "mandiri",
        name: "Mandiri Virtual Account",
        type: "bank_transfer",
        icon: "🏦",
        description: "Transfer ke Mandiri Virtual Account",
      },
      {
        id: "credit_card",
        name: "Credit Card",
        type: "credit_card",
        icon: "💳",
        description: "Visa, Mastercard, JCB",
      },
      {
        id: "gopay",
        name: "GoPay",
        type: "e_wallet",
        icon: "📱",
        description: "Bayar dengan GoPay",
      },
      {
        id: "shopeepay",
        name: "ShopeePay",
        type: "e_wallet",
        icon: "📱",
        description: "Bayar dengan ShopeePay",
      },
      {
        id: "alfamart",
        name: "Alfamart",
        type: "convenience_store",
        icon: "🏪",
        description: "Bayar di Alfamart terdekat",
      },
      {
        id: "indomaret",
        name: "Indomaret",
        type: "convenience_store",
        icon: "🏪",
        description: "Bayar di Indomaret terdekat",
      },
    ];
  }

  /**
   * Format order number
   */
  static formatOrderNumber(orderId: string): string {
    return `ORD-${orderId.slice(-8).toUpperCase()}`;
  }

  /**
   * Calculate order total
   */
  static calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  /**
   * Validate order data
   */
  static validateOrderData(data: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      errors.push("At least one item is required");
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.productId) {
          errors.push(`Product ID is required for item ${index + 1}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Quantity must be greater than 0 for item ${index + 1}`);
        }
      });
    }

    if (!data.shippingAddress || data.shippingAddress.trim() === "") {
      errors.push("Shipping address is required");
    }

    if (!data.paymentMethod) {
      errors.push("Payment method is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
