"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const { theme } = useTheme();

  // Widget IDs untuk light dan dark mode
  const LIGHT_WIDGET_ID = "004a0706-8a45-408b-89ba-a23be841cbc6"; // Widget untuk light mode
  const DARK_WIDGET_ID = "004a0706-8a45-408b-89ba-a23be841cbc6"; // Widget untuk dark mode (sama untuk sekarang)

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
    if (containerRef.current) {
      // Clear existing content
      containerRef.current.innerHTML = "";

      // Determine which widget to use based on theme
      const widgetId = theme === "dark" ? DARK_WIDGET_ID : LIGHT_WIDGET_ID;

      // Create the widget container
      const widgetContainer = document.createElement("div");
      widgetContainer.className = `elfsight-app-${widgetId}`;
      widgetContainer.setAttribute("data-elfsight-app-lazy", "");

      containerRef.current.appendChild(widgetContainer);

      // Initialize the widget
      if (window.Elfsight && window.Elfsight.init) {
        window.Elfsight.init();
      }
    }
  };

  // Re-initialize widget when theme changes
  useEffect(() => {
    if (scriptLoadedRef.current && containerRef.current) {
      // Small delay to ensure theme change is applied
      const timer = setTimeout(() => {
        initializeWidget();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [theme]);

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
            data-theme={theme}
            suppressHydrationWarning
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
    };
  }
}
