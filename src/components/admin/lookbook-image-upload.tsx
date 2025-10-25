"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";

interface LookbookImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LookbookImageUpload({
  value,
  onChange,
  disabled = false,
}: LookbookImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api"
        }/lookbook/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload gagal");
      }

      const data = await response.json();
      // Ensure we have a full URL for the image
      const fullUrl = data.data.url.startsWith("http")
        ? data.data.url
        : `${window.location.origin}${data.data.url}`;
      onChange(fullUrl);
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload gambar");
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
    const url = e.target.value;
    // Convert relative path to full URL if needed
    const fullUrl = url.startsWith("http")
      ? url
      : url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;
    onChange(fullUrl);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Gambar Lookbook</Label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
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

        {value ? (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={value}
                alt="Lookbook preview"
                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Atau masukkan URL gambar:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={value}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="text-sm"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isUploading ? "Mengupload..." : "Upload gambar"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag & drop atau klik untuk memilih file
              </p>
              <p className="text-xs text-muted-foreground">
                Maksimal 5MB • JPG, PNG, GIF
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled || isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Pilih File
            </Button>
          </div>
        )}
      </div>

      {/* URL Input Alternative */}
      {!value && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Atau masukkan URL gambar:
          </Label>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
              disabled={disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
