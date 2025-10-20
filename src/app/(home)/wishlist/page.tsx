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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-8">
            Silakan login untuk melihat wishlist Anda
          </p>
          <Link href="/auth/sign-in">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Loader2 className="w-24 h-24 text-gray-300 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Wishlist...
          </h2>
          <p className="text-gray-600 mb-8">Memuat daftar wishlist Anda</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-24 h-24 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Wishlist
          </h2>
          <p className="text-red-600 mb-8">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wishlist Kosong
          </h2>
          <p className="text-gray-600 mb-8">
            Tambahkan produk ke wishlist Anda
          </p>
          <Link href="/products">
            <Button>
              <Package className="w-4 h-4 mr-2" />
              Lihat Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-2">
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} di wishlist
          Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <CardHeader className="p-4 pb-2">
                  <Link href={`/products/${product.id}`}>
                    <div className="w-full h-48 bg-muted rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center relative">
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
                          <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-gray-100">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        </>
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <Link href={`/products/${product.id}`}>
                    <CardTitle className="text-lg line-clamp-2 hover:text-primary cursor-pointer mb-2">
                      {product.name}
                    </CardTitle>
                  </Link>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-2 mb-3">
                    <Badge
                      variant={
                        product.stock > 10
                          ? "default"
                          : product.stock > 0
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.stock > 10
                        ? "In Stock"
                        : product.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      Rp{" "}
                      {product.price
                        ? product.price.toLocaleString("id-ID")
                        : "0"}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1"
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Heart className="w-4 h-4 fill-current" />
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
