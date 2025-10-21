"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct, useWishlist } from "@/hooks/useApi";
import { Product } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "../../hooks/useCart";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useReviews } from "@/hooks/useReviews";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { ReviewForm } from "@/components/ui/review-form";
import { ReviewList } from "@/components/ui/review-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductImageCarousel } from "@/components/ui/product-image-carousel";
import {
  Plus,
  Minus,
  StarIcon,
  MessageSquare,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

interface ProductDetailProps {
  productId?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const params = useParams();
  const router = useRouter();
  const actualProductId = productId || (params.id as string);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const { requireAuth } = useAuthRedirect();
  const { product, error, isLoading } = useProduct(actualProductId);
  const {
    reviews,
    stats,
    isLoading: reviewsLoading,
    submitReview,
  } = useReviews({ productId: actualProductId });

  const handleBuyNow = async () => {
    if (!product) return;

    // Check if product has sizes and size is selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    const buyNowAction = async () => {
      try {
        // Add to cart first with size information
        await addItem(product.id, quantity, selectedSize);
        toast.success("Product added to cart");

        // Then redirect to checkout
        router.push("/checkout");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add product to cart");
      }
    };

    requireAuth(buyNowAction);
  };

  const handleSubmitReview = async (review: {
    rating: number;
    comment: string;
  }) => {
    try {
      await submitReview(review.rating, review.comment);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="h-64 sm:h-80 lg:h-96 bg-gray-200 rounded"></div>
            <div className="space-y-3 sm:space-y-4">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Product not found
          </h1>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/products"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
        >
          Products
        </Link>
        <span className="mx-2 text-xs sm:text-sm text-gray-400">/</span>
        <span className="text-xs sm:text-sm text-gray-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <ProductImageCarousel
            images={product.images?.map((img) => img.url) || []}
            productName={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {renderStars(stats?.averageRating || 0)}
                <span className="text-xs sm:text-sm text-gray-600">
                  {stats?.averageRating
                    ? stats.averageRating.toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  ({stats?.totalReviews || 0} review
                  {stats?.totalReviews !== 1 ? "s" : ""})
                </span>
              </div>
              <Badge
                variant={
                  product.stock > 10
                    ? "default"
                    : product.stock > 0
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs sm:text-sm"
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? "Low Stock"
                  : "Out of Stock"}
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              Description
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {product.description}
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-2">
                Select Size
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {product.sizes.map((sizeItem) => (
                  <button
                    key={sizeItem.id}
                    onClick={() => setSelectedSize(sizeItem.size)}
                    className={`p-3 sm:p-4 lg:p-3 border rounded-lg text-center transition-colors ${
                      selectedSize === sizeItem.size
                        ? "border-blue-500 bg-blue-500 text-white dark:bg-blue-600 dark:text-white"
                        : "border-gray-300 hover:border-gray-400 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                    } ${
                      sizeItem.stock === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={sizeItem.stock === 0}
                  >
                    <div className="text-sm sm:text-base lg:text-sm font-medium">
                      {sizeItem.size}
                    </div>
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm sm:text-base text-green-600 mb-2">
                  ✓ Size {selectedSize} selected
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Label htmlFor="quantity" className="text-sm sm:text-base">
              Quantity:
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0"
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 sm:w-20 text-center text-sm sm:text-base h-8 sm:h-10"
                min="1"
                max={product.stock}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
                className="h-8 w-8 sm:h-10 sm:w-10 p-0"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <AddToCartButton
                product={product}
                quantity={quantity}
                selectedSize={selectedSize}
                variant="outline"
                className="flex-1 text-sm sm:text-base lg:text-sm h-10 sm:h-12 lg:h-10"
                disabled={product.stock === 0}
              />
              <AddToWishlistButton
                product={product}
                variant="outline"
                className="flex-1 text-sm sm:text-base lg:text-sm h-10 sm:h-12 lg:h-10"
              />
            </div>
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full text-sm sm:text-base lg:text-sm h-10 sm:h-12 lg:h-10"
              size="lg"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 mr-2" />
              Buy Now
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-sm sm:text-base">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              <span className="text-sm sm:text-base">Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      {/* Call to Action untuk Review */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Share Your Experience
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Help other customers by providing reviews and ratings for this
              product
            </p>
          </div>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-12"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {isAuthenticated ? "Write Review" : "Login to Review"}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Reviews ({stats?.totalReviews || 0})
            </h2>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <ReviewForm
            productId={actualProductId}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        {/* Reviews List */}
        <ReviewList
          reviews={reviews}
          averageRating={stats?.averageRating || 0}
          totalReviews={stats?.totalReviews || 0}
          distribution={stats?.distribution}
          isLoading={reviewsLoading}
        />
      </div>
    </div>
  );
};
