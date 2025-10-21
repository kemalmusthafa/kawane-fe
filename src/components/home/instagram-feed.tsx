"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Widget ID
  const WIDGET_ID = "c8fd5002-bb9d-4039-a80f-3b119ac14fe8";

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load Elfsight script
    const loadScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (existingScript) {
        setScriptLoaded(true);
        initializeWidget();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        initializeWidget();
      };
      script.onerror = () => {
        console.error("Failed to load Elfsight script");
      };
      document.head.appendChild(script);
    };

    loadScript();
  }, [mounted]);

  const initializeWidget = () => {
    if (!mounted || !containerRef.current || !scriptLoaded) return;

    // Clear existing content
    containerRef.current.innerHTML = "";

    // Create the widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.className = `elfsight-app-${WIDGET_ID}`;
    widgetContainer.setAttribute("data-elfsight-app-lazy", "");
    
    // Add theme information
    const currentTheme = resolvedTheme || theme || "light";
    widgetContainer.setAttribute("data-theme", currentTheme);
    
    containerRef.current.appendChild(widgetContainer);

    // Initialize the widget
    if (window.Elfsight && window.Elfsight.init) {
      setTimeout(() => {
        window.Elfsight.init();
      }, 200);
    }
  };

  // Re-initialize widget when theme changes
  useEffect(() => {
    if (mounted && scriptLoaded && containerRef.current) {
      const timer = setTimeout(() => {
        initializeWidget();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [theme, resolvedTheme, mounted, scriptLoaded]);

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
            className="instagram-feed-container min-h-[400px]"
            data-theme={resolvedTheme || theme}
            suppressHydrationWarning
          >
            {!scriptLoaded && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-muted-foreground">
                  Loading Instagram feed...
                </div>
              </div>
            )}
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