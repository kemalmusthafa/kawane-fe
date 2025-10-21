"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const widgetInstanceRef = useRef<any>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Widget ID yang sama untuk light dan dark mode
  const WIDGET_ID = "c8fd5002-bb9d-4039-a80f-3b119ac14fe8";

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Load Elfsight script only once
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeWidget();
      };
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }
  }, []);

  const initializeWidget = () => {
    if (!mounted || !containerRef.current) return;

    // Clear existing content completely
    containerRef.current.innerHTML = "";

    // Create the widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.className = `elfsight-app-${WIDGET_ID}`;
    widgetContainer.setAttribute("data-elfsight-app-lazy", "");
    
    // Add theme-specific attributes
    widgetContainer.setAttribute("data-theme", resolvedTheme || theme || "light");
    
    // Add CSS custom properties for theme
    widgetContainer.style.setProperty("--theme-mode", resolvedTheme || theme || "light");
    
    containerRef.current.appendChild(widgetContainer);

    // Force re-initialization with theme
    if (window.Elfsight && window.Elfsight.init) {
      // Destroy existing instance if any
      if (widgetInstanceRef.current) {
        try {
          widgetInstanceRef.current.destroy?.();
        } catch (e) {
          console.log("Widget destroy failed:", e);
        }
      }
      
      // Initialize new instance
      setTimeout(() => {
        window.Elfsight.init();
        widgetInstanceRef.current = window.Elfsight;
      }, 100);
    }
  };

  // Re-initialize widget when theme changes
  useEffect(() => {
    if (mounted && scriptLoadedRef.current && containerRef.current) {
      // Longer delay to ensure theme change is fully applied
      const timer = setTimeout(() => {
        initializeWidget();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [theme, resolvedTheme, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
              Social Media
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay updated with our latest products, behind-the-scenes content,
              and customer stories
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
            Social Media
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest products, behind-the-scenes content,
            and customer stories
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div
            ref={containerRef}
            className="instagram-feed-container"
            data-theme={resolvedTheme || theme}
            suppressHydrationWarning
            style={{
              // Force theme inheritance
              colorScheme: resolvedTheme === "dark" ? "dark" : "light",
            }}
          >
            {/* Widget will be inserted here */}
          </div>
        </div>
      </div>
    </section>
  );
}

// Extend Window interface for Elfsight
declare global {
  interface Window {
    Elfsight: {
      init: () => void;
      destroy?: () => void;
    };
  }
}
