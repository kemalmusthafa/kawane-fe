"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  currentSort: string;
  currentOrder: "asc" | "desc";
}

export function ProductSort({
  onSortChange,
  currentSort,
  currentOrder,
}: ProductSortProps) {
  const handleSortChange = (value: string) => {
    let sortBy = "name";
    let sortOrder: "asc" | "desc" = "asc";

    switch (value) {
      case "name-asc":
        sortBy = "name";
        sortOrder = "asc";
        break;
      case "name-desc":
        sortBy = "name";
        sortOrder = "desc";
        break;
      case "price-asc":
        sortBy = "price";
        sortOrder = "asc";
        break;
      case "price-desc":
        sortBy = "price";
        sortOrder = "desc";
        break;
      case "rating-desc":
        sortBy = "rating";
        sortOrder = "desc";
        break;
      case "created-desc":
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
      default:
        sortBy = "name";
        sortOrder = "asc";
    }

    onSortChange(sortBy, sortOrder);
  };

  const getCurrentValue = () => {
    if (currentSort === "name" && currentOrder === "asc") return "name-asc";
    if (currentSort === "name" && currentOrder === "desc") return "name-desc";
    if (currentSort === "price" && currentOrder === "asc") return "price-asc";
    if (currentSort === "price" && currentOrder === "desc") return "price-desc";
    if (currentSort === "rating" && currentOrder === "desc")
      return "rating-desc";
    if (currentSort === "createdAt" && currentOrder === "desc")
      return "created-desc";
    return "name-asc";
  };
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={getCurrentValue()} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Highest Rated</SelectItem>
          <SelectItem value="created-desc">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
