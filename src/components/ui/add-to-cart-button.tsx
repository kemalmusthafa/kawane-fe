"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/lib/api";
import { Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toastNotifications } from "@/utils/toast";
import { useAddToCartAnimationContext } from "@/components/providers/add-to-cart-animation-provider";

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
  enableAnimation?: boolean;
}

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
  enableAnimation?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  selectedSize,
  variant = "default",
  size = "default",
  className,
  disabled = false,
  enableAnimation = true,
}) => {
  const { addItem, isLoading, isInCart, getItemQuantity } = useCart();
  const { requireAuth } = useAuthRedirect();
  const [isAdding, setIsAdding] = useState(false);
  
  // Try to get animation context, fallback to no animation if not available
  let triggerAnimation: ((productId: string, imageUrl: string, productName: string) => void) | null = null;
  try {
    const animationContext = useAddToCartAnimationContext();
    triggerAnimation = animationContext.triggerAnimation;
  } catch (error) {
    // Context not available, animation will be disabled
    console.log("AddToCartAnimationProvider not found, animations disabled");
  }

  const handleAddToCart = async () => {
    if (disabled || isLoading || isAdding) return;

    // Check if product has sizes and size is selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toastNotifications.warning.selectSize();
      return;
    }

    const addToCartAction = async () => {
      try {
        setIsAdding(true);

        await addItem(product.id, quantity, selectedSize);
        
        // Trigger animation if enabled and product has image
        if (enableAnimation && triggerAnimation && product.images && product.images.length > 0) {
          triggerAnimation(
            product.id,
            product.images[0].url,
            product.name
          );
        }
        
        toastNotifications.success.addToCart(product.name);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toastNotifications.error.addToCart();
      } finally {
        setIsAdding(false);
      }
    };

    requireAuth(addToCartAction);
  };

  const isInCartProduct = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Check stock based on selected size
  const getAvailableStock = () => {
    if (selectedSize && product.sizes && product.sizes.length > 0) {
      const sizeStock =
        product.sizes.find((s) => s.size === selectedSize)?.stock || 0;
      return sizeStock;
    }
    return product.stock;
  };

  const availableStock = getAvailableStock();
  const isOutOfStock = availableStock <= 0;
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
