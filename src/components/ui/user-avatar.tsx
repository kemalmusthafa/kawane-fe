"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";

const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/dkpn9aqne/image/upload/v1773769892/download_4_plhii4.jpg";

interface UserAvatarProps {
  avatar?: string;
  name: string;
  isVerified?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showVerifiedBadge?: boolean;
  className?: string;
}

export function UserAvatar({
  avatar,
  name,
  isVerified = false,
  size = "md",
  showVerifiedBadge = true,
  className = "",
}: UserAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6";
      case "md":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "xl":
        return "h-20 w-20";
      default:
        return "h-8 w-8";
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return "h-2 w-2";
      case "md":
        return "h-3 w-3";
      case "lg":
        return "h-4 w-4";
      case "xl":
        return "h-5 w-5";
      default:
        return "h-3 w-3";
    }
  };

  const avatarSrc = avatar?.trim() || DEFAULT_AVATAR_URL;
  // Stable key for hydration; re-render when avatar URL or name changes
  const avatarKey = `${name}-${avatarSrc}`;

  return (
    <div className={`relative ${className}`}>
      <Avatar className={getSizeClasses()}>
        <AvatarImage
          key={avatarKey}
          src={avatarSrc}
          alt={name}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== DEFAULT_AVATAR_URL) {
              target.src = DEFAULT_AVATAR_URL;
            } else {
              target.style.display = "none";
            }
          }}
          onLoad={() => {}}
        />
        <AvatarFallback className="bg-transparent">
          <img
            src={DEFAULT_AVATAR_URL}
            alt="Default avatar"
            className="h-full w-full object-cover rounded-full"
          />
        </AvatarFallback>
      </Avatar>

      {isVerified && showVerifiedBadge && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5">
          <CheckCircle className={`${getBadgeSize()} text-white`} />
        </div>
      )}
    </div>
  );
}
