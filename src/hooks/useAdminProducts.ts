import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { Product } from "@/lib/api";

interface AdminProduct extends Product {
  status: "active" | "inactive" | "out_of_stock";
}

interface AdminProductsData {
  products: AdminProduct[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface AdminProductsParams {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
}

export const useAdminProducts = (params: AdminProductsParams = {}) => {
  const [data, setData] = useState<AdminProductsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchProducts = useCallback(
    async (isSearch = false) => {
      try {
        if (isSearch) {
          setIsSearching(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const response = await apiClient.getProducts({
          search: params.search,
          categoryId: params.categoryId,
          status: params.status,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "createdAt",
          sortOrder: params.sortOrder || "desc",
        });

        if (response.success && response.data) {
          const backendData = response.data as any;
          const transformedProducts: AdminProduct[] = (
            backendData.products || []
          ).map((product: any) => ({
            ...product,
            status: product.stock === 0 ? "out_of_stock" : "active",
          }));

          setData({
            products: transformedProducts,
            totalItems: backendData.pagination?.totalItems || 0,
            totalPages: backendData.pagination?.totalPages || 1,
            currentPage: backendData.pagination?.page || 1,
          });
        } else {
          setError("Failed to fetch products");
          setData({
            products: [],
            totalItems: 0,
            totalPages: 1,
            currentPage: 1,
          });
        }
      } catch (err) {
        console.error("Error fetching admin products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        setData({
          products: [],
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        });
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsInitialLoad(false);
      }
    },
    [
      params.search,
      params.categoryId,
      params.status,
      params.minPrice,
      params.maxPrice,
      params.page,
      params.limit,
      params.sortBy,
      params.sortOrder,
    ]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (params.search !== undefined) {
        fetchProducts(true); // isSearch = true
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [params.search, fetchProducts]);

  // Other parameters effect (non-debounced) - triggers immediately
  useEffect(() => {
    if (!isInitialLoad) {
      fetchProducts(false); // isSearch = false
    }
  }, [
    params.categoryId,
    params.status,
    params.minPrice,
    params.maxPrice,
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
    isInitialLoad,
    fetchProducts,
  ]);

  // Initial load effect
  useEffect(() => {
    if (isInitialLoad) {
      fetchProducts(false);
    }
  }, [isInitialLoad, fetchProducts]);

  const createProduct = async (productData: {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    stock: number;
    sku?: string;
  }) => {
    try {
      const response = await apiClient.createProduct(productData);
      if (response.success) {
        await fetchProducts(); // Refresh the list
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create product",
      };
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Product>
  ) => {
    try {
      const response = await apiClient.updateProduct(productId, productData);
      if (response.success) {
        await fetchProducts(); // Refresh the list
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update product",
      };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await apiClient.deleteProduct(productId);
      if (response.success) {
        await fetchProducts(); // Refresh the list
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete product",
      };
    }
  };

  return {
    data,
    isLoading,
    isSearching,
    error,
    refetch: () => fetchProducts(false),
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
