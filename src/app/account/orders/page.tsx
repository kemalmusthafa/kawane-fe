"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { OrderService } from "@/services/order.service";
import { useOrders } from "@/hooks/useApi";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  Filter,
  Loader2,
  Calendar,
  CreditCard,
  MapPin,
  Bell,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { orders, isLoading, error, pagination } = useOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter.toUpperCase() : undefined,
  });

  const {
    orderNotifications,
    unreadOrderNotificationsCount,
    createOrderNotification,
  } = useOrderNotifications();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch orders");
    }
  }, [error]);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "checkout":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-600 dark:text-orange-100 text-[10px] md:text-xs px-2 py-0.5">
            Checkout
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 text-[10px] md:text-xs px-2 py-0.5">
            Paid
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-100 text-[10px] md:text-xs px-2 py-0.5">
            Shipped
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 text-[10px] md:text-xs px-2 py-0.5">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100 text-[10px] md:text-xs px-2 py-0.5">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-[10px] md:text-xs px-2 py-0.5 dark:bg-gray-600 dark:text-gray-100"
          >
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 text-[10px] md:text-xs px-2 py-0.5">
            Succeeded
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100 text-[10px] md:text-xs px-2 py-0.5">
            Cancelled
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100 text-[10px] md:text-xs px-2 py-0.5">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-[10px] md:text-xs px-2 py-0.5 dark:bg-gray-600 dark:text-gray-100"
          >
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order: any) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
          <Link href="/auth/sign-in">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

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
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-between mb-4 md:mb-8"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Orders
          </h1>
          <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-300">
            Manage your order history
          </p>
        </div>
        {unreadOrderNotificationsCount > 0 && (
          <div className="flex items-center gap-1.5 md:gap-2">
            <Bell className="h-3 w-3 md:h-4 md:w-5 text-blue-500" />
            <Badge className="bg-blue-500 text-white text-[8px] md:text-[9px] lg:text-[10px] py-0.5 px-1 md:px-1.5 lg:px-2">
              {unreadOrderNotificationsCount} new notifications
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Order Notifications Section */}
      {orderNotifications.length > 0 && (
        <Card className="mb-3 md:mb-4 lg:mb-6">
          <CardHeader className="p-3 md:p-4 lg:p-6">
            <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base lg:text-lg">
              <Bell className="h-3 w-3 md:h-4 md:w-5" />
              Recent Order Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 lg:p-6 pt-0">
            <div className="space-y-1.5 md:space-y-2 lg:space-y-3">
              {orderNotifications.slice(0, 3).map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-2 md:p-3 rounded-lg border ${
                    !notification.isRead
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[10px] md:text-xs lg:text-sm">
                        {notification.title}
                      </p>
                      <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                    <div className="text-[8px] md:text-[9px] lg:text-[10px] text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {orderNotifications.length > 3 && (
                <div className="text-center">
                  <Link href="/account/notifications">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[9px] md:text-[10px] lg:text-xs py-1 px-2 md:px-3"
                    >
                      View All Notifications
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <Input
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 md:pl-10 text-[11px] md:text-xs lg:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10px] md:text-xs lg:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="checkout">Checkout</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6 md:py-8">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-6 md:py-8 lg:py-10">
              <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-2 md:mb-3 lg:mb-4" />
              <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
                No Orders Found
              </h3>
              <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
                {searchTerm
                  ? "No orders match your search criteria."
                  : "You haven't placed any orders yet."}
              </p>
              <Link href="/products">
                <Button
                  size="sm"
                  className="text-[10px] md:text-xs lg:text-sm py-1.5 md:py-2 px-3 md:px-4"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 md:space-y-3 lg:space-y-4">
            {filteredOrders.map((order: any, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 md:p-4 lg:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-3 lg:gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 md:gap-2 lg:gap-3 mb-1.5 md:mb-2">
                          <h3 className="text-[11px] md:text-xs lg:text-sm font-semibold break-all">
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 lg:gap-4 text-[10px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2">
                            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                            Rp{" "}
                            {order.totalAmount?.toLocaleString("id-ID") || "0"}
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2">
                              <Package className="h-3 w-3 md:h-4 md:w-4" />
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-1.5 md:mt-2 lg:mt-3">
                            <span className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2 block">
                              Items:
                            </span>
                            <div className="space-y-1.5 md:space-y-2">
                              {order.items
                                .slice(0, 3)
                                .map((item: any, itemIndex: number) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-1.5 md:gap-2 lg:gap-3 p-1.5 md:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                  >
                                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center relative border">
                                      {item.product?.images &&
                                      item.product.images.length > 0 ? (
                                        <>
                                          <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="w-full h-full rounded-lg object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display =
                                                "none";
                                              const fallback = e.currentTarget
                                                .nextElementSibling as HTMLElement;
                                              if (fallback) {
                                                fallback.classList.remove(
                                                  "hidden"
                                                );
                                              }
                                            }}
                                          />
                                          <div className="w-full h-full items-center justify-center hidden">
                                            <Package className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-400" />
                                          </div>
                                        </>
                                      ) : (
                                        <Package className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {item.product?.name ||
                                          "Unknown Product"}
                                      </p>
                                      {item.size && (
                                        <p className="text-[9px] md:text-[10px] lg:text-xs text-blue-600 dark:text-blue-400 font-medium">
                                          Size: {item.size}
                                        </p>
                                      )}
                                      <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity || 0}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              {order.items.length > 3 && (
                                <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 text-center">
                                  +{order.items.length - 3} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5 md:gap-2">
                        <Link href={`/account/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[9px] md:text-[10px] lg:text-xs py-1 md:py-1.5 px-2 md:px-3"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4 md:mt-6 lg:mt-8">
            <div className="flex gap-1.5 md:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[9px] md:text-[10px] lg:text-xs py-1 md:py-1.5 px-2 md:px-3"
              >
                Previous
              </Button>
              <span className="flex items-center px-2 md:px-3 lg:px-4 py-1 md:py-2 text-[9px] md:text-[10px] lg:text-xs text-gray-600 dark:text-gray-300">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                disabled={currentPage === pagination.totalPages}
                className="text-[9px] md:text-[10px] lg:text-xs py-1 md:py-1.5 px-2 md:px-3"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
