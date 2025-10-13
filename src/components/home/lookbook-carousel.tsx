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
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] overflow-hidden group mb-0">
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

              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-12 xl:p-16">
                  <motion.div
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="text-white"
                  >
                    {photo.title && (
                      <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-4">
                        {photo.title}
                      </h3>
                    )}
                    {photo.description && (
                      <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl opacity-90 max-w-3xl md:max-w-4xl">
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
    </div>
  );
}
