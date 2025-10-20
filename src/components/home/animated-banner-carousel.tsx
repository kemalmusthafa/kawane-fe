"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  duration?: number; // Duration in seconds for this banner
}

interface AnimatedBannerCarouselProps {
  banners: BannerConfig[];
  autoScrollInterval?: number; // Auto scroll interval in seconds
  scrollSpeed?: number; // Scroll speed in pixels per second
  scrollThreshold?: number; // Scroll threshold to stop animation
}

export function AnimatedBannerCarousel({
  banners,
  autoScrollInterval = 5,
  scrollSpeed = 30,
  scrollThreshold = 100,
}: AnimatedBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  // Filter active banners and sort by priority (lower number = higher priority)
  const activeBanners = banners
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.priority - b.priority);

  // Page scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsPageScrolled(scrollTop > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  // Auto scroll to next banner (only when not scrolled)
  useEffect(() => {
    if (activeBanners.length <= 1 || isPageScrolled) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, autoScrollInterval * 1000);

    return () => clearInterval(interval);
  }, [activeBanners.length, autoScrollInterval, isPageScrolled]);

  // Don't render if no active banners
  if (activeBanners.length === 0) {
    return null;
  }

  // If only one banner, render it without carousel
  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    return (
      <div
        className={`${banner.backgroundColor} ${banner.textColor} py-1.5 sm:py-2`}
      >
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm">
          <p className="font-medium leading-tight">
            {banner.text}
            {banner.linkUrl && banner.linkText && (
              <Link
                href={banner.linkUrl}
                className="ml-1 sm:ml-2 underline hover:no-underline transition-all duration-200 text-xs sm:text-sm"
              >
                {banner.linkText}
              </Link>
            )}
          </p>
        </div>
      </div>
    );
  }

  // If page is scrolled, show static banner (no carousel animation)
  if (isPageScrolled) {
    const banner = activeBanners[currentIndex];
    return (
      <div
        className={`${banner.backgroundColor} ${banner.textColor} py-1.5 sm:py-2`}
      >
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm">
          <p className="font-medium leading-tight">
            {banner.text}
            {banner.linkUrl && banner.linkText && (
              <Link
                href={banner.linkUrl}
                className="ml-1 sm:ml-2 underline hover:no-underline transition-all duration-200 text-xs sm:text-sm"
              >
                {banner.linkText}
              </Link>
            )}
          </p>
        </div>
      </div>
    );
  }

  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="relative overflow-hidden">
      {/* Main Banner Display */}
      <div
        className={`${currentBanner.backgroundColor} ${currentBanner.textColor} py-1.5 sm:py-2`}
      >
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm relative">
          <p className="font-medium leading-tight">
            {currentBanner.text}
            {currentBanner.linkUrl && currentBanner.linkText && (
              <Link
                href={currentBanner.linkUrl}
                className="ml-1 sm:ml-2 underline hover:no-underline transition-all duration-200 text-xs sm:text-sm"
              >
                {currentBanner.linkText}
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
