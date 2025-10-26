"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { Product } from "@/lib/api";

export function ProductInfo() {
  const [quantity, setQuantity] = useState(1);

  const product: Product = {
    id: "demo-product",
    name: "Premium Wireless Headphones",
    price: 199.99,
    rating: 4.8,
    stock: 45,
    description:
      "Experience crystal-clear sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort for extended listening sessions.",
    categoryId: "demo-category",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating} (0 reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold">${product.price}</span>
        {false && (
          <span className="text-xl text-muted-foreground line-through">$0</span>
        )}
        {false && <Badge variant="destructive">0% OFF</Badge>}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            product.stock > 0 ? "bg-success" : "bg-destructive"
          }`}
        />
        <span className="text-sm">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Description */}
      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {product.description}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={increaseQuantity}
          >
            +
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <AddToCartButton
          product={product}
          quantity={quantity}
          size="lg"
          className="flex-1"
        />
        <AddToWishlistButton product={product} size="lg" />
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over $50</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Secure Payment</p>
            <p className="text-xs text-muted-foreground">SSL encrypted</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">30-Day Returns</p>
            <p className="text-xs text-muted-foreground">Hassle-free</p>
          </div>
        </div>
      </div>
    </div>
  );
}
