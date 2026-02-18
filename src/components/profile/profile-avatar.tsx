"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check, Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  isVerified: boolean;
  onAvatarUpdate: (url: string) => Promise<void>;
}

export function ProfileAvatar({
  avatar,
  name,
  isVerified,
  onAvatarUpdate,
}: ProfileAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size must be less than 5MB");
      return;
    }

    setAvatarError("");

    // Create preview URL and update avatar
    const url = URL.createObjectURL(file);
    handleAvatarUpdate(url);
  };

  const handleAvatarUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    setAvatarUrl(url);
    setAvatarError("");
  };

  const handleAvatarUpdate = async (url?: string) => {
    const avatarToUpdate = url || avatarUrl;
    if (!avatarToUpdate) {
      setAvatarError("Please select an image or enter an image URL");
      return;
    }

    try {
      setIsUpdatingAvatar(true);
      setAvatarError("");

      await onAvatarUpdate(avatarToUpdate);
      setAvatarUrl("");
    } catch (error: any) {
      setAvatarError(error.message || "Failed to update avatar");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative">
          <UserAvatar
            avatar={avatar}
            name={name}
            isVerified={isVerified}
            size="xl"
            showVerifiedBadge={true}
          />
        </div>
      </div>

      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarFileSelect}
          ref={avatarFileRef}
          className="hidden"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full justify-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload New Photo
        </label>

        {/* URL Input */}
        <div className="flex items-center space-x-2 w-full">
          <Input
            type="url"
            placeholder="Or paste image URL"
            value={avatarUrl}
            onChange={handleAvatarUrlChange}
            className="text-xs border-gray-300 focus:border-gray-400 focus:ring-gray-400"
          />
          <Button
            size="sm"
            onClick={() => handleAvatarUpdate()}
            disabled={!avatarUrl || isUpdatingAvatar}
            className="bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            {isUpdatingAvatar ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
        </div>

        {avatarError && (
          <div className="w-full p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-600 text-center">{avatarError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
