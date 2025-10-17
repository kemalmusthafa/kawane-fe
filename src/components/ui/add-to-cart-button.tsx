"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/lib/api";
import { Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  selectedSize?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  selectedSize,
  variant = "default",
  size = "default",
  className,
  disabled = false,
}) => {
  const { addItem, isLoading, isInCart, getItemQuantity } = useCart();
  const { requireAuth } = useAuthRedirect();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isLoading || isAdding) return;

    // Check if product has sizes and size is selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu");
      return;
    }

    const addToCartAction = async () => {
      try {
        setIsAdding(true);

        await addItem(product.id, quantity, selectedSize);
        toast.success("Produk ditambahkan ke keranjang");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Gagal menambahkan produk ke keranjang");
      } finally {
        setIsAdding(false);
      }
    };

    requireAuth(addToCartAction);
  };

  const isInCartProduct = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const isDisabled = disabled || isLoading || isAdding || isOutOfStock;

  if (isOutOfStock) {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        Out of Stock
      </Button>
    );
  }

  if (isInCartProduct) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={className}
        disabled={isDisabled}
        onClick={handleAddToCart}
      >
        {isAdding ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Check className="w-4 h-4 mr-2" />
        )}
        In Cart ({cartQuantity})
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isDisabled}
      onClick={handleAddToCart}
    >
      {isAdding ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Plus className="w-4 h-4 mr-2" />
      )}
      Add to Cart
    </Button>
  );
};
