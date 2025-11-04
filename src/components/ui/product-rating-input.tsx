"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

interface ProductRatingInputProps {
  productId: string;
  productName: string;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
  disabled?: boolean;
}

export function ProductRatingInput({
  productId,
  productName,
  initialRating = 0,
  onRatingSubmit,
  disabled = false,
}: ProductRatingInputProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(initialRating);
  const { user } = useAuth();

  // Fetch existing rating on mount
  useEffect(() => {
    const fetchExistingRating = async () => {
      if (!user?.id) return;
      
      try {
        // Check if user has already rated this product
        const response = await apiClient.getReviews(productId);
        const reviews = response?.data || [];
        if (Array.isArray(reviews) && reviews.length > 0) {
          // Find current user's review
          const userReview = reviews.find((r: any) => r.userId === user.id);
          if (userReview) {
            setSubmittedRating(userReview.rating);
            setRating(userReview.rating);
          }
        }
      } catch (error) {
        // Silently fail - user might not have rated yet
        console.log("No existing rating found");
      }
    };

    if (user?.id) {
      fetchExistingRating();
    }
  }, [productId, user?.id]);

  const handleStarClick = async (starRating: number) => {
    if (disabled || isSubmitting) return;

    setRating(starRating);
    
    try {
      setIsSubmitting(true);
      
      // Call API to submit rating
      await apiClient.createReview({
        productId,
        rating: starRating,
        comment: "", // Empty comment as per user request
      });

      setSubmittedRating(starRating);
      toast.success(`Rating ${starRating} stars submitted for ${productName}`);
      
      if (onRatingSubmit) {
        onRatingSubmit(starRating);
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error(error.message || "Failed to submit rating");
      setRating(submittedRating); // Revert on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!disabled && !isSubmitting) {
      setHoveredRating(starRating);
    }
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isSubmitted = star <= submittedRating;
          
          return (
            <button
              key={star}
              type="button"
              className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-all ${
                disabled || isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:scale-110"
              }`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              disabled={disabled || isSubmitting}
              title={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <StarIcon
                className={`w-4 h-4 transition-colors ${
                  isFilled
                    ? "text-yellow-400 fill-current"
                    : isSubmitted
                    ? "text-yellow-200 fill-current"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {submittedRating > 0 && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {submittedRating} star{submittedRating > 1 ? "s" : ""}
        </span>
      )}
      {isSubmitting && (
        <span className="text-xs text-gray-500">Submitting...</span>
      )}
    </div>
  );
}

