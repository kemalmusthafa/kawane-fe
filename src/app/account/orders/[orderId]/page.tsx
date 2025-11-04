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
  MessageCircle,
  Truck,
  AlertCircle,
  ShoppingBag,
  Star,
} from "lucide-react";
import { ProductRatingInput } from "@/components/ui/product-rating-input";
import { getWhatsAppDesktopUrl, createOrderMessage } from "@/utils/whatsapp";
import { toast } from "sonner";
import Link from "next/link";

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
    size?: string;
  }>;
  address: {
    detail: string;
    city: string;
    postalCode: string;
    province: string;
    country?: string;
    phone?: string;
    label?: string;
  };
  shipment?: {
    id: string;
    courier?: string;
    trackingNo?: string;
    cost: number;
    estimatedDays?: number;
    createdAt: string;
    address?: {
      detail: string;
      city: string;
      postalCode: string;
      province: string;
    };
  };
  paymentMethod: string;
  notes?: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
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
        // Try to extract phone and country from order data or user data
        const addressData = orderData.address || {
          detail: "No address information",
          city: "Unknown",
          postalCode: "00000",
          province: "Unknown",
        };

        // Extract phone and country from notes if available
        // Address data from API might not have phone/country directly
        const addressDataWithExtras = addressData as any;
        let extractedPhone = addressDataWithExtras.phone || (orderData as any).user?.phone;
        let extractedCountry = addressDataWithExtras.country || addressData.province || "Indonesia";
        
        if (orderData.notes) {
          // Try to extract phone from notes (format: "Phone: +62...")
          const phoneMatch = orderData.notes.match(/Phone:\s*([^|]+)/);
          if (phoneMatch) {
            extractedPhone = phoneMatch[1].trim();
          }
          
          // Try to extract country from notes (format: "Country: ...")
          const countryMatch = orderData.notes.match(/Country:\s*([^|]+)/);
          if (countryMatch) {
            extractedCountry = countryMatch[1].trim();
          }
        }

        // If phone or country is in address object, include them
        const mappedOrder: OrderDetail = {
          ...orderData,
          address: {
            ...addressData,
            phone: extractedPhone,
            country: extractedCountry,
          },
        };
        setOrder(mappedOrder);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch order details");
      router.push("/account/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await OrderService.cancelOrder(order.id);
      toast.success("Order cancelled successfully");
      fetchOrder(); // Refresh order data
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "checkout":
        return (
          <Clock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-orange-500" />
        );
      case "pending":
        return (
          <Clock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-500" />
        );
      case "paid":
        return (
          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-green-500" />
        );
      case "shipped":
        return (
          <Truck className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-purple-500" />
        );
      case "completed":
        return (
          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-green-500" />
        );
      case "cancelled":
        return (
          <XCircle className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-red-500" />
        );
      default:
        return (
          <AlertCircle className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-500" />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "checkout":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-600 dark:text-orange-100 border-orange-200 text-[10px] md:text-xs px-2 py-0.5">
            Checkout
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 border-yellow-200 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 border-green-200 text-[10px] md:text-xs px-2 py-0.5">
            Paid
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-100 border-purple-200 text-[10px] md:text-xs px-2 py-0.5">
            Shipped
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 border-green-200 text-[10px] md:text-xs px-2 py-0.5">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100 border-red-200 text-[10px] md:text-xs px-2 py-0.5">
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
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100 border-yellow-200 text-[10px] md:text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-100 border-green-200 text-[10px] md:text-xs px-2 py-0.5">
            Succeeded
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-100 border-red-200 text-[10px] md:text-xs px-2 py-0.5">
            Cancelled
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100 border-gray-200 text-[10px] md:text-xs px-2 py-0.5">
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
    return new Date(dateString).toLocaleDateString("en-US", {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-gray-600" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/account/orders">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 lg:p-6 mb-4 md:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
              <div className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Package className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Order Details
                </h1>
                <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg inline-block mt-0.5 md:mt-1">
                  #{order.orderNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link href="/account/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 text-[9px] md:text-[10px] lg:text-xs py-1 md:py-1.5 px-2 md:px-3"
                >
                  <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
              {/* Order Status Card */}
              <Card className="bg-white dark:bg-gray-800 rounded-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg font-semibold">
                    <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 lg:gap-4">
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Status:
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-[10px] md:text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Payment:
                        </span>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </div>
                    <div className="text-right bg-gray-50 dark:bg-gray-700 p-2 md:p-3 lg:p-4 rounded-lg">
                      <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Order Date
                      </p>
                      <p className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5 md:mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Card */}
              <Card className="bg-white dark:bg-gray-800 rounded-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg font-semibold">
                    <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-6">
                  <div className="space-y-3 md:space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center relative">
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
                                <Package className="h-6 w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                            </>
                          ) : (
                            <Package className="h-6 w-6 md:h-8 md:w-8 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {item.product.name}
                          </h3>
                          {item.size && (
                            <p className="text-[11px] md:text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Quantity:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          {/* Rating Input - Show for paid/completed orders */}
                          {(order.status === "COMPLETED" || 
                            order.status === "PAID" || 
                            order.status === "SHIPPED" ||
                            order.paymentStatus === "SUCCEEDED" ||
                            order.paymentStatus === "PAID" ||
                            order.paymentStatus === "succeeded" ||
                            order.paymentStatus === "paid") && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                                <p className="text-[10px] md:text-xs text-gray-700 dark:text-gray-300 font-medium">
                                  Rate this product:
                                </p>
                              </div>
                              <ProductRatingInput
                                productId={item.product.id}
                                productName={item.product.name}
                                initialRating={0}
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400">
                            Total: Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address Card */}
              <Card className="bg-white dark:bg-gray-800 rounded-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg font-semibold">
                    <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-6">
                  {order.address ? (
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                        <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {order.address.detail}
                        </p>
                        {order.address.phone && (
                          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-1">
                            📞 {order.address.phone}
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                          {order.address.city}, {order.address.postalCode}
                        </p>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                          {order.address.province}
                          {order.address.country && order.address.country !== order.address.province && (
                            <>, {order.address.country}</>
                          )}
                        </p>
                        {order.address.label && (
                          <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-lg inline-block">
                            {order.address.label}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-10 w-10 md:h-12 md:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No address information available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Information Card */}
              <Card className="bg-white dark:bg-gray-800 rounded-lg">
                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg font-semibold">
                    <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                      <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Payment Method:
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status:
                      </span>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Tracking Card */}
              {order.shipment && (
                <Card className="bg-white dark:bg-gray-800 rounded-lg">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg font-semibold">
                      <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Truck className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      Shipment Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 lg:p-6">
                    <div className="space-y-3 md:space-y-4">
                      {/* Courier Information */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Courier:
                            </span>
                            <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {order.shipment.courier || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Shipping Cost:
                            </span>
                            <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">
                              Rp {order.shipment.cost.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Number */}
                      {order.shipment.trackingNo && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300">
                                Tracking Number:
                              </span>
                              <p className="text-xs md:text-sm font-mono font-semibold text-blue-900 dark:text-blue-100">
                                {order.shipment.trackingNo}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              onClick={() => {
                                // Copy tracking number to clipboard
                                if (order.shipment?.trackingNo) {
                                  navigator.clipboard.writeText(
                                    order.shipment.trackingNo
                                  );
                                  toast.success(
                                    "Tracking number copied to clipboard"
                                  );
                                }
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Estimated Delivery */}
                      {order.shipment.estimatedDays && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                            <span className="text-xs md:text-sm font-medium text-green-700 dark:text-green-300">
                              Estimated Delivery:
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-green-900 dark:text-green-100">
                              {order.shipment.estimatedDays} days
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Shipment Date */}
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Shipment Created:</span>{" "}
                        {new Date(order.shipment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>

                      {/* Track Package Button */}
                      {order.shipment.trackingNo && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            className="w-full text-xs md:text-sm py-2 md:py-2.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => {
                              // Open tracking in new tab (you can customize this URL based on courier)
                              if (
                                order.shipment?.trackingNo &&
                                order.shipment?.courier
                              ) {
                                const trackingUrl = `https://www.google.com/search?q=${order.shipment.courier}+tracking+${order.shipment.trackingNo}`;
                                window.open(trackingUrl, "_blank");
                              }
                            }}
                          >
                            <Truck className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                            Track Package
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Notes */}
              {order.notes && (
                <Card className="bg-white dark:bg-gray-800 rounded-lg">
                  <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                    <CardTitle className="text-sm md:text-base lg:text-lg font-semibold">
                      Order Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4 lg:p-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {order.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 rounded-lg lg:sticky lg:top-8">
                <CardHeader className="bg-gray-50 dark:bg-gray-900 p-3 md:p-4 lg:p-6">
                  <CardTitle className="text-sm md:text-base lg:text-lg font-semibold">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-5 lg:space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        Shipping
                      </span>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Free
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-sm md:text-base font-bold">
                      <span className="text-sm md:text-base text-gray-900 dark:text-gray-100">
                        Total
                      </span>
                      <span className="text-sm md:text-base text-gray-900 dark:text-gray-100">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* WhatsApp Payment Button */}
                    {order.paymentStatus?.toLowerCase() === "pending" &&
                      order.status?.toLowerCase() !== "cancelled" && (
                        <Button
                          onClick={() => {
                            const message = createOrderMessage({
                              orderNumber: order.orderNumber,
                              totalAmount: order.totalAmount,
                              status: order.status,
                              createdAt: order.createdAt,
                              address: order.address,
                              items: order.items,
                            });

                            const whatsappUrl = getWhatsAppDesktopUrl(message);
                            window.open(whatsappUrl, "_blank");
                          }}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 md:py-3 rounded-lg text-xs md:text-sm"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Pay via WhatsApp
                        </Button>
                      )}

                    {/* Back to Shopping Button */}
                    {order.status?.toLowerCase() === "cancelled" && (
                      <Link href="/products" className="block">
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 md:py-3 rounded-lg text-xs md:text-sm">
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Back to Shopping
                        </Button>
                      </Link>
                    )}

                    {/* Cancel Order Button */}
                    {canCancelOrder(order) && (
                      <Button
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 md:py-3 rounded-lg text-xs md:text-sm"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
