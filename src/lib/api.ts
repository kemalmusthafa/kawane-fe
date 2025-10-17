// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  isDeleted?: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Deal {
  id: string;
  title: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE";
  value: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  startDate: string;
  endDate: string;
  image?: string;
  images?: DealImage[];
  isFlashSale: boolean;
  maxUses?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
  dealProducts?: DealProduct[];
}

export interface DealImage {
  id: string;
  url: string;
  dealId: string;
  createdAt: string;
}

export interface DealProduct {
  id: string;
  dealId: string;
  productId: string;
  product: Product & {
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    discountPercentage: number;
  };
  createdAt: string;
}

export interface LookbookPhoto {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
}

export interface ProductDeal {
  id: string;
  title: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE";
  value: number;
  isFlashSale: boolean;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  endDate: string;
}

export interface ProductSize {
  id: string;
  size: string;
  stock: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  sku?: string;
  sizes?: ProductSize[];
  images?: ProductImage[];
  category?: Category;
  rating?: number;
  deal?: ProductDeal | null;
  _count?: {
    reviews: number;
    wishlist: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  detail: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Admin Services Interfaces
export interface Shipment {
  id: string;
  orderId: string;
  courier?: string;
  trackingNo?: string;
  cost: number;
  estimatedDays?: number;
  addressId?: string;
  createdAt: string;
  updatedAt?: string;

  // Relations
  order?: {
    id: string;
    status: string;
    totalAmount: number;
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        sku: string;
        price: number;
      };
    }>;
  };
  address?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  };
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastRestock: string;
  lastSale?: string;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  category: string;
  product?: Product;
}

export interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    productsGrowth: number;
  };
  salesData: Array<{
    month: string;
    sales: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export interface Report {
  id: string;
  name: string;
  type: "SALES" | "INVENTORY" | "CUSTOMER" | "PRODUCT";
  period: string;
  status: "GENERATED" | "GENERATING" | "FAILED";
  createdAt: string;
  size: string;
  format: "PDF" | "EXCEL" | "CSV";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "UNREAD" | "READ";
  target: "ALL" | "ADMIN" | "CUSTOMER";
  createdAt: string;
  readAt?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  // Method to refresh token from localStorage
  private refreshToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Refresh token before each request
    this.refreshToken();

    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add existing headers if they exist
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    // Don't set Content-Type for FormData, let browser set it with boundary
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Log error details for debugging
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          url: url,
          data: data,
        });

        // Log detailed error data for debugging
        if (data && typeof data === "object") {
          console.error("Error details:", JSON.stringify(data, null, 2));
        }

        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          // Clear invalid token
          this.clearToken();
          throw new Error("Login required");
        }

        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const message = retryAfter
            ? `Too many requests. Please try again in ${retryAfter} seconds.`
            : "Too many requests. Please try again later.";
          throw new Error(message);
        }

        // Handle other errors
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Network error");
    }
  }

  // Generic HTTP Methods
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Auth Methods
  async register(userData: { name: string; email: string; password: string }) {
    return this.request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ user: User; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }

    return response;
  }

  async logout() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  async verifyEmail(token: string) {
    return this.request(`/auth/verify?token=${token}`);
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async googleLogin(code: string) {
    const response = await this.request<{ user: User; token: string }>(
      "/auth/google-token",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      }
    );

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }

    return response;
  }

  async getSession() {
    return this.request<User>("/auth/session", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // User Methods
  async getUsers(params?: { search?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return this.request<{
      users: User[];
      total_page: number;
      page: number;
      limit: number;
      total_users: number;
    }>(`/users?${queryParams.toString()}`);
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string, type: "soft" | "hard" = "soft") {
    return this.request(`/users/${id}?type=${type}`, {
      method: "DELETE",
    });
  }

  async restoreUser(id: string) {
    return this.request(`/users/${id}/restore`, {
      method: "PATCH",
    });
  }

  // Product Methods
  async getProducts(params?: {
    search?: string;
    categoryId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    return this.request<{
      data: {
        products: Product[];
        pagination: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
    }>(`/products?${queryParams.toString()}`);
  }

  async getProduct(id: string) {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: {
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
  }) {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>) {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return this.request<Order[]>(`/orders?${queryParams.toString()}`);
  }

  async getAdminOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    return this.request<{
      orders: Array<{
        id: string;
        orderNumber: string;
        status: string;
        paymentStatus: string;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
        customer: {
          id: string;
          name: string;
          email: string;
        };
        items: any[];
        payment: any;
        shipment: any;
        address: any;
      }>;
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/admin/orders?${queryParams.toString()}`);
  }

  // Address Methods
  async createAddress(addressData: {
    detail: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault?: boolean; // Made optional for now
  }) {
    return this.request<Address>("/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  }

  async getAddresses(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return this.request<{ addresses: Address[]; pagination: any }>(
      `/addresses?${queryParams.toString()}`
    );
  }

  async updateAddress(id: string, addressData: Partial<Address>) {
    return this.request<Address>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(id: string) {
    return this.request(`/addresses/${id}`, {
      method: "DELETE",
    });
  }

  // Payment Methods
  async getPayments(params?: {
    orderId?: string;
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.orderId) queryParams.append("orderId", params.orderId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<{
      payments: Payment[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/payments?${queryParams.toString()}`);
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    return this.request<Payment>(`/payments/${paymentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatusManual(
    orderId: string,
    status: string,
    adminNotes?: string
  ) {
    return this.request<{
      payment: Payment;
      order: {
        id: string;
        status: string;
        paymentStatus: string;
      };
    }>("/payments/update-payment-status", {
      method: "POST",
      body: JSON.stringify({ orderId, status, adminNotes }),
    });
  }

  // Customer Notification Methods
  async getCustomerNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.isRead !== undefined)
      queryParams.append("isRead", params.isRead.toString());
    if (params?.type) queryParams.append("type", params.type);

    return this.request<{
      data: Notification[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
      unreadCount: number;
    }>(`/notifications?${queryParams.toString()}`);
  }

  async markCustomerNotificationAsRead(
    notificationId: string,
    markAll: boolean = false
  ) {
    return this.request("/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ notificationId, markAll }),
    });
  }

  // Customer Notification Methods
  async getOrderTrackingNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);

    return this.request<Notification[]>(
      `/customer-notifications/order-tracking?${queryParams.toString()}`
    );
  }

  async getProductNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);

    return this.request<Notification[]>(
      `/customer-notifications/product-notifications?${queryParams.toString()}`
    );
  }

  async getUnreadNotificationCount() {
    return this.request<{ count: number }>(
      "/customer-notifications/unread-count"
    );
  }

  // Customer Shipment Methods
  async createCustomerShipment(shipmentData: {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    method: string;
    estimatedDelivery: string;
    notes?: string;
  }) {
    return this.request<Shipment>("/shipments", {
      method: "POST",
      body: JSON.stringify(shipmentData),
    });
  }

  async getCustomerShipments(params?: {
    orderId?: string;
    status?: string;
    carrier?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.orderId) queryParams.append("orderId", params.orderId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.carrier) queryParams.append("carrier", params.carrier);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<Shipment[]>(`/shipments?${queryParams.toString()}`);
  }

  async getShipment(id: string) {
    return this.request<Shipment>(`/shipments/${id}`);
  }

  async trackShipment(trackingNumber: string) {
    return this.request<Shipment>(`/shipments/track/${trackingNumber}`);
  }

  async updateCustomerShipment(id: string, shipmentData: Partial<Shipment>) {
    return this.request<Shipment>(`/shipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(shipmentData),
    });
  }

  async deleteCustomerShipment(id: string) {
    return this.request(`/shipments/${id}`, {
      method: "DELETE",
    });
  }

  // Review Methods
  async getReviews(productId: string) {
    // Temporarily return empty array to avoid 404 errors
    // TODO: Implement reviews endpoint in backend
    return Promise.resolve([]);
  }

  async createReview(reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) {
    return this.request<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  // Wishlist Methods
  async getWishlist() {
    return this.request<{
      wishlist: Array<{
        id: string;
        userId: string;
        productId: string;
        product: Product;
        createdAt: string;
        updatedAt: string;
      }>;
      totalItems: number;
    }>("/wishlist");
  }

  async toggleWishlist(productId: string) {
    return this.request<{
      isAdded: boolean;
      message: string;
    }>("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  // Dashboard Methods
  async getDashboardStats(startDate?: string, endDate?: string) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    try {
      return await this.request(`/dashboard/stats?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return fallback data structure
      return {
        success: false,
        message: "Failed to fetch dashboard stats",
        data: {
          overview: {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
          },
          recentOrders: [],
        },
      };
    }
  }

  // Category Methods
  async getCategories(params?: {
    page?: number;
    limit?: number;
    includeProducts?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.includeProducts)
      queryParams.append("includeProducts", params.includeProducts.toString());

    return this.request<Category[]>(`/categories?${queryParams.toString()}`);
  }

  // Deal Methods
  async getDeals(params?: {
    status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
    isFlashSale?: boolean;
    page?: number;
    limit?: number;
    includeExpired?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.isFlashSale !== undefined)
      queryParams.append("isFlashSale", params.isFlashSale.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    // Only include includeExpired if it's true (default is false)
    if (params?.includeExpired === true)
      queryParams.append("includeExpired", "true");

    const response = await this.request<{
      deals: Deal[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/deals?${queryParams.toString()}`);

    return response.data;
  }

  async getDealById(id: string) {
    const response = await this.request<Deal>(`/deals/${id}`);
    return response.data;
  }

  async getFlashSales() {
    const response = await this.request<{
      deals: Deal[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>("/deals/flash-sales");
    return response.data;
  }

  async getFeaturedDeals() {
    const response = await this.request<{
      deals: Deal[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>("/deals/featured");
    return response.data;
  }

  // Admin Deal Methods
  async createDeal(data: {
    title: string;
    description?: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE";
    value: number;
    startDate: string;
    endDate: string;
    image?: string;
    images?: string[];
    isFlashSale?: boolean;
    maxUses?: number;
    // Product information for auto-creation
    productName: string;
    productDescription?: string;
    productPrice: number;
    productSku?: string;
    productStock?: number;
    categoryId?: string;
  }) {
    const response = await this.request<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateDeal(
    id: string,
    data: {
      title?: string;
      description?: string;
      type?: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE";
      value?: number;
      startDate?: string;
      endDate?: string;
      image?: string;
      images?: string[];
      isFlashSale?: boolean;
      maxUses?: number;
      status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
    }
  ) {
    const response = await this.request<Deal>(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteDeal(id: string) {
    const response = await this.request<null>(`/deals/${id}`, {
      method: "DELETE",
    });
    return response.data;
  }

  async createCategory(categoryData: { name: string; description?: string }) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(
    categoryId: string,
    categoryData: { name: string; description?: string }
  ) {
    return this.request(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId: string) {
    return this.request(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }

  // Inventory Methods (Staff/Admin only)
  async getInventoryLogs(params?: {
    productId?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.productId) queryParams.append("productId", params.productId);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request(`/inventory/logs?${queryParams.toString()}`);
  }

  async createInventoryLog(logData: {
    productId: string;
    change: number;
    note: string;
  }) {
    return this.request("/inventory/logs", {
      method: "POST",
      body: JSON.stringify(logData),
    });
  }

  async getInventorySummary() {
    return this.request("/inventory/summary");
  }

  async getLowStockProducts(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return this.request(`/inventory/low-stock?${queryParams.toString()}`);
  }

  async runStockMonitoring() {
    return this.request("/inventory/monitor", {
      method: "POST",
    });
  }

  // Admin Methods
  async createAdmin(adminData: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.request("/admin/create-admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  }

  async createStaff(staffData: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.request("/admin/create-staff", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  }

  // Customer Notification Admin Methods
  async sendProductLaunchNotification(notificationData: {
    productId: string;
    title: string;
    message: string;
  }) {
    return this.request("/customer-notifications/send-product-launch", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  async sendWishlistNotification(notificationData: {
    productId: string;
    notificationType: string;
  }) {
    return this.request("/customer-notifications/send-wishlist-notification", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  async sendFlashSaleNotification(notificationData: {
    productIds: string[];
    discountPercentage: number;
    endTime: string;
  }) {
    return this.request("/customer-notifications/send-flash-sale", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  // Utility Methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  getToken() {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== this.token) {
        this.token = storedToken;
      }
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Profile Methods
  async getProfile() {
    return this.request<User>("/users/profile");
  }

  async updateProfile(profileData: {
    name?: string;
    email?: string;
    phone?: string;
  }) {
    return this.request<User>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request("/users/profile/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  async updateAvatar(avatarUrl: string) {
    return this.request<User>("/users/profile/avatar", {
      method: "PUT",
      body: JSON.stringify({ avatarUrl }),
    });
  }

  // Cart Methods
  async addToCart(productId: string, quantity: number, size?: string) {
    const requestBody = { productId, quantity, size };

    // Debug: Log what we're sending
    return this.request<{
      cartItem: {
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
        size?: string;
        product: Product;
        createdAt: string;
        updatedAt: string;
      };
    }>("/cart/add", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  async addDealToCart(dealId: string, productId: string, quantity: number) {
    return this.request<{
      cartItem: {
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
        product: Product;
        createdAt: string;
        updatedAt: string;
      };
      dealInfo: {
        dealId: string;
        dealTitle: string;
        originalPrice: number;
        discountedPrice: number;
        discountAmount: number;
        discountType: string;
      };
    }>("/cart/add-deal", {
      method: "POST",
      body: JSON.stringify({ dealId, productId, quantity }),
    });
  }

  async getCart() {
    return this.request<{
      cart: {
        id: string;
        userId: string;
        items: Array<{
          id: string;
          cartId: string;
          productId: string;
          quantity: number;
          size?: string;
          product: Product;
          createdAt: string;
          updatedAt: string;
        }>;
        createdAt: string;
        updatedAt: string;
      };
      totalItems: number;
      totalAmount: number;
    }>("/cart");
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    return this.request<{
      cartItem: {
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
        product: Product;
        createdAt: string;
        updatedAt: string;
      };
    }>(`/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId: string) {
    return this.request<{
      message: string;
    }>(`/cart/items/${cartItemId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request<{
      message: string;
    }>("/cart", {
      method: "DELETE",
    });
  }

  // Order Methods
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      size?: string;
    }>;
    totalAmount?: number;
    shippingAddress: string;
    paymentMethod: string;
    addressId?: string | null;
    notes?: string;
  }) {
    return this.request<{
      orderId: string;
      orderNumber: string;
      totalAmount: number;
      paymentUrl?: string;
      paymentToken?: string;
      status: string;
    }>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.request<{
      id: string;
      orderNumber: string;
      status: string;
      paymentStatus: string;
      totalAmount: number;
      items: Array<{
        id: string;
        product: Product;
        quantity: number;
        price: number;
      }>;
      address: {
        detail: string;
        city: string;
        postalCode: string;
        province: string;
        label?: string;
      };
      paymentMethod: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/orders/${orderId}`);
  }

  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);

    return this.request<{
      orders: Array<{
        id: string;
        orderNumber: string;
        status: string;
        paymentStatus: string;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/orders?${queryParams.toString()}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<{
      message: string;
    }>(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request<{
      message: string;
    }>(`/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  }

  async getPaymentStatus(orderId: string) {
    return this.request<{
      status: string;
      paymentStatus: string;
      paymentUrl?: string;
    }>(`/orders/${orderId}/payment-status`);
  }

  // Payment Methods
  async createPayment(paymentData: {
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
  }) {
    return this.request<{
      paymentUrl?: string;
      paymentToken?: string;
      status: string;
      message: string;
    }>("/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async handlePaymentCallback(callbackData: any) {
    return this.request<{
      success: boolean;
      message: string;
    }>("/payments/callback", {
      method: "POST",
      body: JSON.stringify(callbackData),
    });
  }

  async getPaymentMethods() {
    return this.request<{
      methods: Array<{
        id: string;
        name: string;
        type: string;
        icon?: string;
        description?: string;
      }>;
    }>("/payments/methods");
  }

  // Admin Services Methods

  // Shipments
  async getShipments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    carrier?: string;
    orderId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.carrier) queryParams.append("carrier", params.carrier);
    if (params?.orderId) queryParams.append("orderId", params.orderId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<{
      shipments: Shipment[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }>(`/shipments?${queryParams.toString()}`);
  }

  async getShipmentById(shipmentId: string) {
    return this.request<{ shipment: Shipment }>(`/shipments/${shipmentId}`);
  }

  async getShipmentByTracking(trackingNumber: string) {
    return this.request<{ shipment: Shipment }>(
      `/shipments/track/${trackingNumber}`
    );
  }

  async getShipmentStats(params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<{
      totalShipments: number;
      shipmentsByCarrier: Array<{
        carrier: string;
        count: number;
      }>;
    }>(`/shipments/stats?${queryParams.toString()}`);
  }

  async createShipment(shipmentData: {
    orderId: string;
    trackingNo?: string;
    courier: string;
    method: string;
    cost?: number;
    estimatedDays?: number;
    addressId?: string;
  }) {
    // ✅ FIXED: Map frontend fields to backend fields
    const backendData = {
      orderId: shipmentData.orderId,
      trackingNumber: shipmentData.trackingNo, // Map trackingNo to trackingNumber
      carrier: shipmentData.courier, // Map courier to carrier
      method: shipmentData.method,
      cost: shipmentData.cost,
    };

    return this.request<{ shipment: Shipment }>("/shipments", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
  }

  async updateShipment(
    shipmentId: string,
    updateData: {
      courier?: string;
      trackingNo?: string;
      cost?: number;
      estimatedDays?: number;
      addressId?: string;
    }
  ) {
    return this.request<{ shipment: Shipment }>(`/shipments/${shipmentId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async completeDelivery(shipmentId: string) {
    return this.request<{ order: any }>(`/shipments/${shipmentId}/complete`, {
      method: "POST",
    });
  }

  async deleteShipment(shipmentId: string) {
    return this.request<{ shipmentId: string }>(`/shipments/${shipmentId}`, {
      method: "DELETE",
    });
  }

  // Inventory
  async getInventory(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.category) queryParams.append("category", params.category);

    return this.request<{
      inventory: InventoryItem[];
      total: number;
      page: number;
      limit: number;
    }>(`/inventory/summary?${queryParams.toString()}`);
  }

  async updateStock(
    productId: string,
    stockData: {
      currentStock?: number;
      minStock?: number;
      maxStock?: number;
      action: "ADD" | "SUBTRACT" | "SET";
      quantity?: number;
      reason?: string;
    }
  ) {
    return this.request<InventoryItem>(`/admin/inventory/${productId}/stock`, {
      method: "PUT",
      body: JSON.stringify(stockData),
    });
  }

  // Analytics
  async getAnalytics(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return this.request<AnalyticsData>(
      `/admin/analytics?${queryParams.toString()}`
    );
  }

  // Reports
  async getReports(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);

    return this.request<{
      reports: Report[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/reports?${queryParams.toString()}`);
  }

  async generateReport(reportData: {
    type: string;
    period: string;
    format: string;
  }) {
    return this.request<{ reportId: string; message: string }>(
      "/admin/reports",
      {
        method: "POST",
        body: JSON.stringify(reportData),
      }
    );
  }

  async downloadReport(reportId: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(
      `${this.baseURL}/admin/reports/${reportId}/download`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.search) queryParams.append("search", params.search);

    return this.request<{
      notifications: Notification[];
      total: number;
      page: number;
      limit: number;
    }>(`/notifications?${queryParams.toString()}`);
  }

  async getAdminNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    search?: string;
    type?: string;
    priority?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.isRead !== undefined)
      queryParams.append("isRead", params.isRead.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.priority) queryParams.append("priority", params.priority);

    return this.request<{
      notifications: Notification[];
      pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/admin/notifications?${queryParams.toString()}`);
  }

  async sendNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    priority: string;
    target: string;
  }) {
    return this.request<Notification>("/admin/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{ message: string }>(`/admin/notifications/mark-read`, {
      method: "POST",
      body: JSON.stringify({ notificationId }),
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request<{ message: string }>(
      `/admin/notifications/${notificationId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Lookbook Photos
  async getLookbookPhotos(params?: { isActive?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }

    return this.request<LookbookPhoto[]>(`/lookbook?${queryParams.toString()}`);
  }

  async getLookbookPhoto(id: string) {
    return this.request<LookbookPhoto>(`/lookbook/${id}`);
  }

  async createLookbookPhoto(data: {
    title?: string;
    description?: string;
    imageUrl: string;
    order?: number;
    isActive?: boolean;
  }) {
    return this.request<LookbookPhoto>("/lookbook", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLookbookPhoto(
    id: string,
    data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      order?: number;
      isActive?: boolean;
    }
  ) {
    return this.request<LookbookPhoto>(`/lookbook/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLookbookPhoto(id: string) {
    return this.request<{ message: string }>(`/lookbook/${id}`, {
      method: "DELETE",
    });
  }

  async updateLookbookPhotosOrder(photos: { id: string; order: number }[]) {
    return this.request<{ message: string }>("/lookbook/order/update", {
      method: "PUT",
      body: JSON.stringify({ photos }),
    });
  }

  // Best Sellers Methods
  async getBestSellers(params?: {
    limit?: number;
    categoryId?: string;
    timeRange?: "week" | "month" | "quarter" | "year" | "all";
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params?.timeRange) queryParams.append("timeRange", params.timeRange);

    return this.request<{
      bestSellers: Array<
        Product & {
          totalSold: number;
          totalRevenue: number;
          averageRating: number;
          reviewCount: number;
          bestSellerScore: number;
        }
      >;
      timeRange: string;
      totalProducts: number;
      metrics: {
        averageScore: number;
        totalSold: number;
        totalRevenue: number;
      };
    }>(`/best-sellers?${queryParams.toString()}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
