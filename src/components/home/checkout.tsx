"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/providers/auth-provider";
import { useAddresses, useOrders, usePayments } from "@/hooks/useApi";
import { OrderService } from "@/services/order.service";
import { toast } from "sonner";
import { WhatsAppCheckout } from "@/components/checkout/whatsapp-checkout";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Package,
  ArrowLeft,
  CheckCircle,
  Plus,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface CheckoutFormData {
  shippingAddress: {
    detail: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
  };
  paymentMethod: "WHATSAPP_MANUAL" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";
  notes?: string;
}

export const Checkout: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const { addresses, createAddress } = useAddresses();
  const { createOrder } = useOrders();
  const { createPayment } = usePayments();

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      detail: "",
      city: "",
      province: "",
      postalCode: "",
      isDefault: false,
    },
    paymentMethod: "WHATSAPP_MANUAL",
    notes: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppCheckout, setShowWhatsAppCheckout] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-8">Please login first to checkout</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Empty Cart</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart</p>
          <Link href="/products">
            <Button>
              <Package className="w-4 h-4 mr-2" />
              View Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  const handleSubmitAddress = async () => {
    if (
      !formData.shippingAddress.detail ||
      !formData.shippingAddress.city ||
      !formData.shippingAddress.province ||
      !formData.shippingAddress.postalCode
    ) {
      toast.error("All address fields must be filled");
      return;
    }

    try {
      const response = await createAddress(formData.shippingAddress);
      if (response.success && response.data) {
        setSelectedAddressId(response.data.id);
        setUseExistingAddress(true);
        toast.success("Address successfully added");
      }
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleCheckout = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Map payment method to backend expected values
      const mapPaymentMethod = (method: string) => {
        switch (method) {
          case "gopay":
          case "shopeepay":
          case "credit_card":
          case "midtrans":
            return "WHATSAPP_MANUAL"; // Use WHATSAPP_MANUAL for Midtrans payments
          case "bca":
          case "bni":
          case "mandiri":
            return "BANK_TRANSFER";
          case "alfamart":
          case "indomaret":
            return "CASH_ON_DELIVERY";
          default:
            return "WHATSAPP_MANUAL"; // Default to WHATSAPP_MANUAL
        }
      };

      // Create single order with first item (backend expects single product)
      const firstItem = items[0];
      if (!firstItem) {
        toast.error("Cart is empty");
        return;
      }

      // First, create the address if it's a new address
      let addressId = useExistingAddress ? selectedAddressId : null;

      if (!addressId) {
        // Create new address
        const addressData = {
          detail: formData.shippingAddress.detail,
          city: formData.shippingAddress.city,
          province: "Indonesia",
          postalCode: formData.shippingAddress.postalCode,
        };

        const newAddress = await OrderService.createAddress(addressData);
        if (!newAddress) {
          throw new Error("Failed to create address");
        }
        addressId = newAddress.id;
      }

      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        totalAmount: totalAmount,
        shippingAddress:
          useExistingAddress && selectedAddressId
            ? addresses?.find((addr: any) => addr.id === selectedAddressId)
                ?.detail || ""
            : `${formData.shippingAddress.detail}, ${formData.shippingAddress.city}, ${formData.shippingAddress.postalCode}, Indonesia`,
        paymentMethod: mapPaymentMethod(formData.paymentMethod),
        addressId: addressId,
        notes: formData.notes,
      };

      const orderResponse = await createOrder(orderData);

      if (orderResponse.success) {
        const order = orderResponse.data;
        if (order) {
          // For WhatsApp manual payment, no separate payment creation needed
          clearCart();
          toast.success(
            "Order created successfully! Please contact WhatsApp for payment confirmation."
          );
          router.push("/account/orders");
        }
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/home/cart"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Use Existing Address */}
              {addresses && addresses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="use-existing"
                      checked={useExistingAddress}
                      onCheckedChange={(checked) =>
                        setUseExistingAddress(checked as boolean)
                      }
                    />
                    <Label htmlFor="use-existing">Use existing address</Label>
                  </div>

                  {useExistingAddress && (
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                    >
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="flex items-center space-x-2 p-3 border rounded-lg"
                        >
                          <RadioGroupItem value={address.id} id={address.id} />
                          <Label htmlFor={address.id} className="flex-1">
                            <div>
                              <p className="font-medium">{address.detail}</p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.province}{" "}
                                {address.postalCode}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}

              {/* New Address Form */}
              {!useExistingAddress && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="detail">Full Address</Label>
                      <Textarea
                        id="detail"
                        value={formData.shippingAddress.detail}
                        onChange={(e) =>
                          handleAddressChange("detail", e.target.value)
                        }
                        placeholder="Jl. Sudirman No. 123, RT/RW 01/02"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.shippingAddress.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Jakarta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={formData.shippingAddress.province}
                        onChange={(e) =>
                          handleAddressChange("province", e.target.value)
                        }
                        placeholder="DKI Jakarta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) =>
                          handleAddressChange("postalCode", e.target.value)
                        }
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDefault"
                      checked={formData.shippingAddress.isDefault}
                      onCheckedChange={(checked) =>
                        handleAddressChange("isDefault", checked as boolean)
                      }
                    />
                    <Label htmlFor="isDefault">Make default address</Label>
                  </div>

                  <Button onClick={handleSubmitAddress} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Save Address
                  </Button>
                </div>
              )}

              {/* Add New Address Button */}
              {useExistingAddress && (
                <Button
                  variant="outline"
                  onClick={() => setUseExistingAddress(false)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      WhatsApp Checkout
                    </h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Complete your order by sending a message to our WhatsApp.
                    We'll confirm your order and provide payment instructions.
                  </p>
                  <Button
                    onClick={() => setShowWhatsAppCheckout(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Checkout via WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Special notes for this order (optional)"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      {item.product.deal && (
                        <p className="text-xs text-orange-600 font-medium">
                          DEAL SPECIAL: {item.product.deal.title}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      {item.product.deal ? (
                        <>
                          <p className="text-sm font-medium">
                            Rp{" "}
                            {(
                              item.product.deal.discountedPrice * item.quantity
                            ).toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-gray-500 line-through">
                            Rp{" "}
                            {(
                              item.product.deal.originalPrice * item.quantity
                            ).toLocaleString("id-ID")}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium">
                          Rp{" "}
                          {(item.product.price * item.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>

              <Button
                onClick={() => setShowWhatsAppCheckout(true)}
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Checkout via WhatsApp
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* WhatsApp Checkout Modal */}
      {showWhatsAppCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <WhatsAppCheckout
              onSuccess={(orderData) => {
                setShowWhatsAppCheckout(false);
                toast.success("Order created! Check your WhatsApp.");
                router.push("/account/orders");
              }}
              onCancel={() => setShowWhatsAppCheckout(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
