"use client";

import { Badge } from "@/components/ui/badge";
import { ProductDeal } from "@/lib/api";
import { Percent, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealBadgeProps {
  deal: ProductDeal;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DealBadge({ deal, className, size = "md" }: DealBadgeProps) {
  const getBadgeColor = () => {
    if (deal.isFlashSale) {
      return "bg-orange-500 hover:bg-orange-600";
    }
    return "bg-red-500 hover:bg-red-600";
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "md":
        return "text-sm px-3 py-1";
      case "lg":
        return "text-base px-4 py-2";
      default:
        return "text-sm px-3 py-1";
    }
  };

  const getIconSize = () => {
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

  return (
    <Badge
      className={cn(
        "text-white font-bold flex items-center gap-1",
        getBadgeColor(),
        getSizeClasses(),
        className
      )}
    >
      {deal.isFlashSale ? (
        <Zap className={getIconSize()} />
      ) : (
        <Percent className={getIconSize()} />
      )}
      {deal.discountPercentage}% OFF
    </Badge>
  );
}

interface DealTimeLeftProps {
  endDate: string;
  className?: string;
}

export function DealTimeLeft({ endDate, className }: DealTimeLeftProps) {
  const endTime = new Date(endDate).getTime();
  const now = new Date().getTime();
  const timeLeft = endTime - now;

  if (timeLeft <= 0) {
    return null;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const formatTime = () => {
    if (days > 0) {
      return `${days} hari tersisa`;
    } else if (hours > 0) {
      return `${hours} jam tersisa`;
    } else {
      return `${minutes} menit tersisa`;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-orange-600 border-orange-200 bg-orange-50 flex items-center gap-1",
        className
      )}
    >
      <Clock className="w-3 h-3" />
      {formatTime()}
    </Badge>
  );
}
