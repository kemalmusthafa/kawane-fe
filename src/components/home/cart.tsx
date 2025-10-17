"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { CartItemState } from "../../types/cart";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowRight,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
// Removed Next.js Image import to avoid blob issues

export const Cart: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    isLoading,
    error,
  } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please login to view your shopping cart
          </p>
          <Link href="/auth/sign-in">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      await removeItem(cartItemId);
    } else {
      await updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login first to checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Navigate to checkout page
    router.push("/checkout");
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Loader2 className="w-24 h-24 text-gray-300 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Cart...
          </h2>
          <p className="text-gray-600 mb-8">Loading your shopping cart data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="w-24 h-24 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-red-600 mb-8">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Empty Cart</h2>
          <p className="text-sm text-gray-600 mb-8">
            Add some products to your cart
          </p>
          <Link href="/products">
            <Button>
              <Package className="w-4 h-4 mr-2" />
              View Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-600 mt-2">
          {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItemState) => {
            console.log("🛒 Rendering cart item:", {
              id: item.id,
              productId: item.product.id,
              productName: item.product.name,
            });
            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {/* Fallback icon - shown by default */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>

                      {/* Product image - hides fallback when loaded */}
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full rounded-lg object-cover relative z-10"
                          onLoad={(e) => {
                            // Hide fallback icon when image loads successfully
                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".absolute"
                              );
                            if (fallback) {
                              (fallback as HTMLElement).style.display = "none";
                            }
                            return;
                          }}
                          onError={(e) => {
                            // Hide the failed image, show fallback
                            e.currentTarget.style.display = "none";
                            return;
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 break-words">
                        {item.product.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-blue-600 font-medium">
                          Ukuran: {item.size}
                        </p>
                      )}
                      {item.product.deal && (
                        <p className="text-xs text-orange-600 font-medium">
                          {item.product.deal.title}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs break-words">
                        {item.product.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant={
                            item.product.stock > 10
                              ? "default"
                              : item.product.stock > 0
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {item.product.stock > 10
                            ? "In Stock"
                            : item.product.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {/* Show deal price if available, otherwise show original price */}
                        {item.product.deal ? (
                          <>
                            <p className="text-sm font-semibold text-gray-900">
                              Rp{" "}
                              {item.product.deal.discountedPrice.toLocaleString(
                                "id-ID"
                              )}
                            </p>
                            <p className="text-xs text-gray-500 line-through">
                              Rp{" "}
                              {item.product.deal.originalPrice.toLocaleString(
                                "id-ID"
                              )}
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              -{item.product.deal.discountPercentage}% OFF
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">
                            Rp {item.product.price.toLocaleString("id-ID")}
                          </p>
                        )}

                        {/* Total for this item */}
                        <p className="text-xs text-gray-600 mt-1">
                          Total: Rp{" "}
                          {item.product.deal
                            ? (
                                item.product.deal.discountedPrice *
                                item.quantity
                              ).toLocaleString("id-ID")
                            : (
                                item.product.price * item.quantity
                              ).toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 text-center"
                          min="1"
                          max={item.product.stock}
                          disabled={isLoading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.stock || isLoading
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Rp 0</span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Proceed to Checkout
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              <Link href="/products" className="block">
                <Button variant="outline" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
