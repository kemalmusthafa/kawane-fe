"use client";

import { useWishlist } from "@/hooks/useApi";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Loader2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
// Removed Next.js Image import to avoid blob issues
import { useCart } from "@/hooks/useCart";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { wishlist, isLoading, error, toggleWishlist } = useWishlist();

  const handleAddToCart = async (product: any) => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    try {
      await addItem(product.id, 1);
      toast.success("Produk berhasil ditambahkan ke keranjang");
    } catch (error) {
      toast.error("Gagal menambahkan produk ke keranjang");
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      toast.success("Produk dihapus dari wishlist");
    } catch (error) {
      toast.error("Gagal menghapus produk dari wishlist");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Login Required
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 lg:mb-8">
            Silakan login untuk melihat wishlist Anda
          </p>
          <Link href="/auth/sign-in">
            <Button className="text-xs sm:text-sm">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-3 sm:mb-4 animate-spin" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Loading Wishlist...
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 lg:mb-8">
            Memuat daftar wishlist Anda
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-red-300 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Error Loading Wishlist
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-red-600 mb-4 sm:mb-6 lg:mb-8">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="text-xs sm:text-sm"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Wishlist Kosong
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 lg:mb-8">
            Tambahkan produk ke wishlist Anda
          </p>
          <Link href="/products">
            <Button className="text-xs sm:text-sm">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Lihat Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
          My Wishlist
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} di wishlist
          Anda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {wishlist.map((item: any, index: number) => {
          const product = item.product;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                  <Link href={`/products/${product.id}`}>
                    <div className="w-full h-32 sm:h-40 lg:h-48 bg-muted rounded-lg mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove("hidden");
                              }
                            }}
                          />
                          <div className="w-full h-full items-center justify-center absolute inset-0 bg-gray-100 hidden">
                            <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                          </div>
                        </>
                      ) : (
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                      )}
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="p-3 sm:p-4 pt-0">
                  <Link href={`/products/${product.id}`}>
                    <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2 hover:text-primary cursor-pointer mb-1 sm:mb-2">
                      {product.name}
                    </CardTitle>
                  </Link>

                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                    <Badge
                      variant={
                        product.stock > 10
                          ? "default"
                          : product.stock > 0
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] sm:text-xs"
                    >
                      {product.stock > 10
                        ? "In Stock"
                        : product.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-primary">
                      Rp{" "}
                      {product.price
                        ? product.price.toLocaleString("id-ID")
                        : "0"}
                    </span>
                  </div>

                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8 sm:w-10 sm:h-10"
                    >
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
