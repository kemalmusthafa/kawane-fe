"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminAccess } from "@/components/guards/admin-guard";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Trash2,
  ShoppingCart,
  AlertCircle,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { adminToast } from "@/utils/admin-toast";
import { OrderDetails } from "@/components/admin/order-details";
import { LegacyPagination } from "@/components/ui/pagination";
import {
  getOrderStatusColor,
  getPaymentStatusColor,
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/lib/status-colors";
import { apiClient } from "@/lib/api";

export default function AdminOrders() {
  const { hasAccess } = useAdminAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Map frontend status values to backend expected values
  const mapStatusToBackend = (status: string) => {
    switch (status) {
      case "pending":
        return "PENDING";
      case "shipped":
        return "SHIPPED";
      case "delivered":
        return "COMPLETED";
      case "CANCELLED":
        return "CANCELLED";
      case "paid":
        return "PAID";
      case "failed":
        return "FAILED";
      case "refunded":
        return "REFUNDED";
      default:
        return status;
    }
  };

  const { data, isLoading, isSearching, error, refetch } = useAdminOrders({
    search: searchTerm,
    status:
      statusFilter === "all" ? undefined : mapStatusToBackend(statusFilter),
    paymentStatus:
      paymentStatusFilter === "all"
        ? undefined
        : mapStatusToBackend(paymentStatusFilter),
    page: currentPage,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const getStatusBadge = (status: string) => {
    let variant: "pending" | "completed" | "cancelled" | "default" = "default";

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

    return <Badge variant={variant}>{getOrderStatusLabel(status)}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    let variant: "pending" | "completed" | "cancelled" | "default" = "default";

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

    return <Badge variant={variant}>{getPaymentStatusLabel(status)}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await apiClient.updateOrderStatus(orderId, status);
      if (response.success) {
        adminToast.order.updateStatus(orderId, status);
        refetch(); // Refresh the orders list
        return { success: true };
      } else {
        adminToast.order.updateStatusError();
        return { success: false, error: "Failed to update order status" };
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      adminToast.order.updateStatusError(error.message);
      return {
        success: false,
        error: error.message || "Failed to update order status",
      };
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    try {
      // For manual WhatsApp payments, use the manual payment status update API
      const response = await apiClient.updatePaymentStatusManual(
        orderId,
        status
      );
      if (response.success) {
        toast.success("Payment status updated successfully");
        refetch(); // Refresh the orders list
        return { success: true };
      } else {
        toast.error("Failed to update payment status");
        return { success: false, error: "Failed to update payment status" };
      }
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      toast.error(error.message || "Failed to update payment status");
      return {
        success: false,
        error: error.message || "Failed to update payment status",
      };
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus order ini?")) return;

    try {
      // Since there's no delete endpoint, we'll cancel the order instead
      const response = await apiClient.updateOrderStatus(orderId, "CANCELLED");
      if (response.success) {
        toast.success("Order berhasil dibatalkan");
        refetch(); // Refresh data setelah cancel
      } else {
        toast.error("Gagal membatalkan order");
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      
      // Handle specific error cases
      if (error.message?.includes("Order status is already updated")) {
        toast.error("Order sudah dalam status yang sama. Tidak bisa diubah.");
      } else if (error.message?.includes("Order not found")) {
        toast.error("Order tidak ditemukan.");
      } else {
        toast.error(error.message || "Gagal membatalkan order");
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePaymentStatusFilterChange = (value: string) => {
    setPaymentStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (!hasAccess) {
    return null; // AdminGuard will handle this
  }

  if (isLoading) {
    return <AdminPageSkeleton />;
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
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage customer orders and shipments
          </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalItems || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800">
                {data?.orders?.filter((o) => o.status === "pending").length ||
                  0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.orders?.filter((o) => o.status === "pending").length ||
                  0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Badge className="bg-purple-100 text-purple-800">
                {data?.orders?.filter((o) => o.status === "shipped").length ||
                  0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.orders?.filter((o) => o.status === "shipped").length ||
                  0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {data?.orders?.filter((o) => o.status === "delivered").length ||
                  0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.orders?.filter((o) => o.status === "delivered").length ||
                  0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Search Input - Full Width */}
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    isSearching ? "text-blue-500 animate-spin" : "text-gray-400"
                  }`}
                />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filters Row - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 sm:flex-none">
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 sm:flex-none">
                  <Select
                    value={paymentStatusFilter}
                    onValueChange={handlePaymentStatusFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px]">
                      <SelectValue placeholder="Filter by Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full sm:w-auto">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              All Orders ({data?.totalItems || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.orders && data.orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Order ID</TableHead>
                      <TableHead className="min-w-[150px]">Customer</TableHead>
                      <TableHead className="min-w-[80px]">Items</TableHead>
                      <TableHead className="min-w-[100px]">Total</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Payment</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="min-w-[120px]">
                          <div className="font-medium text-sm truncate">
                            {order.orderNumber}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div>
                            <div className="font-medium text-sm">
                              {order.user.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {order.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[80px] text-sm">
                          {order.items.length} items
                        </TableCell>
                        <TableCell className="min-w-[100px] text-sm">
                          {formatPrice(order.totalAmount)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell className="min-w-[100px] text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrderDetails(order)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No orders found</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Orders will appear here once customers start placing them"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && data.orders && data.orders.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <LegacyPagination
                currentPage={currentPage}
                totalPages={data.totalPages || 1}
                onPageChange={setCurrentPage}
                totalItems={data.totalItems || 0}
                itemsPerPage={5}
              />
            </CardContent>
          </Card>
        )}

        {/* Order Details Dialog */}
        <OrderDetails
          isOpen={isOrderDetailsOpen}
          onClose={() => {
            setIsOrderDetailsOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
        />
      </motion.div>
    </motion.div>
  );
}
