"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

const relatedProducts = [
  {
    id: 1,
    name: "Smart Fitness Watch",
    price: 299.99,
    rating: 4.9,
    image: "/watch.jpg",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    price: 149.99,
    rating: 4.7,
    image: "/earbuds.jpg",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 89.99,
    rating: 4.6,
    image: "/speaker.jpg",
  },
  {
    id: 4,
    name: "Phone Stand",
    price: 39.99,
    rating: 4.5,
    image: "/phone-stand.jpg",
  },
];

export function RelatedProducts() {
  const { requireAuth } = useAuthRedirect();

  const handleAddToCart = (product: any) => {
    const addToCartAction = async () => {
      try {
        // Simulate adding to cart
        toast.success(`${product.name} ditambahkan ke keranjang`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Gagal menambahkan produk ke keranjang");
      }
    };

    requireAuth(addToCartAction);
  };

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <div className="w-full h-64 bg-muted group-hover:scale-105 transition-transform duration-300" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({product.rating})
                  </span>
                </div>
                <h4 className="text-sm font-medium mb-2 line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-semibold text-primary">
                    ${product.price}
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
