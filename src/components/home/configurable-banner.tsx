"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BannerConfig {
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
  priority: number;
}

export function ConfigurableBanner() {
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    text: "🚚 Free shipping on orders over $50! Limited time offer.",
    isActive: true,
    backgroundColor: "bg-primary",
    textColor: "text-primary-foreground",
    priority: 1,
  });

  useEffect(() => {
    // Load banner config from localStorage
    const savedConfig = localStorage.getItem("banner-config");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setBannerConfig(config);
      } catch (error) {
        console.error("Error parsing banner config:", error);
      }
    }
  }, []);

  // Don't render if banner is not active
  if (!bannerConfig.isActive) {
    return null;
  }

  const bannerContent = (
    <div
      className={`${bannerConfig.backgroundColor} ${bannerConfig.textColor} py-2`}
    >
      <div className="container mx-auto px-4 text-center text-sm">
        <p className="font-medium">
          {bannerConfig.text}
          {bannerConfig.linkUrl && bannerConfig.linkText && (
            <Link
              href={bannerConfig.linkUrl}
              className="ml-2 underline hover:no-underline transition-all duration-200"
            >
              {bannerConfig.linkText}
            </Link>
          )}
        </p>
      </div>
    </div>
  );

  return bannerContent;
}













