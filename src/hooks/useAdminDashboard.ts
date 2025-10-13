import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  paymentStatus: string;
  date: string;
  imageUrl?: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

export const useAdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createDefaultData = (): DashboardData => ({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      userGrowth: 0,
      productGrowth: 0,
      orderGrowth: 0,
      revenueGrowth: 0,
    },
    recentOrders: [
      {
        id: "sample-1",
        customer: "Test Customer",
        amount: 270000,
        status: "COMPLETED",
        paymentStatus: "SUCCEEDED",
        date: new Date().toLocaleDateString("id-ID"),
        imageUrl: "/logo-putih.png", // Fallback image
      },
      {
        id: "sample-2",
        customer: "Test Customer",
        amount: 300000,
        status: "PENDING",
        paymentStatus: "PENDING",
        date: new Date().toLocaleDateString("id-ID"),
        imageUrl: "/logo-putih.png", // Fallback image
      },
    ],
  });

  const transformBackendData = (backendData: any): DashboardData => {
    try {
      return {
        stats: {
          totalUsers: Number(backendData.overview?.totalUsers) || 0,
          totalProducts: Number(backendData.overview?.totalProducts) || 0,
          totalOrders: Number(backendData.overview?.totalOrders) || 0,
          totalRevenue: Number(backendData.overview?.totalRevenue) || 0,
          userGrowth: 0,
          productGrowth: 0,
          orderGrowth: 0,
          revenueGrowth: 0,
        },
        recentOrders: Array.isArray(backendData.recentOrders)
          ? backendData.recentOrders.map((order: any) => {
              // Try multiple sources for product image
              let imageUrl = null;

              // Check if order has items with products
              if (
                order.items &&
                Array.isArray(order.items) &&
                order.items.length > 0
              ) {
                const firstItem = order.items[0];
                if (
                  firstItem.product &&
                  firstItem.product.images &&
                  Array.isArray(firstItem.product.images) &&
                  firstItem.product.images.length > 0
                ) {
                  imageUrl = firstItem.product.images[0].url;
                }
              }

              // Fallback: check direct product reference
              if (
                !imageUrl &&
                order.product &&
                order.product.images &&
                Array.isArray(order.product.images) &&
                order.product.images.length > 0
              ) {
                imageUrl = order.product.images[0].url;
              }

              // Fallback: check if order has a single product
              if (
                !imageUrl &&
                order.productId &&
                order.product &&
                order.product.images &&
                Array.isArray(order.product.images) &&
                order.product.images.length > 0
              ) {
                imageUrl = order.product.images[0].url;
              }

              return {
                id: String(order.id || ""),
                customer: String(
                  order.user?.name || order.customer?.name || "Unknown"
                ),
                amount: Number(order.totalAmount || order.amount || 0),
                status: String(order.status || "PENDING"),
                paymentStatus: String(order.paymentStatus || "PENDING"),
                date: order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("id-ID")
                  : new Date().toLocaleDateString("id-ID"),
                imageUrl,
              };
            })
          : [],
      };
    } catch (err) {
      console.error("Error transforming backend data:", err);
      return createDefaultData();
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const statsResponse = await apiClient.getDashboardStats();

        if (statsResponse.success && statsResponse.data) {
          const transformedData = transformBackendData(statsResponse.data);
          setData(transformedData);
        } else {
          setData(createDefaultData());
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data"
        );
        setData(createDefaultData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const statsResponse = await apiClient.getDashboardStats();

      if (statsResponse.success && statsResponse.data) {
        const transformedData = transformBackendData(statsResponse.data);
        setData(transformedData);
      } else {
        setData(createDefaultData());
      }
    } catch (err) {
      console.error("Error refetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
      setData(createDefaultData());
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
