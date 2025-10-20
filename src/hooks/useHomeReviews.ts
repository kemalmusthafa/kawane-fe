"use client";

import { useState, useEffect } from "react";

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

interface UseHomeReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

export function useHomeReviews(): UseHomeReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch recent reviews from all products
      const response = await fetch("/api/reviews/recent");

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching home reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");

      // Set empty state on error
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeReviews();
  }, []);

  return {
    reviews,
    isLoading,
    error,
  };
}






