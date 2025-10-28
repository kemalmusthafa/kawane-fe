"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useAddToCartAnimation } from "@/hooks/useAddToCartAnimation";
import { useCartPosition } from "@/hooks/useCartPosition";
import { AddToCartAnimation } from "@/components/ui/add-to-cart-animation";

interface AddToCartAnimationContextType {
  triggerAnimation: (
    productId: string,
    imageUrl: string,
    productName: string
  ) => void;
}

const AddToCartAnimationContext =
  createContext<AddToCartAnimationContextType | null>(null);

export const useAddToCartAnimationContext = () => {
  const context = useContext(AddToCartAnimationContext);
  if (!context) {
    throw new Error(
      "useAddToCartAnimationContext must be used within AddToCartAnimationProvider"
    );
  }
  return context;
};

interface AddToCartAnimationProviderProps {
  children: ReactNode;
}

export const AddToCartAnimationProvider: React.FC<
  AddToCartAnimationProviderProps
> = ({ children }) => {
  const { animationState, triggerAnimation } = useAddToCartAnimation();
  const { cartPosition, updateCartPosition } = useCartPosition();

  // Ensure we recalc cart position right before triggering animation
  const triggerWithFreshPosition = useCallback(
    (productId: string, imageUrl: string, productName: string) => {
      try {
        // Recalculate cart position synchronously
        updateCartPosition();
        // Next frame to ensure layout updated
        if (typeof window !== "undefined") {
          requestAnimationFrame(() => {
            setTimeout(() => {
              triggerAnimation(productId, imageUrl, productName);
            }, 16);
          });
        } else {
          triggerAnimation(productId, imageUrl, productName);
        }
      } catch {
        // Fallback to direct trigger
        triggerAnimation(productId, imageUrl, productName);
      }
    },
    [triggerAnimation, updateCartPosition]
  );

  return (
    <AddToCartAnimationContext.Provider value={{ triggerAnimation: triggerWithFreshPosition }}>
      {children}

      {/* Global Add to Cart Animation */}
      <AddToCartAnimation
        isAnimating={animationState.isAnimating}
        productId={animationState.productId}
        imageUrl={animationState.imageUrl}
        productName={animationState.productName}
        cartPosition={cartPosition}
      />
    </AddToCartAnimationContext.Provider>
  );
};



