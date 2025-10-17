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

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4">
            <AddToWishlistButton
              product={product}
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            />
          </div>

          {/* Deal Badge */}
          {product.deal && (
            <div className="absolute top-4 left-4">
              <DealBadge deal={product.deal} size="sm" />
            </div>
          )}

          {/* New Badge */}
          {showNewBadge && !product.deal && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </span>
            </div>
          )}

          {/* Sales Count Badge - Bottom Left of Image */}
          {salesCount !== undefined && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                {salesCount} terjual
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-2 sm:mb-3">
            <ProductRating
              rating={product.rating || 0}
              reviewCount={product._count?.reviews || 0}
              size="sm"
              showCount={true}
            />
          </div>

          <Link href={`/products/${product.id}`}>
            <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Size Information */}
          {hasSizes && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Pilih Ukuran:
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {availableSizes.slice(0, 6).map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.size)}
                    className={`p-2 text-center rounded border transition-colors ${
                      selectedSize === size.size
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-xs font-medium">{size.size}</div>
                  </button>
                ))}
              </div>
              {availableSizes.length > 6 && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  +{availableSizes.length - 6} ukuran lainnya
                </p>
              )}
              {selectedSize && (
                <p className="text-xs text-green-600 mt-2 text-center">
                  ✓ Ukuran {selectedSize} dipilih
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            {product.deal ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-bold text-primary">
                    Rp {product.deal.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    Rp {product.deal.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <DealTimeLeft endDate={product.deal.endDate} />
                </div>
              </div>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-primary">
                Rp {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {!hideAddToCart && (
              <AddToCartButton
                product={product}
                className="flex-1"
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
