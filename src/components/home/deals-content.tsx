"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent } from "lucide-react";
import { apiClient, Deal } from "@/lib/api";
import Link from "next/link";
import { AddToDealCartButton } from "@/components/ui/add-to-deal-cart-button";

export function DealsContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.getDeals({
          status: "ACTIVE",
          includeExpired: true, // Include expired deals to show them
          limit: 10,
        });
        setDeals(response?.deals || []);
      } catch (err: any) {
        console.error("Error fetching deals:", err);
        setError(err.message || "Failed to fetch deals");
        // Fallback to static data if API fails
        setDeals([
          {
            id: "1",
            title: "Flash Sale - 50% Off",
            description: "Limited time offer on selected items",
            type: "PERCENTAGE",
            value: 50,
            status: "ACTIVE",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            image: "/placeholder-deal-1.jpg",
            isFlashSale: true,
            maxUses: 100,
            usedCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dealProducts: [
              {
                id: "dp1",
                dealId: "1",
                productId: "1c7de721-3323-4d89-9d15-2067b917e075",
                product: {
                  id: "1c7de721-3323-4d89-9d15-2067b917e075",
                  name: "Kawane T-Shirt Boxy",
                  description: "Premium quality t-shirt",
                  price: 150000,
                  stock: 10,
                  originalPrice: 150000,
                  discountedPrice: 75000,
                  discountAmount: 75000,
                  discountPercentage: 50,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  images: [],
                  category: undefined,
                },
                createdAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: "2",
            title: "Buy 2 Get 1 Free",
            description: "Special bundle offer",
            type: "PERCENTAGE",
            value: 33,
            status: "ACTIVE",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            image: "/placeholder-deal-2.jpg",
            isFlashSale: false,
            maxUses: 50,
            usedCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dealProducts: [
              {
                id: "dp2",
                dealId: "2",
                productId: "7691167d-f384-4674-a9c2-ceb89de688d6",
                product: {
                  id: "7691167d-f384-4674-a9c2-ceb89de688d6",
                  name: "Kawane Hoodie Premium",
                  description: "Premium quality hoodie",
                  price: 300000,
                  stock: 5,
                  originalPrice: 300000,
                  discountedPrice: 200000,
                  discountAmount: 100000,
                  discountPercentage: 33,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  images: [],
                  category: undefined,
                },
                createdAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: "3",
            title: "New Year Special",
            description: "Celebrate the new year with great deals",
            type: "PERCENTAGE",
            value: 30,
            status: "ACTIVE",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            image: "/placeholder-deal-3.jpg",
            isFlashSale: false,
            maxUses: 200,
            usedCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dealProducts: [
              {
                id: "dp3",
                dealId: "3",
                productId: "058089e8-b66e-4a56-8ee2-ca98826e2b50",
                product: {
                  id: "058089e8-b66e-4a56-8ee2-ca98826e2b50",
                  name: "Kawane Cap Limited",
                  description: "Limited edition cap",
                  price: 80000,
                  stock: 3,
                  originalPrice: 80000,
                  discountedPrice: 56000,
                  discountAmount: 24000,
                  discountPercentage: 30,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  images: [],
                  category: undefined,
                },
                createdAt: new Date().toISOString(),
              },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Helper function to calculate time left
  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} left`;
    } else {
      return "Less than 1 hour left";
    }
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (deal: Deal) => {
    if (deal.type === "PERCENTAGE" || deal.type === "FLASH_SALE") {
      return deal.value;
    } else if (deal.type === "FIXED_AMOUNT") {
      // For fixed amount, we need a base price to calculate percentage
      // This is a simplified calculation - in real app, you'd get product price
      return Math.round((deal.value / 100000) * 100); // Assuming base price of 100k
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Special Deals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Loading amazing deals...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Special Deals
          </h1>
          <p className="text-lg text-red-600 max-w-2xl mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Special Deals</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Don't miss out on these amazing deals! Limited time offers on premium
          products.
        </p>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No active deals available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href={`/deals/${deal.id}`}>
                    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-80 bg-muted group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                      {deal.images && deal.images.length > 0 ? (
                        <img
                          src={deal.images[0].url}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                        />
                      ) : deal.image ? (
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Deal Image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Deal Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${
                        deal.isFlashSale ? "bg-orange-500" : "bg-red-500"
                      } text-white`}
                    >
                      <Percent className="w-3 h-3 mr-1" />
                      {getDiscountPercentage(deal)}% OFF
                    </Badge>
                  </div>

                  {/* Flash Sale Badge */}
                  {deal.isFlashSale && (
                    <div className="absolute top-12 left-4">
                      <Badge className="bg-orange-600 text-white">
                        Flash Sale
                      </Badge>
                    </div>
                  )}

                  {/* Multiple images indicator */}
                  {((deal.images && deal.images.length > 1) ||
                    (deal.image && deal.images && deal.images.length > 0)) && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                      {deal.images ? deal.images.length : 2} images
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <Link href={`/deals/${deal.id}`}>
                    <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 line-clamp-2 hover:text-primary transition-colors">
                      {deal.title}
                    </h4>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {deal.description ||
                      "Attractive deal with limited offers. Click to see full details!"}
                  </p>

                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        getTimeLeft(deal.endDate) === "Expired"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {getTimeLeft(deal.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {deal.type === "PERCENTAGE" || deal.type === "FLASH_SALE"
                        ? `${deal.value}% discount`
                        : `Rp ${deal.value.toLocaleString()} off`}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <AddToDealCartButton
                      deal={deal}
                      productId={deal.dealProducts?.[0]?.productId || ""}
                      className="flex-1"
                      size="sm"
                      disabled={getTimeLeft(deal.endDate) === "Expired"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
