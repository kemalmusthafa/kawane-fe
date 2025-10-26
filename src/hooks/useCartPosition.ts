"use client";

import { useState, useEffect, useCallback } from "react";

interface CartPosition {
  x: number;
  y: number;
}

export const useCartPosition = () => {
  const [cartPosition, setCartPosition] = useState<CartPosition>({
    x: 0,
    y: 0,
  });

  const updateCartPosition = useCallback(() => {
    // More specific selectors for cart icon detection
    const cartSelectors = [
      // Specific cart button with ShoppingCart icon
      'button:has(svg[class*="shopping-cart"])',
      'a:has(svg[class*="shopping-cart"])',
      // Cart button with relative positioning (for badge)
      'button:has(.relative):has(svg[class*="shopping-cart"])',
      'a:has(.relative):has(svg[class*="shopping-cart"])',
      // Cart button with badge
      'button:has(.absolute):has(svg[class*="shopping-cart"])',
      'a:has(.absolute):has(svg[class*="shopping-cart"])',
      // Generic cart selectors
      '[data-testid="cart-icon"]',
      '[aria-label*="cart" i]',
      '[aria-label*="keranjang" i]',
      'button[class*="cart"]',
      'a[href*="cart"]',
      // SVG patterns
      'svg[class*="shopping-cart"]',
      'svg[class*="cart"]',
      // Class patterns
      '.cart-icon',
      '#cart-icon',
    ];

    let cartElement: Element | null = null;

    // First try specific selectors
    for (const selector of cartSelectors) {
      try {
        cartElement = document.querySelector(selector);
        if (cartElement) {
          break;
        }
      } catch (error) {
        // Skip invalid selectors
        continue;
      }
    }

    // If not found, try to find by icon content and structure
    if (!cartElement) {
      const allElements = document.querySelectorAll('button, a');
      for (const element of allElements) {
        // Check if element contains ShoppingCart icon
        const shoppingCartIcon = element.querySelector('svg[class*="shopping-cart"]');
        if (shoppingCartIcon) {
          // Additional check: make sure it's likely a cart button
          const hasBadge = element.querySelector('.absolute, .relative');
          const hasCartText = element.textContent?.toLowerCase().includes('cart') || 
                             element.textContent?.toLowerCase().includes('keranjang');
          const hasCartHref = element.getAttribute('href')?.includes('cart');
          
          if (hasBadge || hasCartText || hasCartHref) {
            cartElement = element;
            break;
          }
        }
      }
    }

    if (cartElement) {
      const rect = cartElement.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setCartPosition(position);
    } else {
      // Fallback position (top-right corner)
      const fallbackPosition = {
        x: window.innerWidth - 60,
        y: 60,
      };
      setCartPosition(fallbackPosition);
    }
  }, []);

  useEffect(() => {
    // Update position on mount
    updateCartPosition();

    // Update position on window resize
    const handleResize = () => {
      setTimeout(updateCartPosition, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCartPosition]);

  return { cartPosition, updateCartPosition };
};
