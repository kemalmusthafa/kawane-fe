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
  MoreHorizontal,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAdminAccess();
  const { data, isLoading, error } = useAdminDashboard();

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount || 0);
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
      className="space-y-4 sm:space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Page Header */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold truncate">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              Here's what's happening with your store today.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-white shadow-sm border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-sm sm:text-base lg:text-lg font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {stat.change} from last month
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="bg-white shadow-sm border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base sm:text-lg font-semibold">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Orders ({recentOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-full px-2 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          Order ID
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Customer
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                          Items
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Total
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Status
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                          Payment
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id || Math.random()}>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-3">
                              {order.imageUrl ? (
                                <img
                                  src={order.imageUrl}
                                  alt="Product"
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover flex-shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    // Fallback jika gambar gagal load
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
                                className={`h-8 w-8 sm:h-10 sm:w-10 rounded bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-400 ${
                                  order.imageUrl ? "hidden" : "flex"
                                }`}
                              >
                                <Package className="h-4 w-4" />
                              </div>
                              <div className="font-medium truncate max-w-20 sm:max-w-none">
                                {order.id || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div>
                              <div className="font-medium">
                                {order.customer || "Unknown"}
                              </div>
                              <div className="text-xs text-muted-foreground hidden sm:block">
                                {order.customer || "Unknown"}@example.com
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            1 items
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {formatCurrency(order.amount || 0)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {getStatusBadge(order.status || "PENDING")}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            {getPaymentStatusBadge(
                              order.paymentStatus || "PENDING"
                            )}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {order.date || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Manage Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Add, edit, or remove products from your store.
              </p>
              <a
                href="/admin/products"
                className="text-primary hover:text-primary/80 hover:underline text-xs sm:text-sm font-medium transition-colors"
              >
                Go to Products →
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                View Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Track and manage customer orders.
              </p>
              <a
                href="/admin/orders"
                className="text-primary hover:text-primary/80 hover:underline text-xs sm:text-sm font-medium transition-colors"
              >
                Go to Orders →
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                View and manage user accounts.
              </p>
              <a
                href="/admin/users"
                className="text-primary hover:text-primary/80 hover:underline text-xs sm:text-sm font-medium transition-colors"
              >
                Go to Users →
              </a>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
