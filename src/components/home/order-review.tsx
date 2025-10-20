"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const orderItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    quantity: 1,
    image: "/headphones.jpg",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    quantity: 1,
    image: "/watch.jpg",
  },
];

export function OrderReview() {
  const subtotal: number = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping: number = 0; // Free shipping
  const tax: number = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-md" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-success" : ""}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Shipping Info */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Estimated Delivery</p>
          <p className="text-sm text-muted-foreground">
            3-5 business days • Free shipping on orders over $50
          </p>
        </div>

        {/* Promo Code */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
            Apply
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
