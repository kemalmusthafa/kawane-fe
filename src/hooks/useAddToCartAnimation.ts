"use client";

import { useState, useCallback } from "react";

interface AnimationState {
  isAnimating: boolean;
  productId: string | null;
  imageUrl: string | null;
  productName: string | null;
}

export const useAddToCartAnimation = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    productId: null,
    imageUrl: null,
    productName: null,
  });

  const triggerAnimation = useCallback(
    (productId: string, imageUrl: string, productName: string) => {
      // Use requestAnimationFrame to ensure state update happens at the right time
      requestAnimationFrame(() => {
        setAnimationState({
          isAnimating: true,
          productId,
          imageUrl,
          productName,
        });

        // Reset animation after duration - match cart update timing
        setTimeout(() => {
          setAnimationState({
            isAnimating: false,
            productId: null,
            imageUrl: null,
            productName: null,
          });
        }, 1200); // Slightly longer duration to match cart badge update
      });
    },
    []
  );

  return {
    animationState,
    triggerAnimation,
  };
};
