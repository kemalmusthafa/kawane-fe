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
    console.log("🔍 Starting cart position detection...");

    // SIMPLIFIED: Use multiple fallback selectors without :has()
    const cartSelectors = [
      'a[data-testid="cart-icon"][href="/cart"]', // Most specific
      'a[href="/cart"]', // Fallback
      'a[href*="/cart"]', // More general fallback
    ];

    console.log("🎯 Using selectors:", cartSelectors);

    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      console.log("🔍 DOM should be ready, proceeding with detection...");

      let cartElement: Element | null = null;

      // Try each selector until we find one
      for (const selector of cartSelectors) {
        try {
          console.log(`🔍 Trying selector: ${selector}`);
          cartElement = document.querySelector(selector);
          console.log(`🔍 Found element with selector ${selector}:`, cartElement);
          
          if (cartElement) {
            // Verify this element has a shopping cart icon
            const hasShoppingCartIcon = cartElement.querySelector('svg[class*="shopping-cart"]');
            if (hasShoppingCartIcon) {
              console.log(`✅ Found valid cart element with selector: ${selector}`);
              break;
            } else {
              console.log(`❌ Element found but no shopping cart icon, trying next selector`);
              cartElement = null;
            }
          }
        } catch (error) {
          console.log(`❌ Error with selector ${selector}:`, error);
          cartElement = null;
        }
      }

      if (cartElement) {
        // CRITICAL: Verify this is NOT a theme toggle
        const hasSunIcon = cartElement.querySelector('svg[class*="sun"]');
        const hasMoonIcon = cartElement.querySelector('svg[class*="moon"]');
        const isThemeToggleComponent =
          cartElement.closest("[data-theme-toggle]") ||
          cartElement.closest(".theme-toggle");

        if (hasSunIcon || hasMoonIcon || isThemeToggleComponent) {
          console.log(
            "❌ REJECTED: Element contains sun/moon icon or is theme toggle component"
          );
          cartElement = null;
        } else {
          console.log("✅ VALIDATED: Element is confirmed as cart icon");
        }
      }

      if (cartElement) {
        // Get the ShoppingCart SVG icon position for accurate targeting
        const shoppingCartIcon = cartElement.querySelector(
          'svg[class*="shopping-cart"]'
        );
        let targetElement = cartElement;

        if (shoppingCartIcon) {
          targetElement = shoppingCartIcon as Element;
          console.log(
            "🎯 Using ShoppingCart SVG icon for position calculation"
          );
        } else {
          console.log(
            "🎯 Using cart element wrapper for position calculation"
          );
        }

        const rect = targetElement.getBoundingClientRect();

        // Add visual offset for SVG elements
        let visualOffsetX = 0;
        let visualOffsetY = 0;

        if (targetElement.tagName === "svg") {
          visualOffsetY = -2; // Move slightly up for better visual alignment
          visualOffsetX = 0; // Keep horizontal center
        } else if (
          targetElement.tagName === "a" ||
          targetElement.tagName === "button"
        ) {
          const svgInside = targetElement.querySelector("svg");
          if (svgInside) {
            visualOffsetY = -2; // Same adjustment for visual alignment
          }
        }

        const position = {
          x: rect.left + rect.width / 2 + visualOffsetX,
          y: rect.top + rect.height / 2 + visualOffsetY,
        };

        console.log("🎯 Cart element found:", cartElement);
        console.log("🎯 Target element:", targetElement);
        console.log("🎯 Visual offset:", { visualOffsetX, visualOffsetY });
        console.log("🎯 Position:", position);

        // Use requestAnimationFrame to ensure position is set after DOM updates
        requestAnimationFrame(() => {
          console.trace("🎯 Setting cart position:", position);
          setCartPosition(position);
        });
      } else {
        // Fallback position (top-right corner)
        const fallbackPosition = {
          x: window.innerWidth - 60,
          y: 60,
        };
        console.log(
          "⚠️ Cart element not found, using fallback:",
          fallbackPosition
        );

        // Use requestAnimationFrame for fallback too
        requestAnimationFrame(() => {
          console.trace(
            "🎯 Setting fallback cart position:",
            fallbackPosition
          );
          setCartPosition(fallbackPosition);
        });
      }
    }, 0); // Delay for DOM readiness
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