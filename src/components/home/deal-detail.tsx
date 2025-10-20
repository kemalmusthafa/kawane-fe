"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDealById } from "@/hooks/useDeals";
import { Deal } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "../../hooks/useCart";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import { AddToDealCartButton } from "@/components/ui/add-to-deal-cart-button";
import { AddToWishlistButton } from "@/components/ui/add-to-wishlist-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DealImageCarousel } from "@/components/ui/deal-image-carousel";
import {
  Plus,
  Minus,
  StarIcon,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  CreditCard,
  Clock,
  Percent,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface DealDetailProps {
  dealId?: string;
}

export const DealDetail: React.FC<DealDetailProps> = ({ dealId }) => {
  const params = useParams();
  const router = useRouter();
  const actualDealId = dealId || (params.id as string);

  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated, user } = useAuth();
  const { addDealItem } = useCart();
  const { requireAuth } = useAuthRedirect();
  const { deal, error, isLoading } = useDealById(actualDealId);

  const handleBuyNow = async () => {
    if (!deal || !deal.dealProducts || deal.dealProducts.length === 0) return;

    const buyNowAction = async () => {
      try {
        // Use the first product in the deal
        const firstProduct = deal.dealProducts?.[0];
        if (!firstProduct) return;
        await addDealItem(deal.id, firstProduct.productId, quantity);
        toast.success("Deal added to cart");

        // Then redirect to checkout
        router.push("/checkout");
      } catch (error) {
        console.error("Error adding deal to cart:", error);
        toast.error("Failed to add deal to cart");
      }
    };

    requireAuth(buyNowAction);
  };

  const getDiscountPercentage = (deal: Deal) => {
    if (deal.type === "PERCENTAGE") {
      return deal.value;
    } else if (deal.type === "FIXED_AMOUNT") {
      // Assuming we have product price to calculate percentage
      return Math.round((deal.value / 100000) * 100); // Placeholder calculation
    } else if (deal.type === "FLASH_SALE") {
      return Math.round(((100000 - deal.value) / 100000) * 100); // Placeholder calculation
    }
    return 0;
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Deal not found
          </h1>
          <Link href="/deals">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images =
    deal.images && deal.images.length > 0
      ? deal.images.map((img) => img.url)
      : deal.image
      ? [deal.image]
      : [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
          Home
        </Link>
        <span className="mx-2 text-sm text-gray-400">/</span>
        <Link
          href="/deals"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Deals
        </Link>
        <span className="mx-2 text-sm text-gray-400">/</span>
        <span className="text-sm text-gray-600">{deal.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <DealImageCarousel
            images={images}
            dealTitle={deal.title}
            dealId={deal.id}
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          {/* Deal Title and Badges */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {deal.title}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-red-500 text-white">
                <Percent className="w-3 h-3 mr-1" />
                {getDiscountPercentage(deal)}% OFF
              </Badge>
              {deal.isFlashSale && (
                <Badge className="bg-orange-500 text-white">Flash Sale</Badge>
              )}
              <Badge className="bg-green-100 text-green-800">
                {deal.status}
              </Badge>
            </div>
          </div>

          {/* Deal Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Deal Description</h3>
            <p className="text-xs text-gray-600">
              {deal.description ||
                "Attractive deal with limited offers. Don't miss the opportunity to get quality products at special prices!"}
            </p>
          </div>

          {/* Deal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Deal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Discount Type</span>
                <Badge variant="outline" className="text-xs">
                  {deal.type === "PERCENTAGE" && "Percentage"}
                  {deal.type === "FIXED_AMOUNT" && "Fixed Amount"}
                  {deal.type === "FLASH_SALE" && "Flash Sale"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Discount Value</span>
                <span className="text-sm font-medium">
                  {deal.type === "PERCENTAGE" && `${deal.value}%`}
                  {deal.type === "FIXED_AMOUNT" &&
                    `Rp ${deal.value.toLocaleString()}`}
                  {deal.type === "FLASH_SALE" &&
                    `Rp ${deal.value.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Time Remaining</span>
                <span className="text-sm font-medium text-red-600">
                  {getTimeRemaining(deal.endDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Used</span>
                <span className="text-sm font-medium">
                  {deal.usedCount} / {deal.maxUses ? deal.maxUses : "∞"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Valid Until</span>
                <span className="text-sm font-medium">
                  {formatDate(deal.endDate)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="quantity" className="text-xs">
                Quantity:
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <AddToDealCartButton
                deal={deal}
                productId={deal.dealProducts?.[0]?.productId || ""}
                quantity={quantity}
                variant="outline"
                className="flex-1"
                disabled={!deal.dealProducts || deal.dealProducts.length === 0}
              />
              <Button
                onClick={handleBuyNow}
                disabled={!deal.dealProducts || deal.dealProducts.length === 0}
                className="flex-1"
                size="lg"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Package className="h-4 w-4 text-purple-600" />
              <span>Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
