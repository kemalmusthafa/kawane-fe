"use client";

import { motion } from "framer-motion";
import { useAdminAccess } from "@/components/guards/admin-guard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/lib/status-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAdminAccess();
  const { data, isLoading, error } = useAdminDashboard();

  const formatCurrency = (amount: number) => {
    try {
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount || 0);
      return formatted.replace(/Rp\s*/, "Rp ");
    } catch (err) {
      return "Rp 0";
    }
  };

  // Extract data from dashboard data with safe defaults
  const stats = data?.stats
    ? [
        {
          title: "Total Users",
          value: data.stats.totalUsers?.toString() || "0",
          change: "+0%",
          icon: Users,
        },
        {
          title: "Total Products",
          value: data.stats.totalProducts?.toString() || "0",
          change: "+0%",
          icon: Package,
        },
        {
          title: "Total Orders",
          value: data.stats.totalOrders?.toString() || "0",
          change: "+0%",
          icon: ShoppingCart,
        },
        {
          title: "Total Revenue",
          value: formatCurrency(data.stats.totalRevenue || 0),
          change: "+0%",
          icon: DollarSign,
        },
      ]
    : [];

  const recentOrders = Array.isArray(data?.recentOrders)
    ? data.recentOrders
    : [];

  const getStatusBadge = (status: string) => {
    try {
      const label = getOrderStatusLabel(status);
      let variant: "pending" | "completed" | "cancelled" | "default" =
        "default";

      switch (status.toLowerCase()) {
        case "pending":
          variant = "pending";
          break;
        case "completed":
        case "delivered":
          variant = "completed";
          break;
        case "cancelled":
          variant = "cancelled";
          break;
        default:
          variant = "default";
      }

      return <Badge variant={variant}>{label}</Badge>;
    } catch (err) {
      return <Badge variant="default">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    try {
      const label = getPaymentStatusLabel(status);
      let variant: "pending" | "completed" | "cancelled" | "default" =
        "default";

      switch (status.toLowerCase()) {
        case "pending":
          variant = "pending";
          break;
        case "completed":
        case "paid":
          variant = "completed";
          break;
        case "cancelled":
        case "failed":
          variant = "cancelled";
          break;
        default:
          variant = "default";
      }

      return <Badge variant={variant}>{label}</Badge>;
    } catch (err) {
      return <Badge variant="default">{status || "Unknown"}</Badge>;
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="w-full min-w-0 space-y-4 sm:space-y-6 admin-dashboard-page"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Page Header - teks tidak terpotong */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <motion.div
            variants={headerVariants}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0 overflow-visible">
                <h1 className="font-bold break-words">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-muted-foreground mt-1 break-words">
                  Here&apos;s what&apos;s happening with your store today.
                </p>
              </div>
            </div>
          </motion.div>
        </CardHeader>
      </Card>

      <motion.div
        variants={contentVariants}
        className="w-full min-w-0 space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid - full width */}
        <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="min-w-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                <CardTitle className="card-title-style text-muted-foreground truncate font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="stat-value font-bold">{stat.value}</div>
                <p className="text-muted-foreground flex items-center mt-1 text-[var(--text-xs)]">
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{stat.change} from last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="min-w-0 w-full overflow-hidden">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="card-title-style flex items-center text-base">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0" />
              Recent Orders ({recentOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto -mx-3 sm:mx-0 scrollbar-thin w-full">
                <div className="min-w-[600px] sm:min-w-0 w-full px-1 sm:px-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[var(--text-sm)] whitespace-nowrap">
                          Order ID
                        </TableHead>
                        <TableHead className="text-[var(--text-sm)] whitespace-nowrap">Customer</TableHead>
                        <TableHead className="text-[var(--text-sm)] hidden sm:table-cell whitespace-nowrap">Items</TableHead>
                        <TableHead className="text-[var(--text-sm)] whitespace-nowrap">Total</TableHead>
                        <TableHead className="text-[var(--text-sm)] whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-[var(--text-sm)] hidden md:table-cell whitespace-nowrap">Payment</TableHead>
                        <TableHead className="text-[var(--text-sm)] hidden lg:table-cell whitespace-nowrap">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id || Math.random()}>
                          <TableCell className="text-[var(--text-sm)] align-middle w-0 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {order.imageUrl ? (
                                <img
                                  src={order.imageUrl}
                                  alt="Product"
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover flex-shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const fallback =
                                      target.nextElementSibling as HTMLElement;
                                    if (fallback)
                                      fallback.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`h-8 w-8 sm:h-10 sm:w-10 rounded bg-muted border border-border flex items-center justify-center text-muted-foreground flex-shrink-0 ${
                                  order.imageUrl ? "hidden" : "flex"
                                }`}
                              >
                                <Package className="h-4 w-4" />
                              </div>
                              <span className="font-medium truncate max-w-[8rem] sm:max-w-[12rem] inline-block">
                                {order.id || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[var(--text-sm)] align-middle">
                            <div>
                              <div className="font-medium">
                                {order.customer || "Unknown"}
                              </div>
                              <div className="text-xs text-muted-foreground hidden sm:block">
                                {order.email || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[var(--text-sm)] hidden sm:table-cell align-middle">1 items</TableCell>
                          <TableCell className="text-[var(--text-sm)] align-middle table-cell-numeric">{formatCurrency(order.amount || 0)}</TableCell>
                          <TableCell className="text-[var(--text-sm)] align-middle">{getStatusBadge(order.status || "PENDING")}</TableCell>
                          <TableCell className="text-[var(--text-sm)] hidden md:table-cell align-middle">
                            {getPaymentStatusBadge(order.paymentStatus || "PENDING")}
                          </TableCell>
                          <TableCell className="text-[var(--text-sm)] hidden lg:table-cell align-middle">
                            {order.date || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground px-4">
                <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-base sm:text-lg font-medium mb-2">
                  No recent orders found
                </p>
                <p className="text-xs sm:text-sm">
                  Orders will appear here once customers start placing them
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - responsive grid, full width */}
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="min-w-0 bg-card shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="card-title-style flex items-center">
                <Package className="h-4 w-4 mr-2 text-primary shrink-0" />
                Manage Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <p className="text-muted-foreground mb-3 text-[var(--text-sm)]">
                Add, edit, or remove products from your store.
              </p>
              <a href="/admin/products" className="text-primary hover:underline text-[var(--text-sm)] font-medium">
                Go to Products →
              </a>
            </CardContent>
          </Card>
          <Card className="min-w-0 bg-card shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="card-title-style flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-primary shrink-0" />
                View Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <p className="text-muted-foreground mb-3 text-[var(--text-sm)]">Track and manage customer orders.</p>
              <a href="/admin/orders" className="text-primary hover:underline text-[var(--text-sm)] font-medium">Go to Orders →</a>
            </CardContent>
          </Card>
          <Card className="min-w-0 bg-card shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 p-3 sm:p-4">
              <CardTitle className="card-title-style flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary shrink-0" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <p className="text-muted-foreground mb-3 text-[var(--text-sm)]">View and manage user accounts.</p>
              <a href="/admin/users" className="text-primary hover:underline text-[var(--text-sm)] font-medium">Go to Users →</a>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
