"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { apiClient } from "@/lib/api";

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

interface ReviewStats {
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

interface UseReviewsProps {
  productId: string;
}

interface UseReviewsReturn {
  reviews: Review[];
  stats: ReviewStats | null;
  isLoading: boolean;
  error: string | null;
  submitReview: (rating: number, comment: string) => Promise<void>;
  refetch: () => void;
}

export function useReviews({ productId }: UseReviewsProps): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.request(`/products/${productId}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }

      const data = response.data as any;

      setReviews(data.reviews || []);
      setStats({
        averageRating: data.avgRating || 0,
        totalReviews: data.totalReviews || 0,
        distribution: data.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");

      // Set empty state on error
      setReviews([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    try {
      if (!user?.id) {
        throw new Error("User authentication required");
      }

      const response = await apiClient.request("/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to submit review");
      }

      // Refresh reviews after successful submission
      await fetchReviews();

      // Show success message
      toast.success("Review berhasil dikirim!");
    } catch (err) {
      console.error("Error submitting review:", err);
      throw err;
    }
  };

  const refetch = () => {
    fetchReviews();
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return {
    reviews,
    stats,
    isLoading,
    error,
    submitReview,
    refetch,
  };
}
