import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Clock, Loader2 } from "lucide-react";
import { Deal } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface DealsSectionProps {
  flashSales: Deal[];
  featuredDeals: Deal[];
  isLoading: boolean;
}

export function DealsSection({
  flashSales,
  featuredDeals,
  isLoading,
}: DealsSectionProps) {
  // Calculate time remaining for flash sales
  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading deals...</span>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Flash Sale Banner */}
      {flashSales.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">⚡ Flash Sale</h2>
          <p className="text-sm mb-4">
            {flashSales[0].description ||
              "Up to 50% off on selected items - Limited time only!"}
          </p>
          {(() => {
            const timeRemaining = getTimeRemaining(flashSales[0].endDate);
            if (timeRemaining === "Expired") {
              return <div className="text-sm font-semibold">Deal Expired</div>;
            }
            return (
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <span className="font-bold">{timeRemaining.days}</span> Days
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <span className="font-bold">{timeRemaining.hours}</span> Hours
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <span className="font-bold">{timeRemaining.minutes}</span>{" "}
                  Minutes
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Featured Deals */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Featured Deals</h3>
        {featuredDeals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No featured deals available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <Card
                key={deal.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {deal.image ? (
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        width={400}
                        height={256}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-muted group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      -{deal.value}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold mb-2 line-clamp-2">
                      {deal.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {deal.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {(() => {
                          const timeRemaining = getTimeRemaining(deal.endDate);
                          if (timeRemaining === "Expired") return "Expired";
                          return `${timeRemaining.days} days left`;
                        })()}
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/products?deal=${deal.id}`}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        View Products
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* All Deals */}
      <div>
        <h3 className="text-lg font-semibold mb-6">All Deals</h3>
        {[...flashSales, ...featuredDeals].length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No deals available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...flashSales, ...featuredDeals].map((deal) => (
              <Card
                key={deal.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {deal.image ? (
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      -{deal.value}%
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 text-sm line-clamp-2">
                      {deal.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {deal.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      {(() => {
                        const timeRemaining = getTimeRemaining(deal.endDate);
                        if (timeRemaining === "Expired") return "Expired";
                        return `${timeRemaining.days} days left`;
                      })()}
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={`/products?deal=${deal.id}`}>
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        View Products
                      </Link>
                    </Button>
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
