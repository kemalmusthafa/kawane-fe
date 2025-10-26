"use client";

import { useState, useEffect, useCallback } from "react";

interface CartPosition {
  x: number;
  y: number;
}

export const useCartPosition = () => {
  const [cartPosition, setCartPosition] = useState<CartPosition>({ x: 0, y: 0 });

  const updateCartPosition = useCallback(() => {
    // Try to find cart icon in different possible locations
    const cartSelectors = [
      '[data-testid="cart-icon"]',
      '[aria-label*="cart" i]',
      '[aria-label*="keranjang" i]',
      'button[class*="cart"]',
      'a[href*="cart"]',
      // Common cart icon patterns
      'svg[class*="shopping-cart"]',
      'button:has(svg[class*="shopping-cart"])',
      // Fallback to any element with cart-related classes
      '.cart-icon',
      '#cart-icon',
    ];

    let cartElement: Element | null = null;

    for (const selector of cartSelectors) {
      cartElement = document.querySelector(selector);
      if (cartElement) break;
    }

    // If not found, try to find by icon content
    if (!cartElement) {
      const allElements = document.querySelectorAll('button, a, div');
      for (const element of allElements) {
        if (
          element.textContent?.toLowerCase().includes('cart') ||
          element.textContent?.toLowerCase().includes('keranjang') ||
          element.querySelector('svg[class*="shopping-cart"]') ||
          element.querySelector('svg[class*="cart"]')
        ) {
          cartElement = element;
          break;
        }
      }
    }

    if (cartElement) {
      const rect = cartElement.getBoundingClientRect();
      setCartPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Fallback position (top-right corner)
      setCartPosition({
        x: window.innerWidth - 60,
        y: 60,
      });
    }
  }, []);

  useEffect(() => {
    // Update position on mount
    updateCartPosition();

    // Update position on window resize
    const handleResize = () => {
      setTimeout(updateCartPosition, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCartPosition]);

  return { cartPosition, updateCartPosition };
};
