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
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900 text-[10px] md:text-xs px-2 py-0.5">
            Checkout
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 text-[10px] md:text-xs px-2 py-0.5">
            Paid
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900 text-[10px] md:text-xs px-2 py-0.5">
            Shipped
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 text-[10px] md:text-xs px-2 py-0.5">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 text-[10px] md:text-xs px-2 py-0.5">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-[10px] md:text-xs px-2 py-0.5 dark:bg-gray-700 dark:text-gray-100"
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
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 text-[10px] md:text-xs px-2 py-0.5">
            Succeeded
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 text-[10px] md:text-xs px-2 py-0.5">
            Cancelled
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-900 text-[10px] md:text-xs px-2 py-0.5">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="text-[10px] md:text-xs px-2 py-0.5 dark:bg-gray-700 dark:text-gray-100"
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
        className="flex items-center justify-between mb-8"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
            Orders
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            Manage your order history
          </p>
        </div>
        {unreadOrderNotificationsCount > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            <Badge className="bg-blue-500 text-white text-[10px] md:text-xs py-0.5 px-1.5 md:px-2">
              {unreadOrderNotificationsCount} new notifications
            </Badge>
          </div>
        )}
      </motion.div>

      {/* Order Notifications Section */}
      {orderNotifications.length > 0 && (
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              Recent Order Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {orderNotifications.slice(0, 3).map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.isRead
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-xs md:text-sm">
                        {notification.title}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500">
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
                      className="text-xs py-1"
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
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-10 md:py-12">
              <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                {searchTerm
                  ? "No orders match your search criteria."
                  : "You haven't placed any orders yet."}
              </p>
              <Link href="/products">
                <Button className="text-sm py-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order: any, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 md:gap-4 mb-2">
                          <h3 className="text-sm md:text-base font-semibold break-all">
                            Order #{order.orderNumber || order.id}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <CreditCard className="h-4 w-4" />
                            Rp{" "}
                            {order.totalAmount?.toLocaleString("id-ID") || "0"}
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <Package className="h-4 w-4" />
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-2 md:mt-3">
                            <span className="text-xs md:text-sm font-medium text-gray-700 mb-2 block">
                              Items:
                            </span>
                            <div className="space-y-2">
                              {order.items
                                .slice(0, 3)
                                .map((item: any, itemIndex: number) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-2 md:gap-3 p-2 bg-gray-50 rounded-lg"
                                  >
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center relative border">
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
                                            <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                                          </div>
                                        </>
                                      ) : (
                                        <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                        {item.product?.name ||
                                          "Unknown Product"}
                                      </p>
                                      {item.size && (
                                        <p className="text-[11px] md:text-xs text-blue-600 font-medium">
                                          Size: {item.size}
                                        </p>
                                      )}
                                      <p className="text-[11px] md:text-xs text-gray-500">
                                        Qty: {item.quantity || 0}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              {order.items.length > 3 && (
                                <p className="text-[11px] md:text-xs text-gray-500 text-center">
                                  +{order.items.length - 3} more items
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/account/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1.5"
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
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 md:px-4 py-2 text-xs md:text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages)
                  )
                }
                disabled={currentPage === pagination.totalPages}
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
