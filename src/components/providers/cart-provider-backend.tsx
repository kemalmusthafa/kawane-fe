"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { apiClient } from "@/lib/api";
import {
  CartState,
  CartActions,
  CartContextType,
  BackendCartItem,
  CartItemState,
} from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItemState[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart data from backend
  const loadCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotalItems(0);
      setTotalAmount(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getCart();
      const data = response.data as any;

      if (data.cart && data.cart.items) {
        const cartItems: CartItemState[] = data.cart.items.map(
          (item: BackendCartItem) => ({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
          })
        );
        setItems(cartItems);
        setTotalItems(data.totalItems || 0);
        setTotalAmount(data.totalAmount || 0);
      } else {
        setItems([]);
        setTotalItems(0);
        setTotalAmount(0);
      }
    } catch (error: any) {
      console.error("Error loading cart:", error);
      // Don't set error for authentication issues
      if (!error.message?.includes("Login required")) {
        setError(error.message || "Failed to load cart");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to add items to cart");
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.addToCart(productId, quantity);
      await loadCart(); // Refresh cart data
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      setError(error.message || "Failed to add item to cart");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: string) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to remove items from cart");
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.removeFromCart(cartItemId);
      await loadCart(); // Refresh cart data
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      setError(error.message || "Failed to remove item from cart");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to update cart");
    }

    if (quantity < 1) {
      await removeItem(cartItemId);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.updateCartItem(cartItemId, quantity);
      await loadCart(); // Refresh cart data
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      setError(error.message || "Failed to update cart item");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to clear cart");
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.clearCart();
      await loadCart(); // Refresh cart data
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      setError(error.message || "Failed to clear cart");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh cart (alias for loadCart)
  const refreshCart = loadCart;

  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.product.id === productId);
  };

  // Get quantity of specific product in cart
  const getItemQuantity = (productId: string): number => {
    const item = items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Load cart when component mounts or authentication changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
    refreshCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
