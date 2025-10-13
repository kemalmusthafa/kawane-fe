"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  existingProducts?: Product[];
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    stock: number;
    sku?: string;
    images?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
}

export function ProductForm({
  isOpen,
  onClose,
  onSuccess,
  product,
  existingProducts = [],
  onSubmit,
}: ProductFormProps) {
  const { categories, mutateCategories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    stock: "",
    categoryId: "none",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        sku: product.sku || "",
        stock: product.stock?.toString() || "",
        categoryId: product.categoryId || "none",
      });
      setImages(product.images?.map((img) => img.url) || []);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        sku: "",
        stock: "",
        categoryId: "none",
      });
      setImages([]);
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sku: formData.sku.trim() || undefined,
        stock: parseInt(formData.stock),
        categoryId:
          formData.categoryId === "none" || !formData.categoryId
            ? undefined
            : formData.categoryId,
        images: images.length > 0 ? images : undefined,
      };

      const result = await onSubmit(submitData);

      if (result.success) {
        toast.success(
          product
            ? "Product updated successfully"
            : "Product created successfully"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to save product");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSKU = () => {
    if (!formData.categoryId) {
      toast.error("Pilih kategori terlebih dahulu untuk generate SKU");
      return;
    }

    const selectedCategory = categories?.find(
      (cat: any) => cat.id === formData.categoryId
    );
    if (!selectedCategory) {
      toast.error("Kategori tidak ditemukan");
      return;
    }

    const existingSKUs = existingProducts
      .map((p) => p.sku)
      .filter(Boolean) as string[];
    // Simple SKU generation without external utility
    const categoryCode = selectedCategory.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const generatedSKU = `KWN-${categoryCode}-${timestamp}`;

    setFormData((prev) => ({
      ...prev,
      sku: generatedSKU,
    }));

    toast.success(`SKU berhasil di-generate: ${generatedSKU}`);
  };

  const validateSKU = (sku: string) => {
    if (!sku) return true; // SKU is optional
    // Simple SKU validation
    return /^[A-Z0-9-]+$/.test(sku);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information and images."
              : "Add a new product to your inventory with images and details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <div className="flex gap-2">
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="KWN-TSH-001"
                  className="uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateSKU}
                  disabled={!formData.categoryId}
                  title="Generate SKU otomatis"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Format: KWN-KATEGORI-001 (contoh: KWN-TSH-001)
              </p>
              {formData.sku && !validateSKU(formData.sku) && (
                <p className="text-xs text-red-500">
                  Format SKU tidak valid. Gunakan format: KWN-KATEGORI-001
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (IDR) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
