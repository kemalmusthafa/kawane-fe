"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  ShoppingCart,
  Package,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

interface WhatsAppCheckoutProps {
  onSuccess: (orderData: any) => void;
  onCancel: () => void;
}

export const WhatsAppCheckout: React.FC<WhatsAppCheckoutProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleWhatsAppCheckout = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    // Validate required fields
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !whatsappPhone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingAddress,
          whatsappPhoneNumber: whatsappPhone,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Open WhatsApp with pre-filled message
        window.open(data.data.whatsappLink, "_blank");

        // Clear cart
        await clearCart();

        // Show success message
        toast.success("Order created! Check your WhatsApp.");

        // Call success callback
        onSuccess(data.data);
      } else {
        toast.error("Error creating order: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="whatsapp-checkout max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            Checkout via WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Package className="w-3 h-3" />
                    {item.product.name}
                    {(item.product as any).size && (
                      <span className="text-gray-500">
                        ({(item.product as any).size})
                      </span>
                    )}{" "}
                    x{item.quantity}
                  </span>
                  <span className="font-medium">
                    Rp{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Jakarta"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="12345"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              WhatsApp Number *
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="081234567890"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
            />
            <p className="text-sm text-gray-600">
              This number will be used to send order details via WhatsApp
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleWhatsAppCheckout}
              disabled={
                isLoading ||
                !shippingAddress.name ||
                !shippingAddress.phone ||
                !whatsappPhone
              }
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              {isLoading ? "Processing..." : "Checkout via WhatsApp"}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> After clicking checkout, you'll be
              redirected to WhatsApp with a pre-filled message containing your
              order details. Send this message to complete your order.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
