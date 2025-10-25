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
import { Loader2 } from "lucide-react";
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
    sizes?: Array<{
      size: string;
      stock: number;
    }>;
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
    stock: "",
    categoryId: "none",
  });
  const [sizes, setSizes] = useState<Array<{ size: string; stock: number }>>(
    []
  );
  const [images, setImages] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Calculate total stock from sizes
  const calculateTotalStock = () => {
    return sizes.reduce((total, sizeItem) => total + sizeItem.stock, 0);
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        categoryId: product.categoryId || "none",
      });
      setSizes(
        product.sizes?.map((s) => ({ size: s.size, stock: s.stock })) || []
      );
      setImages(product.images?.map((img) => img.url) || []);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "none",
      });
      setSizes([]);
      setImages([]);
    }
  }, [product, isOpen]);

  // Update stock quantity when sizes change
  useEffect(() => {
    const totalStock = calculateTotalStock();
    if (sizes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        stock: totalStock.toString(),
      }));
    }
  }, [sizes]);

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

    // Validate sizes if any are provided
    if (sizes.length > 0) {
      for (let i = 0; i < sizes.length; i++) {
        const sizeItem = sizes[i];
        if (!sizeItem.size.trim()) {
          toast.error(`Size ${i + 1} is required`);
          return;
        }
        if (sizeItem.stock < 0) {
          toast.error(`Stock for size "${sizeItem.size}" cannot be negative`);
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sizes: sizes.length > 0 ? sizes : undefined,
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

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "SM", label: "SM" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  const addSize = () => {
    if (customSizeInput.trim()) {
      // Add custom size
      setSizes([
        ...sizes,
        { size: customSizeInput.trim().toUpperCase(), stock: 0 },
      ]);
      setCustomSizeInput("");
    } else {
      // Add empty size for dropdown selection
      setSizes([...sizes, { size: "", stock: 0 }]);
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: "size" | "stock",
    value: string | number
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const addCustomSize = () => {
    if (customSizeInput.trim()) {
      setSizes([
        ...sizes,
        { size: customSizeInput.trim().toUpperCase(), stock: 0 },
      ]);
      setCustomSizeInput("");
    }
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
              <div className="flex items-center justify-between">
                <Label>Sizes & Stock</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSize}
                  >
                    + Add Size
                  </Button>
                </div>
              </div>

              {/* Custom Size Input */}
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Enter custom size (e.g., 28, 30, S, M, L)"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomSize}
                  disabled={!customSizeInput.trim()}
                >
                  Add Custom
                </Button>
              </div>

              {sizes.length === 0 ? (
                <p className="text-sm text-gray-500">No sizes added yet</p>
              ) : (
                <div className="space-y-2">
                  {sizes.map((sizeItem, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        <Select
                          value={sizeItem.size}
                          onValueChange={(value) =>
                            updateSize(index, "size", value)
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Custom"
                          value={sizeItem.size}
                          onChange={(e) =>
                            updateSize(
                              index,
                              "size",
                              e.target.value.toUpperCase()
                            )
                          }
                          className="w-20"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={sizeItem.stock}
                        onChange={(e) =>
                          updateSize(
                            index,
                            "stock",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                        min="0"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSize(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
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
                disabled={sizes.length > 0}
                className={sizes.length > 0 ? "bg-gray-100" : ""}
              />
              {sizes.length > 0 && (
                <p className="text-xs text-gray-500">
                  Stock quantity automatically calculated from sizes
                </p>
              )}
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
