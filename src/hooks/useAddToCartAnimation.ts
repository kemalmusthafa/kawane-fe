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
      console.log("🎬 useAddToCartAnimation: triggerAnimation called with:", { productId, imageUrl, productName });
      
      setAnimationState({
        isAnimating: true,
        productId,
        imageUrl,
        productName,
      });

      // Reset animation after duration
      setTimeout(() => {
        console.log("🎬 useAddToCartAnimation: resetting animation state");
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



