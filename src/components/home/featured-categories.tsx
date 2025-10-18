"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useApi";
import Link from "next/link";
import { Category } from "@/lib/api";
import Image from "next/image";

// Fallback gambar untuk kategori yang belum memiliki gambar
const getFallbackImage = (categoryName: string) => {
  const imageMap: { [key: string]: string } = {
    Accessories:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    Bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    Hoodie:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
    Pants:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    Shorts:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
    "T-Shirt":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    Electronics:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center",
    Fashion:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center",
    Home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center",
    Sports:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
    Books:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center",
    Beauty:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
  };

  return (
    imageMap[categoryName] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"
  );
};

// Get category image (prioritize database image, fallback to default)
const getCategoryImage = (category: any) => {
  return category.image || getFallbackImage(category.name);
};

export function FeaturedCategories() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collections across various categories
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-16 mx-auto" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-red-600">
              Gagal memuat kategori:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collections across various categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {categories?.slice(0, 6).map((category: Category, index: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products?category=${category.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full h-24 sm:h-28 lg:h-32 overflow-hidden">
                      <Image
                        src={getCategoryImage(category)}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div className="p-2 sm:p-3 lg:p-4 text-center">
                      <h3 className="text-sm sm:text-base font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {category._count?.products || 0} items
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
