/**
 * Payment Gateway Service
 * Handles Midtrans payment integration
 */

import { apiClient } from "@/lib/api";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "credit_card" | "e_wallet" | "convenience_store";
  icon?: string;
  description?: string;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  paymentMethod: string;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
}

export interface PaymentResponse {
  paymentUrl?: string;
  paymentToken?: string;
  status: string;
  message: string;
}

export interface PaymentStatus {
  orderId: string;
  status: string;
  paymentStatus: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  paidAt?: string;
  failureReason?: string;
}

export class PaymentService {
  /**
   * Create payment for order
   */
  static async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await apiClient.createPayment(data);
      return (
        response.data || {
          status: "failed",
          message: "Failed to create payment",
        }
      );
    } catch (error: any) {
      throw new Error(error.message || "Failed to create payment");
    }
  }

  /**
   * Get payment status
   */
  static async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await apiClient.getPaymentStatus(orderId);
      return {
        orderId,
        status: response.data?.status || "unknown",
        paymentStatus: response.data?.paymentStatus || "unknown",
        transactionId: undefined,
        paymentMethod: undefined,
        amount: undefined,
        paidAt: undefined,
        failureReason: undefined,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to get payment status");
    }
  }

  /**
   * Handle payment callback (webhook)
   */
  static async handlePaymentCallback(
    callbackData: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.handlePaymentCallback(callbackData);
      return (
        response.data || {
          success: false,
          message: "Failed to handle payment callback",
        }
      );
    } catch (error: any) {
      throw new Error(error.message || "Failed to handle payment callback");
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
   * Format payment amount for display
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Get payment method by ID
   */
  static getPaymentMethodById(id: string): PaymentMethod | undefined {
    return this.getPaymentMethods().find((method) => method.id === id);
  }

  /**
   * Validate payment data
   */
  static validatePaymentData(data: PaymentData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.orderId) {
      errors.push("Order ID is required");
    }

    if (!data.amount || data.amount <= 0) {
      errors.push("Valid amount is required");
    }

    if (!data.paymentMethod) {
      errors.push("Payment method is required");
    }

    if (!data.customerDetails.name) {
      errors.push("Customer name is required");
    }

    if (!data.customerDetails.email) {
      errors.push("Customer email is required");
    }

    if (!data.shippingAddress.street) {
      errors.push("Shipping address is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate payment reference
   */
  static generatePaymentReference(orderId: string): string {
    const timestamp = Date.now().toString().slice(-6);
    return `PAY-${orderId.slice(-8)}-${timestamp}`;
  }

  /**
   * Check if payment method is available
   */
  static isPaymentMethodAvailable(methodId: string): boolean {
    const method = this.getPaymentMethodById(methodId);
    return !!method;
  }

  /**
   * Get payment method display name
   */
  static getPaymentMethodDisplayName(methodId: string): string {
    const method = this.getPaymentMethodById(methodId);
    return method?.name || methodId;
  }

  /**
   * Get payment method icon
   */
  static getPaymentMethodIcon(methodId: string): string {
    const method = this.getPaymentMethodById(methodId);
    return method?.icon || "💳";
  }
}
