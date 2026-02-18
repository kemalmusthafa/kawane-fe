"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Lock } from "lucide-react";

export function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle payment submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Method Selection */}
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label
                  htmlFor="credit-card"
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="cash-on-delivery"
                  id="cash-on-delivery"
                />
                <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
              </div>
            </div>
          </RadioGroup>

          {/* Credit Card Form */}
          {paymentMethod === "credit-card" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleChange("cvv", e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName}
                  onChange={(e) =>
                    handleChange("cardholderName", e.target.value)
                  }
                  placeholder="John Doe"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Pay Now
              </Button>
            </form>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === "bank-transfer" && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span>Bank Central Asia (BCA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span>1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span>Kawane Studio</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Please transfer the exact amount and include your order number
                as a reference.
              </p>
              <Button className="w-full">Confirm Order</Button>
            </div>
          )}

          {/* Cash on Delivery Info */}
          {paymentMethod === "cash-on-delivery" && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Pay with cash when your order is delivered. Additional fee of
                  $2.99 applies.
                </p>
              </div>
              <Button className="w-full">Confirm Order</Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
