"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/api";

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/dkpn9aqne/image/upload/v1773769892/download_4_plhii4.jpg";

interface AdminAvatarProps {
  user: User | null;
  isLoading: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AdminAvatar({
  user,
  isLoading,
  size = "md",
  className = "",
}: AdminAvatarProps) {
  const getInitials = (name?: string) => {
    if (!name || name.trim() === "") return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6";
      case "md":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      default:
        return "h-8 w-8";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-xs";
      case "lg":
        return "text-sm";
      default:
        return "text-xs";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`${getSizeClasses()} rounded-full bg-gray-200 animate-pulse ${className}`}
      />
    );
  }

  // Show default avatar if no user
  if (!user) {
    return (
      <Avatar className={`${getSizeClasses()} ${className}`}>
        <AvatarImage
          src={DEFAULT_AVATAR_URL}
          alt="User"
          key="default-avatar"
        />
        <AvatarFallback
        className="bg-transparent"
        >
        <img
          src={DEFAULT_AVATAR_URL}
          alt="Default avatar"
          className="h-full w-full object-cover rounded-full"
        />
        </AvatarFallback>
      </Avatar>
    );
  }

  // Determine avatar source with proper key for re-rendering
  const avatarUrl = user?.avatar?.trim() || DEFAULT_AVATAR_URL;

  // Stable key for hydration; changes when user or avatar URL change (no Date.now() to avoid server/client mismatch)
  const avatarKey = `${user.id}-${avatarUrl}`;

  return (
    <Avatar className={`${getSizeClasses()} ${className}`}>
      <AvatarImage
        key={avatarKey}
        src={avatarUrl}
        alt={user?.name || "User"}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== DEFAULT_AVATAR_URL) {
            target.src = DEFAULT_AVATAR_URL;
          } else {
            target.style.display = "none";
          }
        }}
        onLoad={() => {
          // Force re-render when image loads
        }}
      />
      <AvatarFallback
        className="bg-transparent"
      >
        <img
          src={DEFAULT_AVATAR_URL}
          alt="Default avatar"
          className="h-full w-full object-cover rounded-full"
        />
      </AvatarFallback>
    </Avatar>
  );
}
