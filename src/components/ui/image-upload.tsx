"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const newImageUrls: string[] = [];
      const rejectedFiles: string[] = [];
      const failedFiles: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          rejectedFiles.push(`${file.name} (not an image file)`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          rejectedFiles.push(`${file.name} (file must be under 5MB)`);
          continue;
        }

        // Upload to server and get URL
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ||
            "https://kawane-be.vercel.app/api"
          }/deals/upload-image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          failedFiles.push(file.name);
          continue;
        }

        const data = await response.json();
        newImageUrls.push(data.data.url);
      }

      // Update images if any were successfully uploaded
      if (newImageUrls.length > 0) {
        onImagesChange([...images, ...newImageUrls]);
      }

      // Show appropriate toast messages - prevent conflicting messages
      if (newImageUrls.length > 0) {
        // Success case: show success message
        toast.success(`${newImageUrls.length} image(s) uploaded successfully`);

        // Show additional rejections if any
        if (rejectedFiles.length > 0) {
          const errorMessage =
            rejectedFiles.length === 1
              ? rejectedFiles[0]
              : `${rejectedFiles.length} files rejected: ${rejectedFiles
                  .slice(0, 2)
                  .join(", ")}${rejectedFiles.length > 2 ? "..." : ""}`;
          toast.error(errorMessage);
        }

        // Show additional failures if any
        if (failedFiles.length > 0) {
          const errorMessage =
            failedFiles.length === 1
              ? `Failed to upload ${failedFiles[0]}`
              : `Failed to upload ${failedFiles.length} files`;
          toast.error(errorMessage);
        }
      } else if (rejectedFiles.length > 0) {
        // Only rejected files - show rejection message
        const errorMessage =
          rejectedFiles.length === 1
            ? rejectedFiles[0]
            : `${rejectedFiles.length} files rejected: ${rejectedFiles
                .slice(0, 2)
                .join(", ")}${rejectedFiles.length > 2 ? "..." : ""}`;
        toast.error(errorMessage);
      } else if (failedFiles.length > 0) {
        // Only failed uploads - show failure message
        const errorMessage =
          failedFiles.length === 1
            ? `Failed to upload ${failedFiles[0]}`
            : `Failed to upload ${failedFiles.length} files`;
        toast.error(errorMessage);
      } else {
        // Fallback for unexpected cases
        toast.error("No images uploaded. Please check file requirements.");
      }
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      if (images.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }
      onImagesChange([...images, url.trim()]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>

      {/* Upload Area */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading || images.length >= maxImages}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Images"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={addImageUrl}
            disabled={disabled || images.length >= maxImages}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground">
          Upload up to {maxImages} images. Max size: 5MB per image.
        </p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWM5Yzk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+";
                    }}
                  />

                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              No images uploaded yet
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Upload images or add URLs to showcase your product
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
