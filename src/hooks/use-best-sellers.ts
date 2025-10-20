import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface BestSellerProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  stock: number;
  status: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
      category: {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
      } | null;
  images: Array<{
    id: string;
    url: string;
    productId: string;
  }>;
  _count: {
    reviews: number;
    wishlist: number;
  };
  rating: number;
  deal: any;
  totalSold: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  bestSellerScore: number;
}

export interface BestSellersData {
  bestSellers: BestSellerProduct[];
  timeRange: string;
  totalProducts: number;
  metrics: {
    averageScore: number;
    totalSold: number;
    totalRevenue: number;
  };
}

export interface UseBestSellersParams {
  limit?: number;
  categoryId?: string;
  timeRange?: "week" | "month" | "quarter" | "year" | "all";
  enabled?: boolean;
}

export const useBestSellers = (params: UseBestSellersParams = {}) => {
  const { limit = 4, categoryId, timeRange = "month", enabled = true } = params;

  const [data, setData] = useState<BestSellersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBestSellers = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getBestSellers({
        limit,
        categoryId,
        timeRange,
      });

      if (response.success && response.data) {
        setData(response.data as unknown as BestSellersData);
      } else {
        setError("Failed to fetch best sellers");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, [limit, categoryId, timeRange, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchBestSellers,
  };
};
