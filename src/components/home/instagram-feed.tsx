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

  // Re-apply styling when theme changes
  useEffect(() => {
    if (mounted && scriptLoaded && containerRef.current) {
      // Small delay to ensure widget is loaded
      setTimeout(() => {
        applyThemeStyling();
      }, 300);
    }
  }, [mounted, scriptLoaded, resolvedTheme, theme]);

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
        // Apply theme styling after widget loads
        applyThemeStyling();
      }, 200);
    }
  };

  // Apply theme styling to widget
  const applyThemeStyling = () => {
    if (!containerRef.current) return;

    const currentTheme = resolvedTheme || theme || "light";

    // Inject CSS for both dark and light mode
    if (currentTheme === "dark") {
      injectDarkModeCSS();
    } else {
      injectLightModeCSS();
    }
  };

  // Inject CSS for light mode
  const injectLightModeCSS = () => {
    // Check if CSS already injected
    const existingStyle = document.getElementById("elfsight-light-mode-css");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "elfsight-light-mode-css";
    style.textContent = `
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 *,
      [class*="elfsight"] *,
      [class*="elfsight"] {
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 iframe,
      [class*="elfsight"] iframe {
        background-color: #ffffff !important;
        background: #ffffff !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 div,
      [class*="elfsight"] div {
        background-color: #ffffff !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 p,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 span,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h1,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h2,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h3,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h4,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h5,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h6,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 a,
      [class*="elfsight"] p,
      [class*="elfsight"] span,
      [class*="elfsight"] h1,
      [class*="elfsight"] h2,
      [class*="elfsight"] h3,
      [class*="elfsight"] h4,
      [class*="elfsight"] h5,
      [class*="elfsight"] h6,
      [class*="elfsight"] a {
        color: #000000 !important;
      }
      
      /* Ensure widget is visible in light mode */
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8,
      [class*="elfsight"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Inject CSS for dark mode
  const injectDarkModeCSS = () => {
    // Check if CSS already injected
    const existingStyle = document.getElementById("elfsight-dark-mode-css");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "elfsight-dark-mode-css";
    style.textContent = `
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 *,
      [class*="elfsight"] *,
      [class*="elfsight"] {
        background-color: #000000 !important;
        background: #000000 !important;
        color: #ffffff !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 iframe,
      [class*="elfsight"] iframe {
        background-color: #000000 !important;
        background: #000000 !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 div,
      [class*="elfsight"] div {
        background-color: #000000 !important;
        background: #000000 !important;
        color: #ffffff !important;
      }
      
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 p,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 span,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h1,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h2,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h3,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h4,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h5,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 h6,
      .elfsight-app-c8fd5002-bb9d-4039-a80f-3b119ac14fe8 a,
      [class*="elfsight"] p,
      [class*="elfsight"] span,
      [class*="elfsight"] h1,
      [class*="elfsight"] h2,
      [class*="elfsight"] h3,
      [class*="elfsight"] h4,
      [class*="elfsight"] h5,
      [class*="elfsight"] h6,
      [class*="elfsight"] a {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  };

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
                Loading Instagram feed...
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
              // Force theme styling
              ...(resolvedTheme === "dark" && {
                backgroundColor: "#000000",
                color: "#ffffff",
              }),
              ...(resolvedTheme === "light" && {
                backgroundColor: "#ffffff",
                color: "#000000",
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