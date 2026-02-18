"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({ productId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthRedirect();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating for this product");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    const submitReview = async () => {
      try {
        setIsSubmitting(true);
        await onSubmit({ rating, comment: comment.trim() });
        setRating(0);
        setComment("");
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    requireAuth(submitReview);
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoveredRating || rating);
          return (
            <button
              key={star}
              type="button"
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              disabled={isSubmitting}
            >
              <StarIcon
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                  isFilled
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300 hover:text-yellow-300"
                } ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : "Select rating"}
        </span>
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: "Very Poor",
      2: "Poor",
      3: "Average",
      4: "Good",
      5: "Excellent",
    };
    return texts[rating as keyof typeof texts] || "";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Write Review</CardTitle>
        {!isAuthenticated && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
            ⚠️ You must login first to give a review
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Section */}
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-sm font-medium">
            Rating *
          </Label>
          <div className="space-y-2">
            {renderStars()}
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {getRatingText(rating)}
              </p>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-sm font-medium">
            Comment *
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product... (minimum 10 characters)"
            rows={4}
            className="resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {comment.length < 10
                ? `Minimum 10 characters (${comment.length}/10)`
                : `${comment.length} characters`}
            </span>
            <span>Maximum 500 characters</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || rating === 0 || comment.trim().length < 10
            }
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Review Guidelines:</p>
          <ul className="space-y-1 text-xs">
            <li>• Give honest ratings based on your experience</li>
            <li>• Write comments that help other customers</li>
            <li>• Avoid inappropriate words or spam</li>
            <li>• Reviews will be moderated before publication</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
