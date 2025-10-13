"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useApi";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useApi";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { ProductRating } from "@/components/ui/product-rating";
import { DealBadge, DealTimeLeft } from "@/components/ui/deal-badge";

interface ProductGridProps {
  categoryId?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
}

export function ProductGrid({
  categoryId,
  searchTerm,
  sortBy = "name",
  sortOrder = "asc",
  minPrice,
  maxPrice,
  inStock,
  onPageChange,
  currentPage = 1,
}: ProductGridProps) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { requireAuth } = useAuthRedirect();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const { products, pagination, error, isLoading, mutateProducts } =
    useProducts({
      search: searchTerm,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: 20,
    });

  const handleWishlistToggle = async (product: any) => {
    if (!isAuthenticated) {
      toast.error("Please login first to add to wishlist");
      return;
    }

    try {
      const response = await toggleWishlist(product.id);
      if (response.success) {
        toast.success("Product successfully added to wishlist");
        mutateProducts();
      } else {
        toast.error(response.message || "Failed to add to wishlist");
      }
    } catch (error) {
      toast.error("An error occurred while adding to wishlist");
    }
  };

  const handleAddToCart = async (product: any) => {
    const addToCartAction = async () => {
      try {
        await addItem(product.id, 1);
        toast.success("Product added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add product to cart");
      }
    };

    requireAuth(addToCartAction);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Failed to load products:{" "}
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button onClick={() => mutateProducts()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href={`/products/${product.id}`}>
                    <div className="w-full h-80 bg-muted group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      {product.images && product.images.length > 0 && (
                        <div className="w-full h-full items-center justify-center text-muted-foreground hidden">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Deal Badge */}
                  {product.deal && (
                    <div className="absolute top-4 left-4">
                      <DealBadge deal={product.deal} size="sm" />
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <AddToWishlistButton
                      product={product}
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="p-8">
                  {/* Rating */}
                  <div className="mb-3">
                    <ProductRating
                      rating={product.rating || 0}
                      reviewCount={product._count?.reviews || 0}
                      size="md"
                      showCount={true}
                    />
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.id}`}>
                    <h4 className="text-base font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    {product.deal ? (
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.deal.discountedPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.deal.originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <DealTimeLeft endDate={product.deal.endDate} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex space-x-2">
                    <AddToCartButton
                      product={product}
                      className="flex-1"
                      size="lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
