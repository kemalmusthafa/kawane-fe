"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { apiClient, Product } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

export function AlmzvSearchBar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search activation
  const handleSearchClick = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle search deactivation
  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearchClose();
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle search results
  useEffect(() => {
    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      try {
        console.log("🔍 AlmzvSearchBar: Searching for:", query);
        const response = await apiClient.getProducts({
          search: query,
          page: 1,
          limit: 5, // Limit results for dropdown display
        });
        
        console.log("🔍 AlmzvSearchBar: Full API Response:", response);
        console.log("🔍 AlmzvSearchBar: Response success:", response.success);
        console.log("🔍 AlmzvSearchBar: Response data:", response.data);
        console.log("🔍 AlmzvSearchBar: Products array:", response.data?.data?.products);
        
        const products = response.data?.data?.products || [];
        console.log("🔍 AlmzvSearchBar: Products found:", products.length);
        setSearchResults(products);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [debouncedSearchTerm]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleSearchClose();
      }
    };

    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchActive) {
        handleSearchClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchActive]);

  return (
    <div ref={containerRef} className="relative w-full">
      {!isSearchActive ? (
        // Inactive state - Show "SEARCH" text
        <button
          onClick={handleSearchClick}
          className="flex items-center justify-between w-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 border-b border-muted-foreground/30 hover:border-foreground/50"
        >
          <span className="text-sm font-medium uppercase tracking-wider">
            SEARCH
          </span>
          <Search className="h-4 w-4 flex-shrink-0" />
        </button>
      ) : (
        // Active state - Show search input with results
        <div className="relative w-full">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center justify-between border-b border-foreground/50 pr-3">
              <Input
                ref={inputRef}
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 rounded-none px-0 py-2 text-sm bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground flex-1"
              />
              <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-transparent p-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchClose}
                  className="h-6 w-6 hover:bg-transparent p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {isSearchActive && (searchTerm.trim() || hasSearched) && (
            <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto">
              {isLoading && (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Searching...</p>
                </div>
              )}

              {!isLoading &&
                hasSearched &&
                searchResults.length === 0 &&
                searchTerm && (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      No products found for "{searchTerm}"
                    </p>
                  </div>
                )}

              {!isLoading && searchResults.length > 0 && (
                <div className="p-2">
                  <div className="space-y-1">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          handleSearchClose();
                          router.push(`/products/${product.id}`);
                        }}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </p>
                          <p className="text-xs font-semibold text-primary">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {searchResults.length >= 5 && (
                    <div className="mt-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          handleSearchClose();
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
      )}
    </div>
  );
}
