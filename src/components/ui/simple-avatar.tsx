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

  // Generate default avatar URL
  const getDefaultAvatarUrl = (name?: string) => {
    const initials = getInitials(name);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=6366f1&color=ffffff&size=128&bold=true`;
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

  // Determine avatar source with proper key for re-rendering
  const avatarSrc = user?.avatar?.trim() || getDefaultAvatarUrl(user?.name);
  const userInitials = getInitials(user?.name);

  // Create unique key that includes avatar URL to force re-render when avatar changes
  const avatarKey = `${user.id}-${avatarSrc}-${Date.now()}`;

  return (
    <Avatar className={`${getSizeClasses()} ${className}`}>
      <AvatarImage
        key={avatarKey}
        src={avatarSrc}
        alt={user?.name || "User"}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
        }}
        onLoad={() => {
          // Force re-render when image loads
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
