"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { RatingSummary } from "@/components/ui/rating-summary";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  isLoading?: boolean;
}

export function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  distribution,
  isLoading,
}: ReviewListProps) {
  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

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
    const texts = {
      1: "Sangat Buruk",
      2: "Buruk",
      3: "Biasa",
      4: "Bagus",
      5: "Sangat Bagus",
    };
    return texts[rating as keyof typeof texts] || "";
  };

  const getRatingDistribution = () => {
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });
    return ratingDistribution;
  };

  const calculatedDistribution = getRatingDistribution();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {distribution ? (
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
          distribution={distribution}
        />
      ) : (
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
          distribution={calculatedDistribution}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Belum ada review
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Jadilah yang pertama memberikan review untuk produk ini!
              </p>
              <div className="text-xs text-muted-foreground">
                ⭐ Rating dan review membantu customer lain dalam memutuskan
                pembelian
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {review.user.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm sm:text-base font-medium text-primary">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm sm:text-base">
                            {review.user.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating, "sm")}
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {getRatingText(review.rating)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <Badge variant="secondary" className="text-xs">
                            Verified Customer
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(review.createdAt), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
