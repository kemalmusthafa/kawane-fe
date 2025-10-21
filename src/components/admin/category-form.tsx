"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { CategoryImageUpload } from "@/components/ui/category-image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
  existingCategories?: any[];
  onSubmit?: (data: any) => void;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSuccess,
  category,
  existingCategories = [],
  onSubmit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    image: category?.image || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
      });
    }
  }, [category, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Validasi duplicate name dihapus - sekarang bisa membuat category dengan nama yang sama

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        if (category) {
          // Update kategori
          await apiClient.request(`/categories/${category.id}`, {
            method: "PUT",
            body: JSON.stringify(formData),
          });
          toast.success("Category updated successfully");
        } else {
          // Buat kategori baru
          await apiClient.request("/categories", {
            method: "POST",
            body: JSON.stringify(formData),
          });
          toast.success("Category created successfully");
        }
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        image: "",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Submit error:", error);

      // Handle specific error messages
      if (error.message?.includes("already exists")) {
        toast.error(
          `Category "${formData.name}" already exists. Please use a different name.`
        );
      } else if (error.message?.includes("required")) {
        toast.error("Category name is required");
      } else {
        toast.error(error.message || "Failed to save category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Edit category information"
              : "Add a new category to organize products"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form
            id="category-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>

            {/* Upload Image */}
            <CategoryImageUpload
              image={formData.image}
              onImageChange={handleImageChange}
              disabled={isSubmitting}
            />
          </form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="category-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {category ? "Update" : "Save"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
