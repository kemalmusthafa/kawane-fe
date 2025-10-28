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

    // More specific selectors for cart icon detection - prioritize cart with badge
    const cartSelectors = [
      // Most reliable: cart with badge (shows item count)
      'a[data-testid="cart-icon"]:has(svg[class*="shopping-cart"]):has(.absolute)',
      'a[href*="/cart"]:has(svg[class*="shopping-cart"]):has(.absolute)',
      // Cart with relative positioning (badge container)
      'a[data-testid="cart-icon"]:has(svg[class*="shopping-cart"]):has(.relative)',
      'a[href*="/cart"]:has(svg[class*="shopping-cart"]):has(.relative)',
      // Fallback: any cart with data-testid
      'a[data-testid="cart-icon"][href="/cart"]:has(svg[class*="shopping-cart"])',
      'a[data-testid="cart-icon"][href*="/cart"]:has(svg[class*="shopping-cart"])',
      // Fallback: any cart with href
      'a[href="/cart"]:has(svg[class*="shopping-cart"])',
      'a[href*="/cart"]:has(svg[class*="shopping-cart"])',
      // Generic cart selectors
      'a:has(svg[class*="shopping-cart"]):has(.absolute)',
      'button:has(svg[class*="shopping-cart"]):has(.absolute)',
    ];

    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      console.log("🔍 DOM should be ready, proceeding with detection...");
    }, 0);

    console.log("🎯 Available selectors:", cartSelectors);

    let cartElement: Element | null = null;

    // First try specific selectors
    for (const selector of cartSelectors) {
      try {
        console.log(`🔍 Trying selector: ${selector}`);
        cartElement = document.querySelector(selector);
        console.log(`🔍 Found element:`, cartElement);
        if (cartElement) {
          // Additional validation: make sure it's actually a cart element
          const hasShoppingCartIcon = cartElement.querySelector(
            'svg[class*="shopping-cart"]'
          );
          const hasCartHref = cartElement
            .getAttribute("href")
            ?.includes("cart");
          const hasCartText =
            cartElement.textContent?.toLowerCase().includes("cart") ||
            cartElement.textContent?.toLowerCase().includes("keranjang");

          // Check if cart has badge (indicates it's the main cart with item count)
          const hasBadge = cartElement.querySelector(".absolute");
          const hasRelativeContainer = cartElement.querySelector(".relative");

          // Exclude theme toggle and other non-cart elements - more comprehensive check
          const isThemeToggle =
            cartElement.querySelector('svg[class*="sun"]') ||
            cartElement.querySelector('svg[class*="moon"]') ||
            cartElement.querySelector('svg[class*="theme"]') ||
            cartElement.closest("[data-theme-toggle]") ||
            cartElement.closest(".theme-toggle") ||
            cartElement.querySelector('button[class*="h-10 w-10"]') || // ThemeToggle specific class
            (cartElement.tagName === "BUTTON" &&
              cartElement.querySelector(
                'div[class*="relative w-[1.2rem] h-[1.2rem]"]'
              )); // ThemeToggle structure

          // Prioritize cart with badge (main cart with item count)
          const isMainCart = hasBadge || hasRelativeContainer;

          if (
            (hasShoppingCartIcon || hasCartHref || hasCartText) &&
            !isThemeToggle &&
            isMainCart
          ) {
            console.log("🎯 Found valid cart element with selector:", selector);
            console.log("🎯 Cart element details:", {
              tagName: cartElement.tagName,
              href: cartElement.getAttribute("href"),
              hasShoppingCartIcon: !!hasShoppingCartIcon,
              hasCartHref: !!hasCartHref,
              hasCartText: !!hasCartText,
              isThemeToggle: !!isThemeToggle,
              hasBadge: !!hasBadge,
              hasRelativeContainer: !!hasRelativeContainer,
              isMainCart: !!isMainCart,
            });
            break;
          } else {
            console.log("❌ Cart element validation failed:", {
              selector,
              hasShoppingCartIcon: !!hasShoppingCartIcon,
              hasCartHref: !!hasCartHref,
              hasCartText: !!hasCartText,
              isThemeToggle: !!isThemeToggle,
              hasBadge: !!hasBadge,
              hasRelativeContainer: !!hasRelativeContainer,
              isMainCart: !!isMainCart,
            });
            cartElement = null; // Reset if validation fails
          }
        }
      } catch (error) {
        // Skip invalid selectors
        continue;
      }
    }

    // If not found, try to find by icon content and structure
    if (!cartElement) {
      console.log(
        "🔍 No cart element found with selectors, trying content analysis..."
      );
      const allElements = document.querySelectorAll("button, a");
      console.log(
        `🔍 Found ${allElements.length} button/a elements to analyze`
      );

      // Log all elements with shopping cart icons
      const allShoppingCartElements = document.querySelectorAll(
        'svg[class*="shopping-cart"]'
      );
      console.log(
        `🔍 Found ${allShoppingCartElements.length} ShoppingCart SVG elements:`,
        allShoppingCartElements
      );

      for (const element of allElements) {
        // Check if element contains ShoppingCart icon
        const shoppingCartIcon = element.querySelector(
          'svg[class*="shopping-cart"]'
        );
        if (shoppingCartIcon) {
          // Additional check: make sure it's likely a cart button
          const hasBadge = element.querySelector(".absolute, .relative");
          const hasCartText =
            element.textContent?.toLowerCase().includes("cart") ||
            element.textContent?.toLowerCase().includes("keranjang");
          const hasCartHref = element.getAttribute("href")?.includes("cart");

          // Exclude theme toggle buttons and other non-cart elements - more comprehensive check
          const isThemeToggle =
            element.querySelector('svg[class*="sun"]') ||
            element.querySelector('svg[class*="moon"]') ||
            element.querySelector('svg[class*="theme"]') ||
            element.closest("[data-theme-toggle]") ||
            element.closest(".theme-toggle") ||
            element.querySelector('button[class*="h-10 w-10"]') || // ThemeToggle specific class
            (element.tagName === "BUTTON" &&
              element.querySelector(
                'div[class*="relative w-[1.2rem] h-[1.2rem]"]'
              )); // ThemeToggle structure
          const isUserButton =
            element.querySelector('svg[class*="user"]') ||
            element.querySelector('svg[class*="profile"]');
          const isHeartButton = element.querySelector('svg[class*="heart"]');

          console.log(`🔍 Analyzing element:`, {
            element,
            tagName: element.tagName,
            href: element.getAttribute("href"),
            className: element.className,
            hasShoppingCartIcon: !!shoppingCartIcon,
            hasBadge: !!hasBadge,
            hasCartText: !!hasCartText,
            hasCartHref: !!hasCartHref,
            isThemeToggle: !!isThemeToggle,
            isUserButton: !!isUserButton,
            isHeartButton: !!isHeartButton,
            innerHTML: element.innerHTML.substring(0, 100) + "...", // First 100 chars
          });

          if (
            (hasBadge || hasCartText || hasCartHref) &&
            !isThemeToggle &&
            !isUserButton &&
            !isHeartButton
          ) {
            cartElement = element;
            console.log("🎯 Found cart element by content analysis");
            console.log("🎯 Content analysis details:", {
              tagName: element.tagName,
              href: element.getAttribute("href"),
              hasBadge: !!hasBadge,
              hasCartText: !!hasCartText,
              hasCartHref: !!hasCartHref,
              isThemeToggle: !!isThemeToggle,
              isUserButton: !!isUserButton,
              isHeartButton: !!isHeartButton,
            });
            break;
          }
        }
      }
    }

    if (cartElement) {
      // Try to get the ShoppingCart SVG icon position for more accurate targeting
      const shoppingCartIcon = cartElement.querySelector(
        'svg[class*="shopping-cart"]'
      );
      let targetElement = cartElement;

      if (shoppingCartIcon) {
        targetElement = shoppingCartIcon as Element;
        console.log("🎯 Using ShoppingCart SVG icon for position calculation");
      } else {
        console.log("🎯 Using cart element wrapper for position calculation");
      }

      const rect = targetElement.getBoundingClientRect();

      // Add visual offset for SVG elements to account for stroke and visual center
      let visualOffsetX = 0;
      let visualOffsetY = 0;

      if (targetElement.tagName === "svg") {
        // SVG visual center adjustment - account for stroke width and visual appearance
        visualOffsetY = -2; // Move slightly up for better visual alignment
        visualOffsetX = 0; // Keep horizontal center
      } else if (
        targetElement.tagName === "a" ||
        targetElement.tagName === "button"
      ) {
        // For wrapper elements, try to find the SVG inside and adjust accordingly
        const svgInside = targetElement.querySelector("svg");
        if (svgInside) {
          visualOffsetY = -2; // Same adjustment for visual alignment
        }
      }

      const position = {
        x: rect.left + rect.width / 2 + visualOffsetX,
        y: rect.top + rect.height / 2 + visualOffsetY,
      };

      console.log(
        "🎯 Cart element found:",
        cartElement,
        "Target element:",
        targetElement,
        "Visual offset:",
        { visualOffsetX, visualOffsetY },
        "Position:",
        position
      );

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
        console.trace("🎯 Setting fallback cart position:", fallbackPosition);
        setCartPosition(fallbackPosition);
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCartPosition]);

  return { cartPosition, updateCartPosition };
};
