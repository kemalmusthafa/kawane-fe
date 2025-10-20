"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface CategoryImageUploadProps {
  image: string;
  onImageChange: (image: string) => void;
  disabled?: boolean;
}

export function CategoryImageUpload({
  image,
  onImageChange,
  disabled = false,
}: CategoryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to Cloudinary endpoint
      const response = await apiClient.request("/categories/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        onImageChange((response.data as any).url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    onImageChange("");
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      onImageChange(url.trim());
    }
  };

  return (
    <div className="space-y-4">
      <Label>Category Image</Label>

      {/* Upload Area */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={addImageUrl}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground">
          Upload an image. Max size: 5MB.
        </p>
      </div>

      {/* Image Preview */}
      {image && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={image}
                alt="Category preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">
                <ImageIcon className="h-3 w-3 mr-1" />
                Image Selected
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Uploading image...
        </div>
      )}
    </div>
  );
}
