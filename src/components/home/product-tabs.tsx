"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, RotateCcw } from "lucide-react";

export function ProductTabs() {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Product Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            Our Premium Wireless Headphones deliver exceptional audio quality
            with advanced noise cancellation technology. Designed for comfort
            during extended listening sessions, these headphones feature premium
            materials and ergonomic design for a perfect fit.
          </p>

          <h4 className="text-lg font-semibold">Key Features:</h4>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Active Noise Cancellation (ANC) technology</li>
            <li>30-hour battery life with quick charge</li>
            <li>Premium comfort with memory foam ear cushions</li>
            <li>Bluetooth 5.0 with multipoint connectivity</li>
            <li>Built-in microphone for calls</li>
            <li>Foldable design for easy storage</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
            <button className="text-sm text-primary hover:underline">
              Write a Review
            </button>
          </div>

          {/* Review Summary */}
          <div className="flex items-center space-x-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold">4.8</div>
              <div className="flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">1,247 reviews</div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          rating === 5
                            ? 75
                            : rating === 4
                            ? 15
                            : rating === 3
                            ? 7
                            : rating === 2
                            ? 2
                            : 1
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {rating === 5
                      ? 75
                      : rating === 4
                      ? 15
                      : rating === 3
                      ? 7
                      : rating === 2
                      ? 2
                      : 1}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="font-medium">Amazing sound quality!</span>
              </div>
              <p className="text-muted-foreground text-sm">
                "These headphones exceeded my expectations. The noise
                cancellation is incredible and the sound quality is crystal
                clear."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                - John D. • Verified Buyer
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Shipping & Returns</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Truck className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Shipping Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over $50. Standard delivery takes
                    3-5 business days. Express shipping available for additional
                    cost.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RotateCcw className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">Return Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day hassle-free returns. Items must be in original
                    condition with all packaging included.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Shipping Rates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Orders under $50</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Orders $50+</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Express (1-2 days)</span>
                  <span>$15.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
