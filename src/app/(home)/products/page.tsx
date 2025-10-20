"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/home/product-grid";
import { ProductFilters } from "@/components/home/product-filters";
import { ProductSort } from "@/components/home/product-sort";

// Disable static generation untuk halaman yang menggunakan cart
export const dynamic = "force-dynamic";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryId: "",
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
    minPrice: 0,
    maxPrice: 1000000,
    inStock: undefined as boolean | undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Read query parameters from URL on component mount
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");

    setFilters((prev) => ({
      ...prev,
      categoryId: category || "",
      searchTerm: search || "",
      sortBy: sortBy || "name",
      sortOrder: (sortOrder as "asc" | "desc") || "asc",
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 1000000,
      inStock: inStock ? inStock === "true" : undefined,
    }));
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          className="mb-6 sm:mb-8"
          variants={headerVariants}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2 sm:mb-4">
            All Products
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find high-quality premium products from Kawane Studio
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          variants={contentVariants}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Sidebar Filters */}
          <aside className="lg:w-64 order-2 lg:order-1">
            <ProductFilters
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 order-1 lg:order-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Filtered Products
              </h2>
              <ProductSort
                onSortChange={(sortBy, sortOrder) =>
                  handleFilterChange({ sortBy, sortOrder })
                }
                currentSort={filters.sortBy}
                currentOrder={filters.sortOrder}
              />
            </div>
            <ProductGrid
              categoryId={filters.categoryId}
              searchTerm={filters.searchTerm}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              inStock={filters.inStock}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </main>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
