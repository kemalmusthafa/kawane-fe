"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useApi";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useApi";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { Product } from "@/lib/api";

export function NewArrivals() {
  const { products, isLoading, error } = useProducts({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 4,
  });
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success("Produk ditambahkan ke keranjang");
    } catch (error) {
      toast.error("Gagal menambahkan ke keranjang");
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      await toggleWishlist(product.id);
      toast.success(
        isInWishlist(product.id)
          ? "Dihapus dari wishlist"
          : "Ditambahkan ke wishlist"
      );
    } catch (error) {
      toast.error("Gagal mengupdate wishlist");
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              New Arrivals
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl">
              Fresh products just added to our collection
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              New Arrivals
            </h2>
            <p className="text-red-600 text-lg">
              Gagal memuat produk:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            New Arrivals
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Fresh products just added to our collection
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {products?.map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                showNewBadge={true}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
