import useSWR, { mutate } from "swr";
import { useCallback, useMemo } from "react";
import {
  apiClient,
  type ApiResponse,
  type User,
  type Product,
  type Order,
  type Address,
  type Payment,
  type Notification,
  type Shipment,
  type Review,
  type InventoryItem,
  type AnalyticsData,
  type Report,
} from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

// Generic fetcher function - REMOVED: Use apiClient directly

// Auth Hooks - REMOVED: Use useAuth from providers/auth-provider.tsx instead

// User Hooks
export const useUser = (userId?: string) => {
  const {
    data,
    error,
    isLoading,
    mutate: mutateUser,
  } = useSWR(
    userId ? `/users/${userId}` : null,
    useCallback(async () => {
      if (!userId) return null;
      return await apiClient.getUser(userId);
    }, [userId])
  );

  const updateUser = async (userData: Partial<User>) => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await apiClient.updateUser(userId, userData);
      if (response.success) {
        // Revalidate the data instead of passing response.data
        mutateUser();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (type: "soft" | "hard" = "soft") => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await apiClient.deleteUser(userId, type);
      if (response.success) {
        mutateUser(undefined, { revalidate: false });
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    user: data?.data,
    error,
    isLoading,
    updateUser,
    deleteUser,
    mutateUser,
  };
};

export const useUsers = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (params?.search) qs.append("search", params.search);
    if (params?.page) qs.append("page", params.page.toString());
    if (params?.limit) qs.append("limit", params.limit.toString());
    return qs;
  }, [params?.search, params?.page, params?.limit]);

  const {
    data,
    error,
    isLoading,
    mutate: mutateUsers,
  } = useSWR(
    `/users?${queryString.toString()}`,
    useCallback(async () => {
      return await apiClient.getUsers(params);
    }, [params?.search, params?.page, params?.limit])
  );

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.createUser(userData);
      if (response.success) {
        mutateUsers();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: any) => {
    try {
      const response = await apiClient.updateUser(userId, userData);
      if (response.success) {
        mutateUsers();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (userId: string, type: "soft" | "hard" = "soft") => {
    try {
      const response = await apiClient.deleteUser(userId, type);
      if (response.success) {
        mutateUsers();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    users: data?.data?.users || [],
    error,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    mutateUsers,
  };
};

// Product Hooks
export const useProducts = (params?: {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (params?.search) qs.append("search", params.search);
    if (params?.categoryId) qs.append("categoryId", params.categoryId);
    if (params?.minPrice) qs.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice) qs.append("maxPrice", params.maxPrice.toString());
    if (params?.inStock !== undefined)
      qs.append("inStock", params.inStock.toString());
    if (params?.page) qs.append("page", params.page.toString());
    if (params?.limit) qs.append("limit", params.limit.toString());
    if (params?.sortBy) qs.append("sortBy", params.sortBy);
    if (params?.sortOrder) qs.append("sortOrder", params.sortOrder);
    return qs;
  }, [
    params?.search,
    params?.categoryId,
    params?.minPrice,
    params?.maxPrice,
    params?.inStock,
    params?.page,
    params?.limit,
    params?.sortBy,
    params?.sortOrder,
  ]);

  const {
    data,
    error,
    isLoading,
    mutate: mutateProducts,
  } = useSWR(
    `/products?${queryString.toString()}`,
    useCallback(async () => {
      return await apiClient.getProducts(params);
    }, [
      params?.search,
      params?.categoryId,
      params?.minPrice,
      params?.maxPrice,
      params?.inStock,
      params?.page,
      params?.limit,
      params?.sortBy,
      params?.sortOrder,
    ])
  );

  const createProduct = async (productData: {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    stock: number;
    sku?: string;
    sizes?: Array<{
      size: string;
      stock: number;
    }>;
    images?: string[];
  }) => {
    try {
      const response = await apiClient.createProduct(productData);
      if (response.success) {
        mutateProducts();
        // Also invalidate all products cache
        mutate((key) => typeof key === "string" && key.startsWith("/products"));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (productId: string, productData: any) => {
    try {
      const response = await apiClient.updateProduct(productId, productData);
      if (response.success) {
        mutateProducts();
        // Also invalidate all products cache
        mutate((key) => typeof key === "string" && key.startsWith("/products"));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await apiClient.deleteProduct(productId);
      if (response.success) {
        mutateProducts();
        // Also invalidate all products cache
        mutate((key) => typeof key === "string" && key.startsWith("/products"));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    products: Array.isArray((data as any)?.data?.products)
      ? (data as any).data.products
      : [],
    pagination: (data as any)?.data?.pagination,
    error,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    mutateProducts,
  };
};

export const useProduct = (productId: string) => {
  const {
    data,
    error,
    isLoading,
    mutate: mutateProduct,
  } = useSWR(
    productId ? `/products/${productId}` : null,
    useCallback(async () => {
      if (!productId) return null;
      return await apiClient.getProduct(productId);
    }, [productId])
  );

  const updateProduct = async (productData: Partial<Product>) => {
    try {
      const response = await apiClient.updateProduct(productId, productData);
      if (response.success) {
        // Revalidate the data instead of passing response.data
        mutateProduct();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    product: data?.data,
    error,
    isLoading,
    updateProduct,
    mutateProduct,
  };
};

// Order Hooks
export const useOrders = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { isAuthenticated } = useAuth();
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (params?.status) qs.append("status", params.status);
    if (params?.page) qs.append("page", params.page.toString());
    if (params?.limit) qs.append("limit", params.limit.toString());
    return qs;
  }, [params?.status, params?.page, params?.limit]);

  const {
    data,
    error,
    isLoading,
    mutate: mutateOrders,
  } = useSWR(
    isAuthenticated ? `/orders?${queryString.toString()}` : null,
    useCallback(async () => {
      if (!isAuthenticated) return null;
      return await apiClient.getOrders(params);
    }, [isAuthenticated, params?.status, params?.page, params?.limit])
  );

  const createOrder = async (orderData: {
    items: { productId: string; quantity: number }[];
    totalAmount?: number;
    shippingAddress: string;
    paymentMethod: string;
    addressId?: string | null;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.createOrder(orderData);
      if (response.success) {
        mutateOrders();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await apiClient.updateOrderStatus(orderId, status);
      if (response.success) {
        mutateOrders();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    orders: Array.isArray(data?.data?.orders) ? data.data.orders : [],
    pagination: data?.data?.pagination,
    error,
    isLoading,
    createOrder,
    updateOrderStatus,
    mutateOrders,
  };
};

// Admin Orders Hook
export const useAdminOrders = (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { isAuthenticated, user } = useAuth();

  console.log("🔍 useAdminOrders auth check:", {
    isAuthenticated,
    user: user?.email,
  });

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (params?.status) qs.append("status", params.status);
    if (params?.page) qs.append("page", params.page.toString());
    if (params?.limit) qs.append("limit", params.limit.toString());
    if (params?.search) qs.append("search", params.search);
    return qs;
  }, [params?.status, params?.page, params?.limit, params?.search]);

  const {
    data,
    error,
    isLoading,
    mutate: mutateOrders,
  } = useSWR(
    isAuthenticated ? `/admin/orders?${queryString.toString()}` : null,
    useCallback(async () => {
      if (!isAuthenticated) return null;
      try {
        console.log("🔍 useAdminOrders fetching with params:", params);
        const response = await apiClient.getAdminOrders(params);
        console.log("📦 useAdminOrders response:", response);
        return response;
      } catch (error) {
        console.error("Error fetching admin orders:", error);
        throw error;
      }
    }, [
      isAuthenticated,
      params?.status,
      params?.page,
      params?.limit,
      params?.search,
    ]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 120000, // Refresh every 2 minutes (reduce API calls)
      dedupingInterval: 60000, // Dedupe requests within 1 minute (reduce API calls)
      errorRetryCount: 1, // Reduce retries (reduce API calls)
      errorRetryInterval: 15000, // Increase retry interval (reduce API calls)
      focusThrottleInterval: 120000, // Throttle focus revalidation
      loadingTimeout: 15000, // Timeout after 15 seconds
      keepPreviousData: true, // Keep previous data while loading
      suspense: false, // Disable suspense mode
    }
  );

  return {
    data: data?.data,
    orders: Array.isArray(data?.data?.orders) ? data.data.orders : [],
    totalItems: data?.data?.pagination?.totalItems || 0,
    totalPages: data?.data?.pagination?.totalPages || 1,
    pagination: data?.data?.pagination,
    error,
    isLoading,
    mutateOrders,
  };
};

// Address Hooks
export const useAddresses = (params?: { page?: number; limit?: number }) => {
  const queryString = new URLSearchParams();
  if (params?.page) queryString.append("page", params.page.toString());
  if (params?.limit) queryString.append("limit", params.limit.toString());

  const {
    data,
    error,
    isLoading,
    mutate: mutateAddresses,
  } = useSWR(`/api/addresses?${queryString.toString()}`, () =>
    apiClient.getAddresses(params)
  );

  const createAddress = async (addressData: {
    detail: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault?: boolean; // Made optional for now
  }) => {
    try {
      const response = await apiClient.createAddress(addressData);
      if (response.success) {
        mutateAddresses();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateAddress = async (addressId: string, addressData: any) => {
    try {
      const response = await apiClient.updateAddress(addressId, addressData);
      if (response.success) {
        mutateAddresses();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const response = await apiClient.deleteAddress(addressId);
      if (response.success) {
        mutateAddresses();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    addresses: Array.isArray(data?.data?.addresses) ? data.data.addresses : [],
    pagination: data?.data?.pagination,
    error,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    mutateAddresses,
  };
};

// Payment Hooks
export const usePayments = (params?: {
  orderId?: string;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const queryString = new URLSearchParams();
  if (params?.orderId) queryString.append("orderId", params.orderId);
  if (params?.status) queryString.append("status", params.status);
  if (params?.page) queryString.append("page", params.page.toString());
  if (params?.limit) queryString.append("limit", params.limit.toString());
  if (params?.startDate) queryString.append("startDate", params.startDate);
  if (params?.endDate) queryString.append("endDate", params.endDate);

  const { isAuthenticated } = useAuth();
  const {
    data,
    error,
    isLoading,
    mutate: mutatePayments,
  } = useSWR(
    isAuthenticated ? `/api/payments?${queryString.toString()}` : null,
    () => apiClient.getPayments(params)
  );

  const createPayment = async (paymentData: {
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
  }) => {
    try {
      const response = await apiClient.createPayment(paymentData);
      if (response.success) {
        mutatePayments();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    try {
      const response = await apiClient.updatePaymentStatus(paymentId, status);
      if (response.success) {
        mutatePayments();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    payments: Array.isArray(data?.data?.payments) ? data.data.payments : [],
    pagination: data?.data?.pagination,
    error,
    isLoading,
    createPayment,
    updatePaymentStatus,
    mutatePayments,
  };
};

// Notification Hooks
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}) => {
  const queryString = new URLSearchParams();
  if (params?.page) queryString.append("page", params.page.toString());
  if (params?.limit) queryString.append("limit", params.limit.toString());
  if (params?.isRead !== undefined)
    queryString.append("isRead", params.isRead.toString());
  if (params?.type) queryString.append("type", params.type);

  const {
    data,
    error,
    isLoading,
    mutate: mutateNotifications,
  } = useSWR(`/api/notifications?${queryString.toString()}`, () =>
    apiClient.getCustomerNotifications(params)
  );

  const markAsRead = async (
    notificationId: string,
    markAll: boolean = false
  ) => {
    try {
      const response = await apiClient.markCustomerNotificationAsRead(
        notificationId,
        markAll
      );
      if (response.success) {
        mutateNotifications();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiClient.markCustomerNotificationAsRead("", true);
      if (response.success) {
        mutateNotifications();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    notifications: Array.isArray(data?.data) ? data.data : [],
    error,
    isLoading,
    markAsRead,
    markAllAsRead,
    mutateNotifications,
    unreadCount: data?.data?.unreadCount || 0,
  };
};

export const useCustomerNotifications = () => {
  const getOrderTrackingNotifications = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => {
    try {
      const response = await apiClient.getOrderTrackingNotifications(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getProductNotifications = async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => {
    try {
      const response = await apiClient.getProductNotifications(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getUnreadCount = async () => {
    try {
      const response = await apiClient.getUnreadNotificationCount();
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    getOrderTrackingNotifications,
    getProductNotifications,
    getUnreadCount,
  };
};

// Shipment Hooks
export const useShipments = (params?: {
  orderId?: string;
  status?: string;
  carrier?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const queryString = new URLSearchParams();
  if (params?.orderId) queryString.append("orderId", params.orderId);
  if (params?.status) queryString.append("status", params.status);
  if (params?.carrier) queryString.append("carrier", params.carrier);
  if (params?.page) queryString.append("page", params.page.toString());
  if (params?.limit) queryString.append("limit", params.limit.toString());
  if (params?.startDate) queryString.append("startDate", params.startDate);
  if (params?.endDate) queryString.append("endDate", params.endDate);

  const {
    data,
    error,
    isLoading,
    mutate: mutateShipments,
  } = useSWR(`/api/shipments?${queryString.toString()}`, () =>
    apiClient.getCustomerShipments(params)
  );

  const createShipment = async (shipmentData: {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    method: string;
    estimatedDelivery: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.createCustomerShipment(shipmentData);
      if (response.success) {
        mutateShipments();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateShipment = async (
    shipmentId: string,
    shipmentData: Partial<Shipment>
  ) => {
    try {
      const response = await apiClient.updateCustomerShipment(
        shipmentId,
        shipmentData
      );
      if (response.success) {
        mutateShipments();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteShipment = async (shipmentId: string) => {
    try {
      const response = await apiClient.deleteCustomerShipment(shipmentId);
      if (response.success) {
        mutateShipments();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    shipments: data?.data || [],
    error,
    isLoading,
    createShipment,
    updateShipment,
    deleteShipment,
    mutateShipments,
  };
};

export const useShipment = (shipmentId: string) => {
  const {
    data,
    error,
    isLoading,
    mutate: mutateShipment,
  } = useSWR(shipmentId ? `/api/shipments/${shipmentId}` : null, () =>
    apiClient.getShipment(shipmentId)
  );

  return {
    shipment: data?.data,
    error,
    isLoading,
    mutateShipment,
  };
};

export const useShipmentTracking = () => {
  const trackShipment = async (trackingNumber: string) => {
    try {
      const response = await apiClient.trackShipment(trackingNumber);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    trackShipment,
  };
};

// Review Hooks
export const useReviews = (productId?: string) => {
  const {
    data: reviews,
    error,
    isLoading,
    mutate: mutateReviews,
  } = useSWR(productId ? `/reviews/${productId}` : null, () =>
    productId ? apiClient.getReviews(productId) : null
  );

  const createReview = async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    try {
      const response = await apiClient.createReview(reviewData);
      if (response.success) {
        mutateReviews();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    reviews: reviews || [],
    error,
    isLoading,
    createReview,
    mutateReviews,
  };
};

// Wishlist Hooks
export const useWishlist = () => {
  const { isAuthenticated, logout } = useAuth();
  const {
    data: wishlist,
    error,
    isLoading,
    mutate,
  } = useSWR(
    isAuthenticated ? "/wishlist" : null,
    useCallback(() => apiClient.getWishlist(), [])
  );

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error("Login required to manage wishlist");
    }
    try {
      const response = await apiClient.toggleWishlist(productId);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Login required")) {
        // Clear the user state when authentication fails
        logout();
      }
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return (
      wishlist?.data?.wishlist?.some(
        (item: any) => item.productId === productId
      ) || false
    );
  };

  return {
    wishlist: wishlist?.data?.wishlist || [],
    totalItems: wishlist?.data?.totalItems || 0,
    error,
    isLoading,
    toggleWishlist,
    isInWishlist,
  };
};

// Cart Hooks
export const useCartApi = () => {
  const { isAuthenticated, logout } = useAuth();
  const {
    data: cart,
    error,
    isLoading,
    mutate,
  } = useSWR(
    isAuthenticated ? "/cart" : null,
    useCallback(() => apiClient.getCart(), [])
  );

  const addToCart = async (
    productId: string,
    quantity: number,
    size?: string
  ) => {
    if (!isAuthenticated) {
      throw new Error("Login required to add items to cart");
    }
    try {
      const response = await apiClient.addToCart(productId, quantity, size);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Login required")) {
        // Clear the user state when authentication fails
        logout();
      }
      throw error;
    }
  };

  const addDealToCart = async (
    dealId: string,
    productId: string,
    quantity: number
  ) => {
    if (!isAuthenticated) {
      throw new Error("Login required to add deals to cart");
    }
    try {
      const response = await apiClient.addDealToCart(
        dealId,
        productId,
        quantity
      );
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Login required")) {
        // Clear the user state when authentication fails
        logout();
      }
      throw error;
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error("Login required to update cart");
    }
    try {
      const response = await apiClient.updateCartItem(cartItemId, quantity);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!isAuthenticated) {
      throw new Error("Login required to remove items from cart");
    }
    try {
      const response = await apiClient.removeFromCart(cartItemId);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error("Login required to clear cart");
    }
    try {
      const response = await apiClient.clearCart();
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    cart: cart?.data?.cart,
    items: cart?.data?.cart?.items || [],
    totalItems: cart?.data?.totalItems || 0,
    totalAmount: cart?.data?.totalAmount || 0,
    error,
    isLoading,
    addToCart,
    addDealToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mutate,
  };
};

// Dashboard Hooks
export const useDashboard = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const {
    data: dashboardStats,
    error,
    isLoading,
  } = useSWR(
    params
      ? `/dashboard/stats?startDate=${params.startDate}&endDate=${params.endDate}`
      : null
  );

  const getStats = async (startDate?: string, endDate?: string) => {
    try {
      const response = await apiClient.getDashboardStats(startDate, endDate);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    dashboardStats,
    getStats,
    error,
    isLoading,
  };
};

// Category Hooks
export const useCategories = (params?: {
  page?: number;
  limit?: number;
  includeProducts?: boolean;
}) => {
  const queryString = new URLSearchParams();
  if (params?.page) queryString.append("page", params.page.toString());
  if (params?.limit) queryString.append("limit", params.limit.toString());
  if (params?.includeProducts)
    queryString.append("includeProducts", params.includeProducts.toString());

  const swrKey = queryString.toString()
    ? `/api/categories?${queryString.toString()}`
    : `/api/categories`;

  const {
    data,
    error,
    isLoading,
    mutate: mutateCategories,
  } = useSWR(swrKey, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const createCategory = async (categoryData: {
    name: string;
    description?: string;
  }) => {
    try {
      const response = await apiClient.createCategory(categoryData);
      if (response.success) {
        mutateCategories();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (
    categoryId: string,
    categoryData: { name: string; description?: string }
  ) => {
    try {
      const response = await apiClient.updateCategory(categoryId, categoryData);
      if (response.success) {
        mutateCategories();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await apiClient.deleteCategory(categoryId);
      if (response.success) {
        mutateCategories();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Fix data structure - data from SWR is the response object, not the data property
  // Try different data structures
  let categories = [];
  if (data?.success && Array.isArray(data.data)) {
    categories = data.data;
  } else if (Array.isArray(data)) {
    categories = data;
  } else if (data?.data && Array.isArray(data.data)) {
    categories = data.data;
  }

  return {
    categories,
    pagination: null,
    error,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    mutateCategories,
  };
};

// Inventory Hooks (Staff/Admin only)
export const useInventory = () => {
  const {
    data: stockSummary,
    error: summaryError,
    isLoading: summaryLoading,
  } = useSWR("/inventory/summary");

  const {
    data: lowStockProducts,
    error: lowStockError,
    isLoading: lowStockLoading,
  } = useSWR("/inventory/low-stock");

  const getLogs = async (params?: {
    productId?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await apiClient.getInventoryLogs(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createLog = async (logData: {
    productId: string;
    change: number;
    note: string;
  }) => {
    try {
      const response = await apiClient.createInventoryLog(logData);
      if (response.success) {
        mutate("/inventory/summary");
        mutate("/inventory/low-stock");
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSummary = async () => {
    try {
      const response = await apiClient.getInventorySummary();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getLowStockProducts = async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await apiClient.getLowStockProducts(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const runMonitoring = async () => {
    try {
      const response = await apiClient.runStockMonitoring();
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    stockSummary,
    lowStockProducts,
    error: summaryError || lowStockError,
    isLoading: summaryLoading || lowStockLoading,
    getLogs,
    createLog,
    getSummary,
    getLowStockProducts,
    runMonitoring,
  };
};

// Admin Hooks
export const useAdmin = () => {
  const createAdmin = async (adminData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.createAdmin(adminData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const createStaff = async (staffData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.createStaff(staffData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    createAdmin,
    createStaff,
  };
};

// Customer Notification Admin Hooks
export const useCustomerNotificationAdmin = () => {
  const sendProductLaunch = async (notificationData: {
    productId: string;
    title: string;
    message: string;
  }) => {
    try {
      const response = await apiClient.sendProductLaunchNotification(
        notificationData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendWishlistNotification = async (notificationData: {
    productId: string;
    notificationType: string;
  }) => {
    try {
      const response = await apiClient.sendWishlistNotification(
        notificationData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendFlashSale = async (notificationData: {
    productIds: string[];
    discountPercentage: number;
    endTime: string;
  }) => {
    try {
      const response = await apiClient.sendFlashSaleNotification(
        notificationData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    sendProductLaunch,
    sendWishlistNotification,
    sendFlashSale,
  };
};

// Admin Hooks

// Admin Shipments Hook
export const useAdminShipments = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  carrier?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { isAuthenticated, user } = useAuth();

  console.log("🔍 useAdminShipments auth check:", {
    isAuthenticated,
    user: user?.email,
  });

  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated
      ? `/shipments?${new URLSearchParams(
          Object.entries(params || {}).map(([key, value]) => [
            key,
            String(value),
          ])
        ).toString()}`
      : null,
    useCallback(async () => {
      console.log("🔍 useAdminShipments fetching with params:", params);
      const response = await apiClient.getShipments(params);
      console.log("📦 useAdminShipments response:", response);
      return response;
    }, [params]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 120000, // Refresh every 2 minutes
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      errorRetryCount: 1,
      errorRetryInterval: 15000,
      keepPreviousData: true,
    }
  );

  const createShipment = useCallback(
    async (shipmentData: {
      orderId: string;
      trackingNo?: string;
      courier: string;
      method: string;
      cost?: number;
      estimatedDays?: number;
      addressId?: string;
    }) => {
      try {
        const response = await apiClient.createShipment(shipmentData);
        if (response.success) {
          mutate();
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [mutate]
  );

  const updateShipment = useCallback(
    async (
      shipmentId: string,
      updateData: {
        courier?: string;
        trackingNo?: string;
        cost?: number;
        estimatedDays?: number;
        addressId?: string;
      }
    ) => {
      try {
        const response = await apiClient.updateShipment(shipmentId, updateData);
        if (response.success) {
          mutate();
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [mutate]
  );

  const completeDelivery = useCallback(
    async (shipmentId: string) => {
      try {
        const response = await apiClient.completeDelivery(shipmentId);
        if (response.success) {
          mutate();
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [mutate]
  );

  const deleteShipment = useCallback(
    async (shipmentId: string) => {
      try {
        const response = await apiClient.deleteShipment(shipmentId);
        if (response.success) {
          mutate();
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [mutate]
  );

  const getShipmentById = useCallback(async (shipmentId: string) => {
    try {
      const response = await apiClient.getShipmentById(shipmentId);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const getShipmentByTracking = useCallback(async (trackingNumber: string) => {
    try {
      const response = await apiClient.getShipmentByTracking(trackingNumber);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const getShipmentStats = useCallback(
    async (statsParams?: { startDate?: string; endDate?: string }) => {
      try {
        const response = await apiClient.getShipmentStats(statsParams);
        return response;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  // useAdminShipments returning data logged

  return {
    shipments: data?.data?.shipments || [],
    total: (data as any)?.data?.pagination?.total || 0,
    page: (data as any)?.data?.pagination?.page || 1,
    limit: (data as any)?.data?.pagination?.limit || 10,
    totalPages: (data as any)?.data?.pagination?.totalPages || 0,
    hasNextPage: (data as any)?.data?.pagination?.hasNextPage || false,
    hasPrevPage: (data as any)?.data?.pagination?.hasPrevPage || false,
    isLoading,
    error,
    createShipment,
    updateShipment,
    completeDelivery,
    deleteShipment,
    getShipmentById,
    getShipmentByTracking,
    getShipmentStats,
    mutate,
  };
};

// Admin Inventory Hook
export const useAdminInventory = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/inventory/summary?${new URLSearchParams(
      Object.entries(params || {}).map(([key, value]) => [key, String(value)])
    ).toString()}`,
    () => apiClient.getInventory(params)
  );

  const updateStock = async (
    productId: string,
    stockData: {
      currentStock?: number;
      minStock?: number;
      maxStock?: number;
      action: "ADD" | "SUBTRACT" | "SET";
      quantity?: number;
      reason?: string;
    }
  ) => {
    try {
      const response = await apiClient.updateStock(productId, stockData);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    inventory: data?.data?.inventory || [],
    total: data?.data?.total || 0,
    page: data?.data?.page || 1,
    limit: data?.data?.limit || 10,
    isLoading,
    error,
    updateStock,
    mutate,
  };
};

// Admin Analytics Hook
export const useAdminAnalytics = (params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/analytics?${new URLSearchParams(
      Object.entries(params || {}).map(([key, value]) => [key, String(value)])
    ).toString()}`,
    () => apiClient.getAnalytics(params)
  );

  return {
    analytics: data?.data,
    isLoading,
    error,
    mutate,
  };
};

// Admin Reports Hook
export const useAdminReports = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/reports?${new URLSearchParams(
      Object.entries(params || {}).map(([key, value]) => [key, String(value)])
    ).toString()}`,
    () => apiClient.getReports(params)
  );

  const generateReport = async (reportData: {
    type: string;
    period: string;
    format: string;
  }) => {
    try {
      const response = await apiClient.generateReport(reportData);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await apiClient.downloadReport(reportId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    reports: data?.data?.reports || [],
    total: data?.data?.total || 0,
    page: data?.data?.page || 1,
    limit: data?.data?.limit || 10,
    isLoading,
    error,
    generateReport,
    downloadReport,
    mutate,
  };
};

// Admin Notifications Hook
export const useAdminNotifications = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isRead?: boolean;
  priority?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/notifications?${new URLSearchParams(
      Object.entries(params || {})
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([key, value]) => [key, String(value)])
    ).toString()}`,
    () => apiClient.getAdminNotifications(params)
  );

  const sendNotification = async (notificationData: {
    title: string;
    message: string;
    type: string;
    priority: string;
    target: string;
  }) => {
    try {
      const response = await apiClient.request("/admin/notifications", {
        method: "POST",
        body: JSON.stringify(notificationData),
      });
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await apiClient.markNotificationAsRead(notificationId);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await apiClient.deleteNotification(notificationId);
      if (response.success) {
        mutate();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    notifications: data?.data?.notifications || [],
    total: data?.data?.pagination?.totalItems || 0,
    page: data?.data?.pagination?.page || 1,
    limit: data?.data?.pagination?.limit || 10,
    isLoading,
    error,
    sendNotification,
    markAsRead,
    deleteNotification,
    mutate,
  };
};
