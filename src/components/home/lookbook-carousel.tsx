"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface LookbookPhoto {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function LookbookCarousel() {
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const imagesLoadedRef = useRef<Set<string>>(new Set());

  // Preload images for smoother transitions
  const preloadImages = useCallback((imageUrls: string[]) => {
    imageUrls.forEach((url) => {
      if (!imagesLoadedRef.current.has(url)) {
        const img = new window.Image();
        img.onload = () => {
          imagesLoadedRef.current.add(url);
          setImagesLoaded(new Set(imagesLoadedRef.current));
        };
        img.src = url;
      }
    });
  }, []);

  // Fetch photos
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/lookbook?isActive=true");
      if (response.success) {
        const activePhotos = response.data.sort(
          (a: LookbookPhoto, b: LookbookPhoto) => a.order - b.order
        );
        setPhotos(activePhotos);
        // Preload all images
        preloadImages(
          activePhotos.map((photo: LookbookPhoto) => photo.imageUrl)
        );
      }
    } catch (error) {
      console.error("Error fetching lookbook photos:", error);
    } finally {
      setLoading(false);
    }
  }, [preloadImages]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Auto-slide dengan interval lebih lambat (tidak terlalu cepat)
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 7000); // 7 detik agar tidak terlalu cepat pindah

    return () => clearInterval(interval);
  }, [photos.length]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && photos.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
    if (isRightSwipe && photos.length > 1) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg"></div>
    );
  }

  if (photos.length === 0) {
    return null; // Don't render if no photos
  }

  return (
    <Card className="rounded-none border-0 bg-transparent shadow-none backdrop-blur-none">
      <CardContent className="p-0">
    <div
      className="relative w-full aspect-[16/9] sm:aspect-[5/3] md:aspect-auto md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden group rounded-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Carousel - slide horizontal, translate berdasarkan % dari container slide */}
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          className="flex h-full"
          animate={{
            x: `-${currentIndex * (100 / photos.length)}%`,
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.6,
          }}
          style={{
            width: `${photos.length * 100}%`,
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative flex-shrink-0 h-full"
              style={{ width: `${100 / photos.length}%` }}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title || "Lookbook photo"}
                fill
                className="object-contain w-full h-full"
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />

              {/* Overlay with content - hanya untuk slide aktif */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent hidden md:block">
                  <div className="absolute bottom-4 sm:bottom-6 md:bottom-12 lg:bottom-16 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <div className="hidden md:block text-white">
                        {photo.title && (
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                            {photo.title}
                          </h3>
                        )}
                        {photo.description && (
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-90 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl leading-relaxed">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
      </CardContent>
    </Card>
  );
}
