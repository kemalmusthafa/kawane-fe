import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";

interface AdminOrder {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AdminOrdersData {
  orders: AdminOrder[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface AdminOrdersParams {
  search?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "totalAmount" | "status";
  sortOrder?: "asc" | "desc";
}

export const useAdminOrders = (params: AdminOrdersParams = {}) => {
  const [data, setData] = useState<AdminOrdersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      // Differentiate between initial load and search/filter operations
      if (isInitialLoad) {
        setIsLoading(true);
      } else if (params.search) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Use status directly since we're now using backend values in the frontend
      const backendStatus = params.status;

      // Use the dedicated admin orders API
      const response = await apiClient.getAdminOrders({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        status: backendStatus,
      });

      if (response.success && response.data) {
        const backendData = response.data as any;
        const transformedOrders: AdminOrder[] = (backendData.orders || []).map(
          (order: any) => ({
            id: order.id,
            orderNumber:
              order.orderNumber || `ORD-${order.id.slice(-6).toUpperCase()}`,
            user: {
              id: order.user?.id || "",
              name: order.user?.name || "Unknown Customer",
              email: order.user?.email || "",
            },
            items:
              order.items?.map((item: any) => ({
                id: item.id,
                product: {
                  id: item.product?.id || "",
                  name: item.product?.name || "Unknown Product",
                  price: item.product?.price || 0,
                },
                quantity: item.quantity || 0,
                subtotal: (item.product?.price || 0) * (item.quantity || 0),
              })) || [],
            totalAmount: order.totalAmount || 0,
            status: order.status || "pending",
            paymentStatus: order.paymentStatus || "pending",
            shippingAddress: {
              street: order.address?.detail || "",
              city: order.address?.city || "",
              postalCode: order.address?.postalCode || "",
              country: order.address?.province || "",
            },
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: order.updatedAt || new Date().toISOString(),
          })
        );

        setData({
          orders: transformedOrders,
          totalItems: backendData.pagination?.totalItems || 0,
          totalPages: backendData.pagination?.totalPages || 1,
          currentPage: backendData.pagination?.page || 1,
        });
      } else {
        setError("Failed to fetch orders");
        setData({
          orders: [],
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        });
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setData({
        orders: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
      setIsInitialLoad(false);
    }
  }, [
    params.search,
    params.status,
    params.paymentStatus,
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
  ]);

  // Debounced search effect
  useEffect(() => {
    if (params.search) {
      const timeoutId = setTimeout(() => {
        fetchOrders();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      fetchOrders();
    }
  }, [params.search, fetchOrders]);

  // Other parameters effect
  useEffect(() => {
    if (!isInitialLoad) {
      fetchOrders();
    }
  }, [
    params.status,
    params.paymentStatus,
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
    fetchOrders,
  ]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      // Convert frontend status to backend enum format
      const statusMap: { [key: string]: string } = {
        pending: "PENDING",
        processing: "PENDING", // Map processing to PENDING for now
        shipped: "SHIPPED",
        delivered: "COMPLETED",
        completed: "COMPLETED",
        cancelled: "CANCELLED",
      };

      const backendStatus =
        statusMap[status.toLowerCase()] || status.toUpperCase();

      // Call the correct order status update API
      const response = await apiClient.updateOrderStatus(
        orderId,
        backendStatus
      );
      if (response.success) {
        await fetchOrders(); // Refresh the list
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to update order status",
      };
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: string
  ) => {
    try {
      // For now, we'll use the order status update as a workaround
      // since we need to find the payment ID from the order
      // This is a simplified approach - in production you'd want to
      // get the payment ID from the order data first

      // Convert frontend payment status to backend enum format
      const paymentStatusMap: { [key: string]: string } = {
        pending: "PENDING",
        paid: "SUCCEEDED",
        succeeded: "SUCCEEDED",
        failed: "CANCELLED",
        cancelled: "CANCELLED",
        expired: "EXPIRED",
        refunded: "CANCELLED",
      };

      const backendPaymentStatus =
        paymentStatusMap[paymentStatus.toLowerCase()] ||
        paymentStatus.toUpperCase();

      // For now, we'll update the order status instead of payment status
      // This is a temporary workaround until we implement proper payment status update
      const response = await apiClient.updateOrderStatus(orderId, "PAID");
      if (response.success) {
        await fetchOrders(); // Refresh the list
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to update payment status",
      };
    }
  };

  return {
    data,
    isLoading: isLoading && !data,
    isSearching,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
  };
};
