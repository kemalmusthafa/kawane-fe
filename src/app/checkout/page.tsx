"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/hooks/useCart";
import { OrderService, CreateOrderData } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, MapPin, Loader2, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
// Removed Next.js Image import to avoid blob issues

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { items: cartItems, totalAmount: total, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  // Payment method will be handled by Midtrans popup
  const selectedPaymentMethod = "midtrans"; // Default to Midtrans
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Indonesia",
    phone: "",
  });

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in?redirect=/checkout");
      return;
    }

    if (cartItems.length === 0) {
      router.push("/cart");
      return;
    }

    // Pre-fill shipping address with user data if available
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, cartItems.length, user, router]);

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateOrder = async () => {
    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    // Map payment method to backend expected values
    const mapPaymentMethod = (method: string) => {
      switch (method) {
        case "midtrans":
        case "gopay":
        case "shopeepay":
        case "credit_card":
          return "WHATSAPP_MANUAL"; // Use valid enum value
        case "bca":
        case "bni":
        case "mandiri":
          return "BANK_TRANSFER";
        case "alfamart":
        case "indomaret":
          return "CASH_ON_DELIVERY";
        default:
          return "WHATSAPP_MANUAL"; // Use valid enum value
      }
    };

    const orderData = {
      // Backend expects these fields at root level
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        ...((item as any).size && { size: (item as any).size }), // Include size information if available
      })),
      totalAmount: total, // Total amount from cart (this is what Midtrans will use)

      // Shipping address as string (concatenated)
      shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,

      // Mapped payment method
      paymentMethod: mapPaymentMethod(selectedPaymentMethod),

      // Address ID (null for new address, or existing address ID)
      addressId: null, // We're using new address, not existing one

      // Optional fields
      notes: notes.trim() || "",
    };

    // Validate order data
    const validation = OrderService.validateOrderData(orderData);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    // Validate each item in cart for stock availability
    for (const item of cartItems) {
      if (item.size && item.product.sizes && item.product.sizes.length > 0) {
        const sizeStock =
          item.product.sizes.find((s) => s.size === item.size)?.stock || 0;
        if (sizeStock < item.quantity) {
          toast.error(
            `Insufficient stock for ${item.product.name} size ${item.size}. Available: ${sizeStock}, Requested: ${item.quantity}`
          );
          return;
        }
      } else {
        if (item.product.stock < item.quantity) {
          toast.error(
            `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`
          );
          return;
        }
      }
    }

    // Additional validation
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error("Shipping address is incomplete");
      return;
    }

    setIsLoading(true);

    try {
      const order = await OrderService.createOrder(orderData);

      // Debug logging

      toast.success("Order created successfully!");

      // Clear cart
      clearCart();

      // Redirect to payment or order confirmation
      if (order.paymentUrl) {
        // Redirect directly to Midtrans payment page
        toast.success(
          "Payment is being processed. You will be redirected to the payment page."
        );
        // Use window.location.href for direct redirect
        window.location.href = order.paymentUrl;
      } else {
        // If no payment URL, go directly to order detail
        router.push(`/account/orders/${order.orderId}`);
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      console.error("Error details:", error.response || error.message);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Complete your information to finalize your order
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="street">Full Address *</Label>
                    <Textarea
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      placeholder="Street address, apartment, suite, etc."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Jakarta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="Indonesia"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Order Notes (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions for your order..."
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="sticky top-4 sm:top-6 lg:top-8">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Order Items */}
                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove("hidden");
                              }
                            }}
                          />
                        ) : null}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg items-center justify-center hidden">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium break-words line-clamp-2">
                          {item.product.name}
                        </p>
                        {(item as any).size && (
                          <p className="text-xs sm:text-sm text-blue-600 font-medium mt-1">
                            Size: {(item as any).size}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-right">
                        Rp {item.product.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Total */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked as boolean)
                    }
                    className="mt-0.5 sm:mt-1"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs sm:text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleCreateOrder}
                  disabled={isLoading || !agreeToTerms}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
