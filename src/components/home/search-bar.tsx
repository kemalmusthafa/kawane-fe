"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Package, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useApi";
import { useCategories } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products and categories based on search query
  const { products, isLoading: productsLoading } = useProducts({
    search: debouncedQuery,
    limit: 5,
  });

  const { categories, isLoading: categoriesLoading } = useCategories();

  // Filter categories based on search query
  const filteredCategories =
    categories
      ?.filter((category: Category) =>
        category.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      .slice(0, 3) || [];

  // Combine all suggestions
  const allSuggestions = [
    ...(products || []).map((product: Product) => ({
      type: "product" as const,
      id: product.id,
      name: product.name,
      data: product,
    })),
    ...(filteredCategories || []).map((category: Category) => ({
      type: "category" as const,
      id: category.id,
      name: category.name,
      data: category,
    })),
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          handleSuggestionClick(allSuggestions[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === "product") {
      router.push(`/products/${suggestion.id}`);
    } else if (suggestion.type === "category") {
      router.push(`/products?category=${suggestion.id}`);
    }
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
      setSelectedIndex(-1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
        <Input
          ref={inputRef}
          placeholder="Search products, categories, or brands..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8"
            onClick={clearSearch}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && debouncedQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 sm:max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 sm:p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <span className="text-xs sm:text-sm">Searching...</span>
              </div>
            ) : allSuggestions.length > 0 ? (
              <div className="py-2">
                {/* Products Section */}
                {products && products.length > 0 && (
                  <div className="px-2 sm:px-3 py-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                      Products
                    </div>
                    {products.map((product: Product, index: number) => {
                      const suggestionIndex = allSuggestions.findIndex(
                        (s) => s.type === "product" && s.id === product.id
                      );
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 sm:gap-3 ${
                              selectedIndex === suggestionIndex
                                ? "bg-gray-50 dark:bg-gray-800"
                                : ""
                            }`}
                            onClick={() =>
                              handleSuggestionClick({
                                type: "product",
                                id: product.id,
                                name: product.name,
                                data: product,
                              })
                            }
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs sm:text-sm truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Rp {product.price.toLocaleString()}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Categories Section */}
                {filteredCategories && filteredCategories.length > 0 && (
                  <div className="px-2 sm:px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                      Categories
                    </div>
                    {filteredCategories.map(
                      (category: Category, index: number) => {
                        const suggestionIndex = allSuggestions.findIndex(
                          (s) => s.type === "category" && s.id === category.id
                        );
                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay:
                                (products?.length || 0) * 0.05 + index * 0.05,
                            }}
                          >
                            <button
                              className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 sm:gap-3 ${
                                selectedIndex === suggestionIndex
                                  ? "bg-gray-50 dark:bg-gray-800"
                                  : ""
                              }`}
                              onClick={() =>
                                handleSuggestionClick({
                                  type: "category",
                                  id: category.id,
                                  name: category.name,
                                  data: category,
                                })
                              }
                            >
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded flex items-center justify-center">
                                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs sm:text-sm truncate">
                                  {category.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {category._count?.products || 0} items
                                </div>
                              </div>
                            </button>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Search All Results */}
                <div className="px-2 sm:px-3 py-2 border-t">
                  <button
                    className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm text-primary font-medium"
                    onClick={handleSearch}
                  >
                    Search for "{debouncedQuery}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-4 text-center text-muted-foreground">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                <div className="text-xs sm:text-sm">No results found</div>
                <div className="text-xs">Try a different search term</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
