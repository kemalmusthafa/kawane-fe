"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import Link from "next/link";
import { Package } from "lucide-react";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    isLoading,
    error,
    updateQuantity,
    removeItem,
  } = useCart();

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

  const handleRemoveItem = async (cartItemId: string) => {
    await removeItem(cartItemId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu untuk checkout");
      setIsOpen(false);
      return;
    }

    if (items.length === 0) {
      toast.error("Cart kosong");
      return;
    }

    // Navigate to checkout page
    window.location.href = "/checkout";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge
              className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs ${
                totalItems > 0 ? "block" : "hidden"
              }`}
            >
              {totalItems}
            </Badge>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 lg:w-96">
        <SheetHeader>
          <SheetTitle className="text-sm sm:text-base">
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {!isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Login Required
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  Silakan login untuk melihat keranjang belanja Anda
                </p>
                <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="text-xs sm:text-sm">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-3 sm:mb-4 animate-spin" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Loading cart...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-red-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-red-600">
                  Error loading cart
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : String(error)}
                </p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your cart is empty
                </p>
                <Link href="/products" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 sm:mt-4 text-xs sm:text-sm"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 sm:space-x-4 py-3 sm:py-4 border-b"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-md overflow-hidden relative">
                      {item.product?.images &&
                      item.product.images.length > 0 ? (
                        <>
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
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
                          <div className="w-full h-full bg-muted flex items-center justify-center sm:hidden">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-xs sm:text-sm">
                        {item.product?.name || "Unknown Product"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Rp {item.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                        <span className="text-xs sm:text-sm w-6 sm:w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base font-semibold">
                  <span>Total:</span>
                  <span>Rp {totalAmount?.toLocaleString() || "0"}</span>
                </div>
                <Button
                  className="w-full text-xs sm:text-sm"
                  size="sm"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Link href="/products" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                    size="sm"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
