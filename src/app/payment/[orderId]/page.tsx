"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { OrderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Phone,
  Mail,
  CreditCard,
  XCircle,
  ShoppingBag,
  Package,
  MapPin,
} from "lucide-react";
import {
  getWhatsAppNumber,
  getWhatsAppDesktopUrl,
  createOrderMessage,
} from "@/utils/whatsapp";
import { toast } from "sonner";
import { motion } from "framer-motion";
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

export default function OrderPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Payment Details
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your order information...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link href="/account/orders">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if order is cancelled
  if (order.status?.toLowerCase() === "cancelled") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Cancelled
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This order has been cancelled and cannot be paid.
          </p>
          <div className="space-y-3">
            <Link href={`/account/orders/${orderId}`}>
              <Button variant="outline" className="w-full">
                Back to Order Details
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Back to Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          variants={headerVariants}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Payment Details
                </h1>
                <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block mt-1">
                  #{order.orderNumber}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/account/orders/${orderId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={contentVariants}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center relative shadow-sm border">
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <>
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full rounded-xl object-cover"
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
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            </>
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-indigo-600">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {order.address ? (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {order.address.detail}
                      </p>
                      <p className="text-sm text-gray-700">
                        {order.address.city}, {order.address.postalCode}
                      </p>
                      <p className="text-sm text-gray-700">
                        {order.address.province}
                      </p>
                      {order.address.label && (
                        <p className="text-xs text-gray-600 mt-2 bg-blue-100 px-2 py-1 rounded-lg inline-block">
                          {order.address.label}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No address information available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    WhatsApp Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <MessageCircle className="h-10 w-10 text-white" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Complete Your Payment
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Click the button below to contact us via WhatsApp and
                        complete your payment. Our team will assist you with the
                        payment process.
                      </p>
                    </div>

                    <div className="space-y-4">
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
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Chat WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          WhatsApp
                        </p>
                        <p className="text-sm text-gray-600">
                          +{getWhatsAppNumber()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          kawanestudio.com
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
                  <CardTitle className="text-lg">
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        1
                      </div>
                      <p>Click "Chat WhatsApp" button above</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        2
                      </div>
                      <p>Send the pre-filled message to our WhatsApp</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        3
                      </div>
                      <p>Our team will provide payment instructions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        4
                      </div>
                      <p>Complete payment and confirm with our team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
