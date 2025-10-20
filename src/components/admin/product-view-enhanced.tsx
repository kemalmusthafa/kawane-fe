"use client";

import { Product } from "@/lib/api";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Package,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface ProductViewEnhancedProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  userRole?: "ADMIN" | "STAFF";
}

export function ProductViewEnhanced({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  userRole = "STAFF",
}: ProductViewEnhancedProps) {
  if (!product) return null;

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
      onClose();
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      confirm(`Are you sure you want to delete "${product.name}"?`)
    ) {
      onDelete(product.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-6">
          {/* Product Header with Actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{product.name || "N/A"}</h2>
              <p className="text-muted-foreground mt-1">
                SKU: {product.sku || "N/A"}
              </p>
              <div className="mt-2">{getStockBadge(product.stock || 0)}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && userRole === "ADMIN" && (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Images Section */}
          {product.images && product.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images ({product.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWM5Yzk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                            target.alt = "Image not available";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(image.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Product Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Product Name
                    </label>
                    <p className="text-sm font-medium">
                      {product.name || "N/A"}
                    </p>
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
                      Description
                    </label>
                    <p className="text-sm">
                      {product.description || "No description available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Pricing & Inventory
                </h3>
                <div className="space-y-3">
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
                      Stock Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">
                        {product.stock || 0}
                      </p>
                      {getStockBadge(product.stock || 0)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Stock Status
                    </label>
                    <p className="text-sm">
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock && product.stock <= 5
                        ? "Low Stock"
                        : "In Stock"}
                    </p>
                  </div>

                  {product.rating && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Rating
                      </label>
                      <p className="text-sm">{product.rating}/5 ⭐</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="text-sm">
                    {product.createdAt
                      ? format(
                          new Date(product.createdAt),
                          "dd MMMM yyyy, HH:mm",
                          {
                            locale: id,
                          }
                        )
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {product.updatedAt
                      ? format(
                          new Date(product.updatedAt),
                          "dd MMMM yyyy, HH:mm",
                          {
                            locale: id,
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
