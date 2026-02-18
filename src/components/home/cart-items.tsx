"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";

const cartItems = [
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
    quantity: 2,
    image: "/watch.jpg",
  },
  {
    id: 3,
    name: "Designer Backpack",
    price: 89.99,
    quantity: 1,
    image: "/backpack.jpg",
  },
];

export function CartItems() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Cart Items ({cartItems.length})
      </h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
          <div className="w-20 h-20 bg-muted rounded-md" />

          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-muted-foreground">${item.price}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              defaultValue={item.quantity}
              className="w-16 text-center"
              min="1"
              readOnly
            />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
