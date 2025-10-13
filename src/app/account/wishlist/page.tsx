"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useWishlist } from "@/hooks/useApi";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading, error, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (error) {
      toast.error("Gagal mengambil data wishlist");
    }
  }, [error]);

  const removeFromWishlist = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error("Gagal menghapus dari wishlist");
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Gagal menambahkan ke cart");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to view your wishlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wishlist</h1>
        <p className="text-sm text-gray-600">Your favorite products</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : wishlist.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Start adding products you love to your wishlist.
            </p>
            <Link href="/products">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(wishlist)
            ? wishlist.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={
                          item.product.images?.[0]?.url ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium mb-2 line-clamp-2 break-words">
                        {item.product.name || "Unknown Product"}
                      </h3>
                      <p className="text-base font-bold text-green-600 mb-3">
                        Rp {(item.product.price || 0).toLocaleString("id-ID")}
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => addToCart(item.product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : null}
        </div>
      )}
    </div>
  );
}
