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
    text: "",
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
      className={`${bannerConfig.backgroundColor} ${bannerConfig.textColor} py-1 sm:py-1.5 lg:py-2 min-h-[24px] sm:min-h-[28px] lg:min-h-[32px]`}
    >
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 text-center text-[10px] sm:text-xs lg:text-sm">
        <p className="font-medium leading-tight min-h-[16px] sm:min-h-[18px] lg:min-h-[20px]">
          {bannerConfig.text}
          {bannerConfig.linkUrl && bannerConfig.linkText && (
            <Link
              href={bannerConfig.linkUrl}
              className="ml-1 sm:ml-2 underline hover:no-underline transition-all duration-200 text-[10px] sm:text-xs lg:text-sm"
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
