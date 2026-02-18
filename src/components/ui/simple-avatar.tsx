"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/api";

interface SimpleAvatarProps {
  user: User | null;
  isLoading: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SimpleAvatar({
  user,
  isLoading,
  size = "md",
  className = "",
}: SimpleAvatarProps) {
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

  // Default avatar URL from backend
  const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dkpn9aqne/image/upload/v1757101008/default-avatar_fkunn0.jpg';

  // Generate default avatar URL (fallback to backend default)
  const getDefaultAvatarUrl = (name?: string) => {
    return DEFAULT_AVATAR_URL;
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
          src={getDefaultAvatarUrl("User")}
          alt="User"
          key="default-avatar"
        />
        <AvatarFallback
          className={`bg-primary text-primary-foreground ${getTextSize()} font-medium`}
        >
          U
        </AvatarFallback>
      </Avatar>
    );
  }

  // Determine avatar source - use user avatar if valid, otherwise use default
  const userAvatar = user?.avatar?.trim();
  const avatarSrc = userAvatar && userAvatar !== '' && userAvatar !== 'null' 
    ? userAvatar 
    : DEFAULT_AVATAR_URL;
  const userInitials = getInitials(user?.name);

  return (
    <Avatar className={`${getSizeClasses()} ${className}`}>
      <AvatarImage
        src={avatarSrc}
        alt={user?.name || "User"}
        onError={(e) => {
          // If user avatar fails, try default avatar
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== DEFAULT_AVATAR_URL) {
            target.src = DEFAULT_AVATAR_URL;
          } else {
            target.style.display = "none";
          }
        }}
      />
      <AvatarFallback
        className={`bg-primary text-primary-foreground ${getTextSize()} font-medium`}
      >
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
}
