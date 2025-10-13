"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Package,
  Users,
  FileText,
  Bell,
  Loader2,
  Warehouse,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSearchBarProps {
  className?: string;
}

export function AdminSearchBar({ className }: AdminSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Use debounce hook for better performance
  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    search,
    clearSearch,
    searchResults,
    groupedResults,
    isSearching,
    error,
  } = useGlobalSearch();

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search({ query: debouncedQuery, limit: 10 });
      setIsOpen(true);
    } else {
      clearSearch();
      setIsOpen(false);
    }
  }, [debouncedQuery, search, clearSearch]);

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

    const allResults = searchResults;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          handleResultClick(allResults[selectedIndex]);
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

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to a general search page or show all results
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
      setSelectedIndex(-1);
    }
  };

  const clearSearchInput = () => {
    setSearchQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FileText className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "user":
        return <Users className="h-4 w-4" />;
      case "notification":
        return <Bell className="h-4 w-4" />;
      case "inventory":
        return <Warehouse className="h-4 w-4" />;
      case "shipment":
        return <Truck className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-600";
      case "product":
        return "text-green-600";
      case "user":
        return "text-purple-600";
      case "notification":
        return "text-orange-600";
      case "inventory":
        return "text-indigo-600";
      case "shipment":
        return "text-teal-600";
      default:
        return "text-gray-600";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Search orders, products, users, inventory, shipments..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (searchQuery.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={clearSearchInput}
          >
            <X className="h-4 w-4" />
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
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto w-full sm:w-96"
          >
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">
                <div className="text-sm">Search error: {error}</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {/* Orders Section */}
                {groupedResults.orders.length > 0 && (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      Orders
                    </div>
                    {groupedResults.orders.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                              {result.metadata?.amount && (
                                <p className="text-xs text-green-600">
                                  {formatAmount(result.metadata.amount)}
                                </p>
                              )}
                            </div>
                            {result.metadata?.status && (
                              <Badge variant="outline" className="text-xs">
                                {result.metadata.status}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Products Section */}
                {groupedResults.products.length > 0 && (
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Package className="h-4 w-4" />
                      Products
                    </div>
                    {groupedResults.products.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                              {result.metadata?.amount && (
                                <p className="text-xs text-green-600">
                                  {formatAmount(result.metadata.amount)}
                                </p>
                              )}
                            </div>
                            {result.metadata?.status && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  result.metadata.status === "active"
                                    ? "text-green-600 border-green-200"
                                    : "text-red-600 border-red-200"
                                }`}
                              >
                                {result.metadata.status}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Users Section */}
                {groupedResults.users.length > 0 && (
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      Users
                    </div>
                    {groupedResults.users.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                            </div>
                            {result.metadata?.status && (
                              <Badge variant="outline" className="text-xs">
                                {result.metadata.status}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Notifications Section */}
                {groupedResults.notifications.length > 0 && (
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </div>
                    {groupedResults.notifications.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                            </div>
                            {result.metadata?.priority && (
                              <Badge variant="outline" className="text-xs">
                                {result.metadata.priority}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Inventory Section */}
                {groupedResults.inventory.length > 0 && (
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Warehouse className="h-4 w-4" />
                      Inventory
                    </div>
                    {groupedResults.inventory.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                              {result.metadata?.stock !== undefined && (
                                <p className="text-xs text-indigo-600">
                                  Stock: {result.metadata.stock}
                                </p>
                              )}
                            </div>
                            {result.metadata?.status && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  result.metadata.status === "in_stock"
                                    ? "text-green-600 border-green-200"
                                    : "text-red-600 border-red-200"
                                }`}
                              >
                                {result.metadata.status.replace("_", " ")}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Shipments Section */}
                {groupedResults.shipments.length > 0 && (
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Truck className="h-4 w-4" />
                      Shipments
                    </div>
                    {groupedResults.shipments.map((result, index) => {
                      const resultIndex = searchResults.findIndex(
                        (r) => r.id === result.id
                      );
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedIndex === resultIndex ? "bg-gray-50" : ""
                            }`}
                            onClick={() => handleResultClick(result)}
                          >
                            <div
                              className={`flex-shrink-0 ${getTypeColor(
                                result.type
                              )}`}
                            >
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {result.description}
                              </p>
                              {result.metadata?.trackingNumber && (
                                <p className="text-xs text-teal-600">
                                  Track: {result.metadata.trackingNumber}
                                </p>
                              )}
                            </div>
                            {result.metadata?.status && (
                              <Badge variant="outline" className="text-xs">
                                {result.metadata.status}
                              </Badge>
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Search All Results */}
                <div className="px-3 py-2 border-t">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm text-primary font-medium"
                    onClick={handleSearch}
                  >
                    Search for "{debouncedQuery}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No results found</div>
                <div className="text-xs">Try a different search term</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
