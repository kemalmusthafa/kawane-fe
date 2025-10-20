export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
}

export interface SalesData {
  date: string;
  orders: number;
  revenue: number;
  customers: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  image?: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  avatar?: string;
}

export interface RevenueChart {
  period: "daily" | "weekly" | "monthly" | "yearly";
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export interface OrderAnalytics {
  status: OrderStatus;
  count: number;
  percentage: number;
  revenue: number;
}

export interface UserAnalytics {
  total: number;
  verified: number;
  unverified: number;
  newThisMonth: number;
  activeUsers: number;
}

export interface ProductAnalytics {
  total: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  categories: {
    name: string;
    count: number;
  }[];
}

export interface InventoryAnalytics {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  recentMovements: {
    productId: string;
    productName: string;
    change: number;
    type: "restock" | "sale";
    date: Date;
  }[];
}

export interface NotificationAnalytics {
  total: number;
  unread: number;
  read: number;
  deleted: number;
  byType: {
    type: string;
    count: number;
  }[];
}

// Import types yang dibutuhkan
import { OrderStatus } from "./order";
