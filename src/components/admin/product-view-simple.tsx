"use client";

import { Product } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface ProductViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductViewSimple({
  product,
  isOpen,
  onClose,
}: ProductViewProps) {
  if (!product) {
    return null;
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this product including pricing,
            inventory, and images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground mt-1">
                SKU: {product.sku || "N/A"}
              </p>
            </div>
            {getStockBadge(product.stock)}
          </div>

          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm">{product.name || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    SKU
                  </label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {product.sku || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Category
                  </label>
                  <p className="text-sm">
                    {product.category?.name || "No Category"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Price
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    Rp{" "}
                    {product.price
                      ? product.price.toLocaleString("id-ID")
                      : "0"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Stock
                  </label>
                  <p className="text-sm">{product.stock || 0}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div>{getStockBadge(product.stock)}</div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm mt-1">
                  {product.description || "No description available"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-md"
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWM5Yzk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                          target.alt = "Image not available";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
