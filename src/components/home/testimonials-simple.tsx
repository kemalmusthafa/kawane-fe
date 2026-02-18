"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

// Mock data untuk test
const mockReviews = [
  {
    id: "1",
    rating: 5,
    comment:
      "Amazing quality products and exceptional customer service. I've been shopping here for months and never been disappointed.",
    createdAt: new Date().toISOString(),
    user: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
  },
  {
    id: "2",
    rating: 5,
    comment:
      "Fast shipping and great packaging. The products exceeded my expectations. Highly recommend!",
    createdAt: new Date().toISOString(),
    user: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  },
  {
    id: "3",
    rating: 5,
    comment:
      "Best online shopping experience I've had. Easy returns and responsive support team.",
    createdAt: new Date().toISOString(),
    user: {
      name: "Emily Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  },
];

export function TestimonialsSimple() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Real reviews from satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground mb-6 italic">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-medium">
                        {review.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
