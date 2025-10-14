"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { OrderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import MidtransPayment from "@/components/payment/midtrans-payment";

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
          <p>Order not found</p>
          <Link href="/account/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <Link href={`/account/orders/${orderId}`}>
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Order Details
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600 mt-2">
              Complete payment for Order #{order.orderNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                {user && (
                  <MidtransPayment
                    orderId={order.id}
                    amount={order.totalAmount}
                    customerDetails={{
                      first_name: user.name?.split(" ")[0] || "",
                      last_name: user.name?.split(" ").slice(1).join(" ") || "",
                      email: user.email || "",
                      phone: user.phone || "",
                    }}
                    onSuccess={(result) => {
                      toast.success("Payment successful!");
                      router.push(`/account/orders/${orderId}`);
                    }}
                    onError={(error) => {
                      toast.error("Payment failed");
                    }}
                    onPending={(result) => {
                      toast.info("Payment is being processed");
                      router.push(`/account/orders/${orderId}`);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
