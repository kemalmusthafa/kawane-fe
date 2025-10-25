"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { CartItemState } from "../../types/cart";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { format } from "date-fns";
import { toastNotifications } from "@/utils/toast";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Login Required
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Please login to view your shopping cart
            </p>
            <Link href="/auth/sign-in">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Login
              </Button>
            </Link>
          </div>
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
      toastNotifications.warning.loginRequired();
      return;
    }

    if (items.length === 0) {
      toastNotifications.warning.cartEmpty();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Loading Cart...
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Loading your shopping cart data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Error Loading Cart
            </h2>
            <p className="text-base text-red-600 dark:text-red-400 mb-6">
              {error instanceof Error ? error.message : String(error)}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Empty Cart
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Add some products to your cart
            </p>
            <Link href="/products">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item: CartItemState) => {
              return (
                <Card key={item.id}>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden mx-auto sm:mx-0">
                        {/* Fallback icon - shown by default */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>

                        {/* Product image - hides fallback when loaded */}
                        {item.product.images &&
                        item.product.images.length > 0 ? (
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
                                (fallback as HTMLElement).style.display =
                                  "none";
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
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-words text-center sm:text-left">
                          {item.product.name}
                        </h3>
                        {item.size && (
                          <p className="text-xs text-blue-600 font-medium text-center sm:text-left">
                            Size: {item.size}
                          </p>
                        )}
                        {item.product.deal && (
                          <p className="text-xs text-orange-600 font-medium text-center sm:text-left">
                            {item.product.deal.title}
                          </p>
                        )}
                        <p className="text-gray-600 text-xs break-words text-center sm:text-left line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
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
                      <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="text-center sm:text-right">
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
                            max={
                              item.size && item.product.sizes
                                ? item.product.sizes.find(
                                    (s) => s.size === item.size
                                  )?.stock || item.product.stock
                                : item.product.stock
                            }
                            disabled={isLoading}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >=
                                (item.size && item.product.sizes
                                  ? item.product.sizes.find(
                                      (s) => s.size === item.size
                                    )?.stock || item.product.stock
                                  : item.product.stock) || isLoading
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
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Tax</span>
                  <span>Rp 0</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  <span className="text-xs">Proceed to Checkout</span>
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>

                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-xs">Continue Shopping</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
