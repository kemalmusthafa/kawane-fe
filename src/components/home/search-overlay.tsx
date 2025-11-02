"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { Product } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Use direct fetch to bypass any caching issues
      const response = await fetch(
        `https://kawane-be.vercel.app/api/products?search=${encodeURIComponent(
          query
        )}&page=1&limit=8&t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      const products = data.data?.products || [];
      setSearchResults(products);
    } catch (error) {
      console.error("Mobile search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center pt-12 sm:pt-16 lg:pt-20 px-3 sm:px-4">
        <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Search Products
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-0 border-b-2 border-gray-300 focus:border-gray-500 focus:ring-0 rounded-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:border-gray-400"
              />
            </div>
          </form>

          {/* Search Results */}
          {(searchTerm.trim() || hasSearched) && (
            <div className="max-h-80 overflow-y-auto">
              {isLoading && (
                <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-gray-400 mx-auto mb-2 sm:mb-3"></div>
                  <p className="text-xs sm:text-sm">Searching...</p>
                </div>
              )}

              {!isLoading &&
                hasSearched &&
                searchResults.length === 0 &&
                searchTerm && (
                  <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-xs sm:text-sm">
                      No products found for "{searchTerm}"
                    </p>
                  </div>
                )}

              {!isLoading && searchResults.length > 0 && (
                <div className="p-3 sm:p-4">
                  <div className="space-y-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                            {product.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                            {product.description}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {searchResults.length >= 8 && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs sm:text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-1.5 sm:py-2"
                        onClick={() => {
                          onClose();
                          router.push(
                            `/products?search=${encodeURIComponent(searchTerm)}`
                          );
                        }}
                      >
                        View All Results for "{searchTerm}"
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
