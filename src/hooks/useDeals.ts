import { useState, useEffect } from "react";
import { apiClient, Deal } from "@/lib/api";

export const useDeals = (params?: {
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  isFlashSale?: boolean;
  page?: number;
  limit?: number;
  includeExpired?: boolean;
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getDeals(params);
      setDeals(response?.deals || []);
      setPagination(
        response?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch deals");
      console.error("Error fetching deals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [JSON.stringify(params)]);

  return {
    deals,
    pagination,
    isLoading,
    error,
    refetch: fetchDeals,
  };
};

export const useFlashSales = () => {
  const [flashSales, setFlashSales] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getFlashSales();
      setFlashSales(response?.deals || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch flash sales");
      console.error("Error fetching flash sales:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSales();
  }, []);

  return {
    flashSales,
    isLoading,
    error,
    refetch: fetchFlashSales,
  };
};

export const useFeaturedDeals = () => {
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedDeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getFeaturedDeals();
      setFeaturedDeals(response?.deals || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch featured deals");
      console.error("Error fetching featured deals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedDeals();
  }, []);

  return {
    featuredDeals,
    isLoading,
    error,
    refetch: fetchFeaturedDeals,
  };
};

export const useDealById = (id: string) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeal = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getDealById(id);
      setDeal(response || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch deal");
      console.error("Error fetching deal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [id]);

  return {
    deal,
    isLoading,
    error,
    refetch: fetchDeal,
  };
};
