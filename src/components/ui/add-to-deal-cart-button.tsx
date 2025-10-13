"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Deal } from "@/lib/api";
import { Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface AddToDealCartButtonProps {
  deal: Deal;
  productId: string;
  quantity?: number;
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

export const AddToDealCartButton: React.FC<AddToDealCartButtonProps> = ({
  deal,
  productId,
  quantity = 1,
  variant = "default",
  size = "default",
  className,
  disabled = false,
}) => {
  const { addDealItem, isLoading, isInCart, getItemQuantity } = useCart();
  const { requireAuth } = useAuthRedirect();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isLoading || isAdding) return;

    const addToCartAction = async () => {
      try {
        setIsAdding(true);
        await addDealItem(deal.id, productId, quantity);
        toast.success("Deal added to cart");
      } catch (error) {
        console.error("Error adding deal to cart:", error);
        toast.error("Failed to add deal to cart");
      } finally {
        setIsAdding(false);
      }
    };

    requireAuth(addToCartAction);
  };

  const isInCartProduct = isInCart(productId);
  const cartQuantity = getItemQuantity(productId);
  const isDisabled = disabled || isLoading || isAdding;

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
