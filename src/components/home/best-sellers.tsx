"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import { useBestSellers } from "@/hooks/use-best-sellers";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useApi";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { BestSellerProduct } from "@/hooks/use-best-sellers";
import { Product } from "@/lib/api";

export function BestSellers() {
  const { data, loading, error } = useBestSellers({
    limit: 4,
    timeRange: "month",
  });
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product: BestSellerProduct) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (product: BestSellerProduct) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      await toggleWishlist(product.id);
      toast.success(
        isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCartWrapper = async (product: Product) => {
    const bestSellerProduct = bestSellers.find((p) => p.id === product.id);
    if (bestSellerProduct) {
      await handleAddToCart(bestSellerProduct);
    }
  };

  const handleToggleWishlistWrapper = async (product: Product) => {
    const bestSellerProduct = bestSellers.find((p) => p.id === product.id);
    if (bestSellerProduct) {
      await handleToggleWishlist(bestSellerProduct);
    }
  };

  if (loading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Best Sellers
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              Our most popular products loved by customers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="w-full h-48 bg-muted rounded-lg mb-3" />
                    <div className="h-6 bg-muted rounded mb-2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-4 bg-muted rounded mb-3" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Best Sellers
            </h2>
            <p className="text-red-600 text-base sm:text-lg">
              Failed to load products: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const bestSellers = data?.bestSellers || [];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Our most popular products loved by customers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {bestSellers.map((product: BestSellerProduct, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                {/* Best Seller Badge - Smaller and more responsive */}
                <div className="absolute top-1 left-1 z-10">
                  <span className="bg-orange-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded-md">
                    #{index + 1} Best Seller
                  </span>
                </div>

                <ProductCard
                  product={{
                    ...product,
                    description: product.description || "",
                    categoryId: product.categoryId || undefined,
                    sku: product.sku || undefined,
                    category: product.category
                      ? {
                          ...product.category,
                          description:
                            product.category.description || undefined,
                          image: product.category.image || undefined,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        }
                      : undefined,
                  }}
                  salesCount={product.totalSold}
                  hideAddToCart={true}
                  onAddToCart={handleAddToCartWrapper}
                  onToggleWishlist={handleToggleWishlistWrapper}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {bestSellers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No sales data available to display best sellers
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Data will appear after there are transactions and product reviews
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
