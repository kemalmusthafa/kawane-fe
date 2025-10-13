"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  isValidImageUrl,
  getImageValidationMessage,
} from "@/utils/image-validation";

interface DealImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DealImageUpload({
  value,
  onChange,
  disabled = false,
}: DealImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
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

      const response = await fetch(
        "http://localhost:8000/api/deals/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  return (
    <div className="space-y-4">
      <Label>Deal Image</Label>

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <Card className="w-48">
            <CardContent className="p-2">
              <div className="relative">
                <Image
                  src={value}
                  alt="Deal preview"
                  width={200}
                  height={120}
                  className="w-full h-24 object-cover rounded"
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="space-y-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            ) : (
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Upload image"}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
            </div>
          </div>
        </div>
      )}

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="image-url">Or enter image URL</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="image-url"
              type="text"
              placeholder="https://example.com/image.jpg or /path/to/image.png"
              value={value}
              onChange={handleUrlChange}
              disabled={disabled || isUploading}
              className={
                value && !isValidImageUrl(value) ? "border-red-500" : ""
              }
            />
            {value && getImageValidationMessage(value) && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <span className="text-orange-500">⚠</span>
                {getImageValidationMessage(value)}
              </p>
            )}
          </div>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Change
            </Button>
          )}
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Recommended size: 400x240px</p>
      </div>
    </div>
  );
}
