"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Package,
  Users,
  Bell,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { format } from "date-fns";

interface SearchDropdownProps {
  className?: string;
}

export function SearchDropdown({ className }: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Use debounce hook for better performance
  const debouncedQuery = useDebounce(query, 300);

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
    } else {
      clearSearch();
    }
  }, [debouncedQuery, search, clearSearch]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setQuery("");
      clearSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      clearSearch();
    }
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={`w-64 justify-start text-sm text-muted-foreground ${className}`}
        >
          <Search className="mr-2 h-4 w-4" />
          Search...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-[90vw] p-0" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Search orders, products, users..."
            value={query}
            onValueChange={setQuery}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
          <CommandList>
            {isSearching && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Searching...
                </span>
              </div>
            )}

            {!isSearching && error && (
              <div className="flex items-center justify-center py-6 text-center">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Search error: {error}</span>
                </div>
              </div>
            )}

            {!isSearching &&
              !error &&
              debouncedQuery &&
              searchResults.length === 0 && (
                <CommandEmpty>
                  No results found for "{debouncedQuery}"
                </CommandEmpty>
              )}

            {!isSearching && !error && !debouncedQuery && (
              <CommandEmpty>Start typing to search...</CommandEmpty>
            )}

            {!isSearching &&
              !error &&
              debouncedQuery &&
              searchResults.length > 0 && (
                <>
                  {/* Orders */}
                  {groupedResults.orders.length > 0 && (
                    <CommandGroup heading="Orders">
                      {groupedResults.orders.map((result) => (
                        <CommandItem key={result.id}>
                          <Link
                            href={result.url}
                            className="flex items-center space-x-3 w-full"
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
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Products */}
                  {groupedResults.products.length > 0 && (
                    <CommandGroup heading="Products">
                      {groupedResults.products.map((result) => (
                        <CommandItem key={result.id}>
                          <Link
                            href={result.url}
                            className="flex items-center space-x-3 w-full"
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
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Users */}
                  {groupedResults.users.length > 0 && (
                    <CommandGroup heading="Users">
                      {groupedResults.users.map((result) => (
                        <CommandItem key={result.id}>
                          <Link
                            href={result.url}
                            className="flex items-center space-x-3 w-full"
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
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Notifications */}
                  {groupedResults.notifications.length > 0 && (
                    <CommandGroup heading="Notifications">
                      {groupedResults.notifications.map((result) => (
                        <CommandItem key={result.id}>
                          <Link
                            href={result.url}
                            className="flex items-center space-x-3 w-full"
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
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
