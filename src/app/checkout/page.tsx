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
      toast.error("Anda harus menyetujui syarat dan ketentuan");
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

    // Debug: Log cart items before creating order
    console.log(
      "🛒 Cart items before order creation:",
      cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        size: (item as any).size,
      }))
    );

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

    // Validate each item in cart
    cartItems.forEach((item, index) => {});

    // Additional validation
    if (cartItems.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error("Alamat pengiriman tidak lengkap");
      return;
    }

    setIsLoading(true);

    try {
      const order = await OrderService.createOrder(orderData);

      // Debug logging

      toast.success("Order berhasil dibuat!");

      // Clear cart
      clearCart();

      // Redirect to payment or order confirmation
      if (order.paymentUrl) {
        // Redirect directly to Midtrans payment page
        toast.success(
          "Pembayaran sedang diproses. Anda akan diarahkan ke halaman pembayaran."
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
      toast.error(error.message || "Gagal membuat order");
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-sm text-gray-600">
            Lengkapi informasi untuk menyelesaikan pesanan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Alamat Lengkap *</Label>
                    <Textarea
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      placeholder="Jl. Contoh No. 123, RT/RW 01/01"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota *</Label>
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
                    <Label htmlFor="postalCode">Kode Pos *</Label>
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
                    <Label htmlFor="country">Negara *</Label>
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
                  Catatan Pesanan (Opsional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center hidden">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium break-words">
                          {item.product.name}
                        </p>
                        {(item as any).size && (
                          <p className="text-xs text-blue-600 font-medium">
                            Ukuran: {(item as any).size}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-xs font-medium">
                        Rp {item.product.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Ongkos Kirim</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Saya menyetujui{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Syarat dan Ketentuan
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
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 mr-2" />
                      Buat Pesanan
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
