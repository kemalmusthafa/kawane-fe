"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { OrderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
// Removed Next.js Image import to avoid blob issues

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      images?: Array<{ url: string }>;
    };
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
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    fetchOrder();
  }, [orderId, isAuthenticated, router]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = await OrderService.getOrder(orderId);
      if (orderData) {
        // Map the API response to match our OrderDetail interface
        const mappedOrder: OrderDetail = {
          ...orderData,
          address: orderData.address || {
            detail: "No address information",
            city: "Unknown",
            postalCode: "00000",
            province: "Unknown",
          },
        };
        setOrder(mappedOrder);
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil detail order");
      router.push("/account/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await OrderService.cancelOrder(order.id);
      toast.success("Pesanan berhasil dibatalkan");
      fetchOrder(); // Refresh order data
    } catch (error: any) {
      toast.error(error.message || "Gagal membatalkan pesanan");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "checkout":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "checkout":
        return (
          <Badge className="bg-orange-100 text-orange-800">Checkout</Badge>
        );
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "succeeded":
        return <Badge className="bg-green-100 text-green-800">Succeeded</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancelOrder = (order: OrderDetail) => {
    const status = order.status?.toLowerCase();
    return (
      status === "pending" || status === "checkout" || status === "processing"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/account/orders">
            <Button>Back to Orders</Button>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Details
          </h1>
          <p className="text-sm text-gray-600 break-all">
            Order #{order.orderNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/account/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {getStatusIcon(order.status)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Payment:</span>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Order Date</p>
                    <p className="text-sm font-medium break-words">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative">
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <>
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget
                                  .nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.classList.remove("hidden");
                                }
                              }}
                            />
                            <div className="w-full h-full items-center justify-center hidden">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          </>
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium break-words">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-600">
                          Total: Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.address ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium break-words">
                      {order.address.detail}
                    </p>
                    <p className="text-sm break-words">
                      {order.address.city}, {order.address.postalCode}
                    </p>
                    <p className="text-sm break-words">
                      {order.address.province}
                    </p>
                    {order.address.label && (
                      <p className="text-xs text-gray-600 break-words">
                        Label: {order.address.label}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No address information available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium break-words">
                    Payment Method: {order.paymentMethod}
                  </p>
                  <div className="text-xs text-gray-600">
                    Status: {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 break-words">
                    {order.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal</span>
                    <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Payment Button - Show if payment is pending */}
                  {order.paymentStatus?.toLowerCase() === "pending" && (
                    <Button
                      onClick={() => {
                        // Redirect to payment page with order ID
                        window.location.href = `/payment/${order.id}`;
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}

                  {canCancelOrder(order) && (
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                      className="w-full"
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Order"
                      )}
                    </Button>
                  )}

                  <Link href="/account/orders" className="block">
                    <Button variant="outline" className="w-full">
                      Back to Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
