"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Product } from "@/lib/api";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { ProductRating } from "@/components/ui/product-rating";
import { DealBadge, DealTimeLeft } from "@/components/ui/deal-badge";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
  salesCount?: number; // Add salesCount prop
  hideAddToCart?: boolean; // Add prop to hide add to cart button
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

export function ProductCard({
  product,
  showNewBadge = false,
  salesCount, // Add salesCount to destructuring
  hideAddToCart = false, // Add hideAddToCart prop
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const images = product.images?.map((img) => img.url) || [];

  const handleAddToCart = async (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const availableSizes = product.sizes?.filter((size) => size.stock > 0) || [];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/products/${product.id}`}>
            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-muted group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </Link>

          {/* Wishlist Button - Smaller on mobile */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <AddToWishlistButton
              product={product}
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black w-6 h-6 sm:w-8 sm:h-8"
            />
          </div>

          {/* Deal Badge - Smaller and more responsive */}
          {product.deal && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
              <DealBadge deal={product.deal} size="sm" />
            </div>
          )}

          {/* New Badge - Smaller and more responsive */}
          {showNewBadge && !product.deal && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
              <span className="bg-red-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-md">
                NEW
              </span>
            </div>
          )}

          {/* Sales Count Badge - Bottom Left of Image - Smaller and more responsive */}
          {salesCount !== undefined && (
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2">
              <div className="bg-black/80 text-white text-[8px] xs:text-[9px] sm:text-[10px] px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-md">
                {salesCount} sold
              </div>
            </div>
          )}
        </div>

        <div className="p-2 sm:p-2.5 md:p-4 lg:p-6">
          <div className="mb-1 sm:mb-2">
            <ProductRating
              rating={product.rating || 0}
              reviewCount={product._count?.reviews || 0}
              size="sm"
              showCount={true}
            />
          </div>

          <Link href={`/products/${product.id}`}>
            <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold mb-1 sm:mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Size Information - Now visible on mobile with better styling */}
          {hasSizes && (
            <div className="mb-1 sm:mb-2 md:mb-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className="text-[9px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Size:
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {availableSizes.slice(0, 8).map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.size)}
                    className={`p-1 text-center rounded border transition-colors ${
                      selectedSize === size.size
                        ? "border-blue-500 bg-blue-500 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-white"
                        : "border-gray-300 hover:border-gray-400 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-[8px] font-medium">{size.size}</div>
                  </button>
                ))}
              </div>
              {availableSizes.length > 8 && (
                <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  +{availableSizes.length - 8} more
                </p>
              )}
              {selectedSize && (
                <p className="text-[9px] sm:text-xs text-green-600 mt-1 sm:mt-2 text-left">
                  ✓ Size {selectedSize} selected
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 md:mb-3">
            {product.deal ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-xs sm:text-sm md:text-lg font-bold text-primary">
                    Rp {product.deal.discountedPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                    Rp {product.deal.originalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <DealTimeLeft endDate={product.deal.endDate} />
                </div>
              </div>
            ) : (
              <span className="text-xs sm:text-sm md:text-lg font-bold text-primary">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          <div className="flex space-x-1 sm:space-x-2">
            {!hideAddToCart && (
              <AddToCartButton
                product={product}
                className="flex-1 text-[10px] sm:text-xs"
                size="sm"
                selectedSize={selectedSize}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
