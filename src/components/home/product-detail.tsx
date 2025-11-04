"use client";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct, useWishlist, useOrders, useReviews } from "@/hooks/useApi";
import { Product } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "../../hooks/useCart";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductImageCarousel } from "@/components/ui/product-image-carousel";
import { ReviewForm } from "@/components/ui/review-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Minus,
  StarIcon,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  CreditCard,
  MessageSquare,
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
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const { requireAuth } = useAuthRedirect();
  const { product, error, isLoading } = useProduct(actualProductId);
  const { orders, isLoading: isLoadingOrders } = useOrders({ status: "COMPLETED" });
  const { createReview } = useReviews(actualProductId);

  // Check if user has purchased this product
  const hasPurchasedProduct = useMemo(() => {
    if (!isAuthenticated || !product || isLoadingOrders) return false;
    
    return orders.some((order: any) =>
      order.items?.some((item: any) => item.productId === product.id)
    );
  }, [isAuthenticated, product, orders, isLoadingOrders]);

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

  const handleReviewSubmit = async (reviewData: {
    rating: number;
    comment: string;
  }) => {
    if (!product) return;

    try {
      await createReview({
        productId: product.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success("Review submitted successfully!");
      setIsReviewDialogOpen(false);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error?.message || "Failed to submit review. Please try again.");
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/products"
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Products
        </Link>
        <span className="mx-2 text-xs sm:text-sm text-gray-400">/</span>
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{product.name}</span>
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                {renderStars(0)}
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">0.0</span>
                <span className="text-sm sm:text-base text-gray-500 dark:text-gray-500">
                  (0 reviews)
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
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
              Description
            </h3>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {product.description}
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                Select Size
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 sm:mb-6">
                {product.sizes.map((sizeItem) => (
                  <button
                    key={sizeItem.id}
                    onClick={() => setSelectedSize(sizeItem.size)}
                    className={`px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-center transition-colors ${
                      selectedSize === sizeItem.size
                        ? "border-blue-500 bg-blue-500 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-white"
                        : "border-gray-300 hover:border-gray-400 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                    } ${
                      sizeItem.stock === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={sizeItem.stock === 0}
                  >
                    <div className="text-xs sm:text-sm font-medium">
                      {sizeItem.size}
                    </div>
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm sm:text-base text-green-600 dark:text-green-400 mb-2 text-left">
                  ✓ Size {selectedSize} selected
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Label htmlFor="quantity" className="text-sm sm:text-base font-medium">
              Quantity:
            </Label>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-12 sm:w-16 text-center text-xs sm:text-sm h-7 sm:h-8"
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
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
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
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                disabled={product.stock === 0}
              />
              <AddToWishlistButton
                product={product}
                variant="outline"
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
              />
              {hasPurchasedProduct && (
                <Button
                  variant="outline"
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Review
                </Button>
              )}
            </div>
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full text-xs sm:text-sm h-9 sm:h-10"
              size="default"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              Buy Now
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Free Shipping
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Secure Payment
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Quality Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            productId={actualProductId}
            onSubmit={handleReviewSubmit}
            onCancel={() => setIsReviewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
