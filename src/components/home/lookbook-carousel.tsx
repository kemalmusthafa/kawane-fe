"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api";
import Image from "next/image";

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

  // Preload images for smoother transitions
  const preloadImages = useCallback((imageUrls: string[]) => {
    imageUrls.forEach((url) => {
      if (!imagesLoaded.has(url)) {
        const img = new window.Image();
        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, url]));
        };
        img.src = url;
      }
    });
  }, [imagesLoaded]);

  // Fetch photos
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/lookbook?isActive=true");
      if (response.success) {
        const activePhotos = response.data.sort(
          (a: LookbookPhoto, b: LookbookPhoto) => a.order - b.order
        );
        setPhotos(activePhotos);
        // Preload all images
        preloadImages(activePhotos.map((photo: LookbookPhoto) => photo.imageUrl));
      }
    } catch (error) {
      console.error("Error fetching lookbook photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Optimized auto-slide functionality
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000); // Increased to 5 seconds for better mobile experience

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
      setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Memuat lookbook...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return null; // Don't render if no photos
  }

  return (
    <div 
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Carousel */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full h-full flex-shrink-0 relative"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother mobile
              opacity: { duration: 0.4 }
            }}
          >
            <Image
              src={photos[currentIndex].imageUrl}
              alt={photos[currentIndex].title || "Lookbook photo"}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />

            {/* Overlay with content - Better positioning */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  className="text-white"
                >
                  {photos[currentIndex].title && (
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                      {photos[currentIndex].title}
                    </h3>
                  )}
                  {photos[currentIndex].description && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-90 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl leading-relaxed">
                      {photos[currentIndex].description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
  );
}
