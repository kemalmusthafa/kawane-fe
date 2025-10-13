"use client";

import { useState, useEffect } from "react";

interface BannerConfig {
  id: string;
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
  dealId?: string;
  priority: number;
  duration?: number;
}

export function useBanners() {
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [autoScrollInterval, setAutoScrollInterval] = useState(5);
  const [scrollThreshold, setScrollThreshold] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const loadBanners = () => {
    // Load banners from localStorage
    const savedBanners = localStorage.getItem("multiple-banners");
    const savedInterval = localStorage.getItem("banner-auto-scroll-interval");
    const savedThreshold = localStorage.getItem("banner-scroll-threshold");

    if (savedBanners) {
      try {
        setBanners(JSON.parse(savedBanners));
      } catch (error) {
        console.error("Error parsing banners:", error);
        // Fallback to default banner
        setBanners([
          {
            id: "1",
            text: "🚚 Free shipping on orders over $50! Limited time offer.",
            isActive: true,
            backgroundColor: "bg-primary",
            textColor: "text-primary-foreground",
            priority: 1,
            duration: 5,
          },
        ]);
      }
    } else {
      // Default banner if none saved
      setBanners([
        {
          id: "1",
          text: "🚚 Free shipping on orders over $50! Limited time offer.",
          isActive: true,
          backgroundColor: "bg-primary",
          textColor: "text-primary-foreground",
          priority: 1,
          duration: 5,
        },
      ]);
    }

    if (savedInterval) {
      setAutoScrollInterval(parseInt(savedInterval));
    }

    if (savedThreshold) {
      setScrollThreshold(parseInt(savedThreshold));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadBanners();

    // Listen for storage changes (when admin updates banners)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "multiple-banners" ||
        e.key === "banner-auto-scroll-interval" ||
        e.key === "banner-scroll-threshold"
      ) {
        loadBanners();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events for same-tab updates
    const handleCustomStorageChange = () => {
      loadBanners();
    };

    window.addEventListener("bannerUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bannerUpdated", handleCustomStorageChange);
    };
  }, []);

  return {
    banners,
    autoScrollInterval,
    scrollThreshold,
    isLoading,
  };
}
