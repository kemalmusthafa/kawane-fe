"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function RatingSummary({
  averageRating,
  totalReviews,
  distribution,
}: RatingSummaryProps) {
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize =
      size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`${starSize} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Sangat Bagus";
    if (rating >= 3.5) return "Bagus";
    if (rating >= 2.5) return "Biasa";
    if (rating >= 1.5) return "Buruk";
    return "Sangat Buruk";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    if (rating >= 1.5) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Rating */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating), "md")}
          </div>
          <p
            className={`text-sm font-medium ${getRatingColor(
              averageRating
            )} mb-1`}
          >
            {getRatingText(averageRating)}
          </p>
          <p className="text-xs text-muted-foreground">
            Berdasarkan {totalReviews} review
          </p>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="lg:col-span-2">
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-medium mb-4 text-gray-900 dark:text-white">
            Distribusi Rating
          </h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star as keyof typeof distribution];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{star}</span>
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 w-16">
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}








