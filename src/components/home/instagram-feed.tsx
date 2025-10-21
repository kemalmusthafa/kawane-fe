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

    // Inject CSS for dark mode
    if (currentTheme === "dark") {
      injectDarkModeCSS();
    }

    // Find ALL elements inside the widget container
    const allElements = containerRef.current.querySelectorAll("*");
    
    allElements.forEach((element: any) => {
      if (currentTheme === "dark") {
        // Force dark background on ALL elements
        element.style.setProperty("background-color", "#000000", "important");
        element.style.setProperty("background", "#000000", "important");
        element.style.setProperty("color", "#ffffff", "important");
        
        // Override any existing styles
        element.style.backgroundColor = "#000000 !important";
        element.style.color = "#ffffff !important";
        
        // Handle specific widget elements
        if (element.classList.toString().includes("elfsight")) {
          element.style.setProperty("background-color", "#000000", "important");
          element.style.setProperty("color", "#ffffff", "important");
        }
        
        // Handle iframe elements
        if (element.tagName === "IFRAME") {
          element.style.setProperty("background-color", "#000000", "important");
        }
        
        // Handle div elements
        if (element.tagName === "DIV") {
          element.style.setProperty("background-color", "#000000", "important");
          element.style.setProperty("color", "#ffffff", "important");
        }
        
        // Handle text elements
        if (["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "A"].includes(element.tagName)) {
          element.style.setProperty("color", "#ffffff", "important");
        }
      } else {
        // Light mode
        element.style.setProperty("background-color", "#ffffff", "important");
        element.style.setProperty("color", "#000000", "important");
      }
    });

    // Also style the container itself
    if (containerRef.current) {
      if (currentTheme === "dark") {
        containerRef.current.style.setProperty("background-color", "#000000", "important");
        containerRef.current.style.setProperty("color", "#ffffff", "important");
      } else {
        containerRef.current.style.setProperty("background-color", "#ffffff", "important");
        containerRef.current.style.setProperty("color", "#000000", "important");
      }
    }
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

    // Also apply styling continuously every 2 seconds
    const interval = setInterval(() => {
      if (resolvedTheme === "dark") {
        applyDarkModeStyling();
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
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
