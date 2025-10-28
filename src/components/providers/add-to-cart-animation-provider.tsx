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

        // Use multiple requestAnimationFrame calls to ensure DOM is fully updated
        // This matches the timing of cart state updates
        if (typeof window !== "undefined") {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              triggerAnimation(productId, imageUrl, productName);
            });
          });
        } else {
          triggerAnimation(productId, imageUrl, productName);
        }
      } catch (error) {
        console.error(
          "AddToCartAnimationProvider: error in triggerWithFreshPosition:",
          error
        );
        // Fallback to direct trigger
        triggerAnimation(productId, imageUrl, productName);
      }
    },
    [triggerAnimation, updateCartPosition, cartPosition]
  );

  return (
    <AddToCartAnimationContext.Provider
      value={{ triggerAnimation: triggerWithFreshPosition }}
    >
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
