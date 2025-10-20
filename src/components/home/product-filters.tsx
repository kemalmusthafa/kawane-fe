"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useApi";
import { Category } from "@/lib/api";

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  filters: {
    searchTerm: string;
    categoryId: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    minPrice: number;
    maxPrice: number;
    inStock: boolean | undefined;
  };
}

export function ProductFilters({
  onFilterChange,
  filters,
}: ProductFiltersProps) {
  const { categories } = useCategories();

  // Filter Collections untuk Collections section
  const collections =
    categories?.filter((category) => category.type === "COLLECTION") || [];

  // Filter Categories untuk Categories section
  const categoriesList =
    categories?.filter((category) => category.type === "CATEGORY") || [];
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);
  const [inStock, setInStock] = useState(filters.inStock);

  useEffect(() => {
    setPriceRange([filters.minPrice, filters.maxPrice]);
    setInStock(filters.inStock);
  }, [filters]);

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
    onFilterChange({
      minPrice: newRange[0],
      maxPrice: newRange[1],
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      categoryId: categoryId === filters.categoryId ? "" : categoryId,
    });
  };

  const handleInStockChange = (checked: boolean) => {
    const newInStock = checked ? true : undefined;
    setInStock(newInStock);
    onFilterChange({ inStock: newInStock });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setInStock(undefined);
    onFilterChange({
      categoryId: "",
      minPrice: 0,
      maxPrice: 1000000,
      inStock: undefined,
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base">
          <span>Filters</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs sm:text-sm"
          >
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
            Price Range
          </Label>
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={1000000}
            step={10000}
            className="mb-2"
          />
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Rp {priceRange[0].toLocaleString()}</span>
            <span>Rp {priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Collections */}
        <div>
          <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
            Collections
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {collections?.map((category: Category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={category.id}
                  className="text-xs sm:text-sm cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
            Categories
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categoriesList?.map((category: Category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-xs sm:text-sm cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div>
          <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
            Availability
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStock === true}
                onCheckedChange={handleInStockChange}
                className="h-4 w-4"
              />
              <Label
                htmlFor="in-stock"
                className="text-xs sm:text-sm cursor-pointer"
              >
                In Stock
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
