import { useCartApi } from "./useApi";
import { Product } from "@/lib/api";

export const useCart = () => {
  const {
    cart,
    items,
    totalItems,
    totalAmount,
    error,
    isLoading,
    addToCart,
    addDealToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mutate,
  } = useCartApi();

  // Helper functions untuk kompatibilitas
  const addItem = async (
    productId: string,
    quantity: number = 1,
    size?: string
  ) => {
    return addToCart(productId, quantity, size);
  };

  const addDealItem = async (
    dealId: string,
    productId: string,
    quantity: number = 1,
    selectedSize?: string
  ) => {
    return addDealToCart(dealId, productId, quantity, selectedSize);
  };

  const removeItem = async (cartItemId: string) => {
    return removeFromCart(cartItemId);
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    return updateCartItem(cartItemId, quantity);
  };

  const loadCart = async () => {
    return mutate();
  };

  const refreshCart = async () => {
    return mutate();
  };

  const isInCart = (productId: string) => {
    return items.some((item: any) => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((item: any) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return {
    cart,
    items,
    totalItems,
    totalAmount,
    error,
    isLoading,
    addItem,
    addDealItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
    refreshCart,
    isInCart,
    getItemQuantity,
    // API methods
    addToCart,
    updateCartItem,
    removeFromCart,
    mutate,
  };
};

// Hook untuk add item dengan product object (untuk kompatibilitas)
export const useAddToCart = () => {
  const { addItem } = useCart();
  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    await addItem(productId, quantity);
  };
  return { handleAddToCart };
};
