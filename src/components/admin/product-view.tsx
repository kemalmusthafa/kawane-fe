"use client";

import { Product } from "@/lib/api";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  Eye,
} from "lucide-react";

interface ProductViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductView({ product, isOpen, onClose }: ProductViewProps) {
  if (!product) return null;

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          <Separator />

          {/* Images Section */}
          {product.images && product.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square">
                        <img
                          src={image.url}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWM5Yzk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Product Information */}
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
                    <p className="text-sm">{product.name}</p>
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
                    <div className="text-sm whitespace-pre-line">
                      {product.description || "No description available"}
                    </div>
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
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Stock Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{product.stock}</p>
                      {getStockBadge(product.stock)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Stock Status
                    </label>
                    <p className="text-sm">
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= 5
                        ? "Low Stock"
                        : "In Stock"}
                    </p>
                  </div>
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
