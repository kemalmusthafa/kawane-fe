import useSWR from "swr";
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
  items?: Array<{
    id: string;
    quantity: number;
    product?: {
      id: string;
      name: string;
    };
  }>;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

// ✅ OPTIMIZED: SWR fetcher function
const dashboardFetcher = async (url: string): Promise<DashboardData> => {
  try {
    const response = await apiClient.getDashboardStats();
    if (response.success && response.data) {
      return transformBackendData(response.data);
    }
    return createDefaultData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return createDefaultData();
  }
};

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
  recentOrders: [],
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
              items: Array.isArray(order.items)
                ? order.items.map((item: any) => ({
                    id: String(item.id || ""),
                    quantity: Number(item.quantity || 0),
                    product: item.product
                      ? {
                          id: String(item.product.id || ""),
                          name: String(item.product.name || "Unknown Product"),
                        }
                      : undefined,
                  }))
                : [],
            };
          })
        : [],
    };
  } catch (err) {
    console.error("Error transforming backend data:", err);
    return createDefaultData();
  }
};

// ✅ OPTIMIZED: Use SWR for caching and performance (Limit-friendly)
export const useAdminDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/dashboard/stats",
    dashboardFetcher,
    {
      // ✅ Performance optimizations (Limit-friendly)
      revalidateOnFocus: false, // Don't refetch on window focus
      revalidateOnReconnect: false, // Don't refetch on reconnect
      refreshInterval: 60000, // ✅ Increased to 1 minute (reduce API calls)
      dedupingInterval: 30000, // ✅ Increased to 30 seconds (reduce API calls)
      errorRetryCount: 2, // ✅ Reduced to 2 retries (reduce API calls)
      errorRetryInterval: 10000, // ✅ Increased to 10 seconds (reduce API calls)
      shouldRetryOnError: (error) => {
        // Only retry on network errors, not 4xx/5xx
        return !error.status || error.status >= 500;
      },
      // ✅ Fallback data
      fallbackData: createDefaultData(),
    }
  );

  const refetch = async () => {
    try {
      await mutate();
    } catch (err) {
      console.error("Error refetching dashboard data:", err);
    }
  };

  return {
    data: data || createDefaultData(),
    error: error?.message || null,
    isLoading,
    refetch,
  };
};
