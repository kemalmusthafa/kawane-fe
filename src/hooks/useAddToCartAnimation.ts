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
      setAnimationState({
        isAnimating: true,
        productId,
        imageUrl,
        productName,
      });

      // Reset animation after duration
      setTimeout(() => {
        setAnimationState({
          isAnimating: false,
          productId: null,
          imageUrl: null,
          productName: null,
        });
      }, 1000); // Animation duration
    },
    []
  );

  return {
    animationState,
    triggerAnimation,
  };
};



