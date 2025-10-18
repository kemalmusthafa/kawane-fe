"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";

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

  // Auto-slide functionality
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

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
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden group mb-8">
      {/* Main Carousel */}
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title || "Lookbook photo"}
                className="w-full h-full object-cover"
              />

              {/* Overlay with content - Better positioning */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-4 sm:left-6 md:left-8 lg:left-12 right-4 sm:right-6 md:right-8 lg:right-12">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="text-white"
                  >
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
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
