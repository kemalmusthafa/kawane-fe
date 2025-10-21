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
      const existingScript = document.querySelector(
        'script[src="https://elfsightcdn.com/platform.js"]'
      );
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
        // Apply dark mode styling after widget loads
        applyDarkModeStyling();
      }, 200);
    }
  };

  // Apply dark mode styling to widget
  const applyDarkModeStyling = () => {
    if (!containerRef.current) return;

    const currentTheme = resolvedTheme || theme || "light";
    
    // Find all Elfsight widget elements
    const widgetElements = containerRef.current.querySelectorAll('[class*="elfsight"]');
    
    widgetElements.forEach((element: any) => {
      if (currentTheme === "dark") {
        // Apply dark mode styles
        element.style.setProperty("--elfsight-bg-color", "#000000", "important");
        element.style.setProperty("--elfsight-text-color", "#ffffff", "important");
        element.style.setProperty("--elfsight-border-color", "#333333", "important");
        
        // Force dark background
        element.style.backgroundColor = "#000000";
        element.style.color = "#ffffff";
        
        // Find and style specific widget components
        const profileCard = element.querySelector('[class*="profile"]') || element.querySelector('[class*="header"]');
        if (profileCard) {
          profileCard.style.backgroundColor = "#000000";
          profileCard.style.color = "#ffffff";
        }
        
        const postsGrid = element.querySelector('[class*="posts"]') || element.querySelector('[class*="grid"]');
        if (postsGrid) {
          postsGrid.style.backgroundColor = "#000000";
        }
        
        // Style all text elements
        const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        textElements.forEach((textEl: any) => {
          if (textEl.style.color !== "rgb(255, 255, 255)") {
            textEl.style.color = "#ffffff";
          }
        });
      } else {
        // Apply light mode styles
        element.style.setProperty("--elfsight-bg-color", "#ffffff", "important");
        element.style.setProperty("--elfsight-text-color", "#000000", "important");
        element.style.setProperty("--elfsight-border-color", "#e5e5e5", "important");
        
        element.style.backgroundColor = "#ffffff";
        element.style.color = "#000000";
      }
    });
  };

  // Re-initialize widget when theme changes
  useEffect(() => {
    if (mounted && scriptLoaded && containerRef.current) {
      const timer = setTimeout(() => {
        initializeWidget();
        // Also apply styling after theme change
        setTimeout(() => {
          applyDarkModeStyling();
        }, 1000);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [theme, resolvedTheme, mounted, scriptLoaded]);

  // Monitor widget changes and apply styling
  useEffect(() => {
    if (!mounted || !scriptLoaded) return;

    const observer = new MutationObserver(() => {
      // Apply styling when widget content changes
      setTimeout(() => {
        applyDarkModeStyling();
      }, 100);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
  }, [mounted, scriptLoaded, theme, resolvedTheme]);

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
              <div className="animate-pulse text-muted-foreground">
                Loading...
              </div>
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
            style={{
              // Force dark mode styling
              ...(resolvedTheme === "dark" && {
                backgroundColor: "#000000",
                color: "#ffffff",
              }),
            }}
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
