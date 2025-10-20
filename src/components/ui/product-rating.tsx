"use client";

import { StarIcon } from "lucide-react";

interface ProductRatingProps {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className = "",
}: ProductRatingProps) {
  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "md":
        return "w-4 h-4";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`${getStarSize()} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatReviewCount = (count: number) => {
    if (count === 0) return "Belum ada review";
    if (count === 1) return "1 review";
    return `${count} reviews`;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {renderStars()}
      {showCount && (
        <span className={`${getTextSize()} text-muted-foreground font-medium`}>
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      )}
      {showCount && reviewCount > 0 && (
        <span className={`${getTextSize()} text-muted-foreground`}>
          ({formatReviewCount(reviewCount)})
        </span>
      )}
    </div>
  );
}
