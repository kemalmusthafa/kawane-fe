"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";
import {
  Award,
  Users,
  Globe,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
  Star,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

const stats = [
  {
    label: "Store Rating",
    value: "4.8",
    icon: Star,
    suffix: "/ 5.0",
    endValue: 4.8,
    decimals: 1,
  },
  {
    label: "Products Sold",
    value: "1.5K+",
    icon: ShoppingBag,
    endValue: "1.5K+",
  },
  {
    label: "Happy Customers",
    value: "1.2K+",
    icon: Users,
    endValue: "1.2K+",
  },
  {
    label: "Chat Response Rate",
    value: "98%",
    icon: MessageSquare,
    endValue: "98%",
  },
];

const values = [
  {
    title: "Quality First",
    description:
      "We carefully curate every product to ensure the highest quality standards.",
    icon: Award,
  },
  {
    title: "Customer Focus",
    description:
      "Your satisfaction is our priority. We're here to help you find exactly what you need.",
    icon: Heart,
  },
  {
    title: "Trust & Security",
    description:
      "Your data and transactions are protected with industry-leading security measures.",
    icon: Shield,
  },
  {
    title: "Global Reach",
    description:
      "We deliver to customers worldwide with fast and reliable shipping.",
    icon: Globe,
  },
];

const features = [
  {
    title: "Free Shipping",
    description: "On orders over IDR 1000K",
    icon: Truck,
  },
  {
    title: "Easy Returns",
    description: "30-day hassle-free returns",
    icon: RotateCcw,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer service",
    icon: Headphones,
  },
];

export function AboutContent() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <div className="text-center px-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 lg:mb-6 leading-tight">
          About <span className="text-primary">Kawane Studio</span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
          We're passionate about bringing you the finest products with
          exceptional service. Since our founding, we've been committed to
          quality, innovation, and customer satisfaction.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          // Determine suffix for the hook
          let suffix = "";
          if (stat.value.includes("%")) {
            suffix = "%";
          } else if (stat.value.includes("K") || stat.value.includes("k")) {
            // For K format, we'll handle it in the display
            suffix = stat.value.includes("+") ? "+" : "";
          } else if (stat.value.includes("+")) {
            suffix = "+";
          }

          const { count, elementRef } = useCountUp(stat.endValue, {
            duration: 2000,
            decimals: stat.decimals || 0,
            suffix: suffix,
          });

          return (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-4 sm:p-6" ref={elementRef}>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
                <div className="flex items-baseline justify-center gap-1 mb-1 sm:mb-2">
                  <div className="text-base sm:text-lg md:text-xl font-semibold text-primary">
                    {count}
                  </div>
                  {stat.suffix && (
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.suffix}
                    </div>
                  )}
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Our Story */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 leading-tight">
            Our Story
          </h2>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
            <p>
              Kawane is a local brand born from personal concerns and makes it
              the core of the creative process. Based on a blend of streetwear
              and casualwear, Kawane presents collections that not only speak
              through design, but also through the meaning behind every detail.
            </p>
            <p>
              Every piece in our collection is crafted with intention,
              reflecting our commitment to authenticity and quality. We believe
              that fashion should be more than just clothing—it should be a form
              of self-expression that carries meaning and purpose.
            </p>
            <p>
              From the initial concept to the final product, we ensure that
              every detail tells a story, making each item not just a piece of
              clothing, but a statement of your personal style and values.
            </p>
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/5i0vYvWcaGo"
              title="Kawane Studio Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
          <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-primary-foreground text-xs sm:text-sm">
            Since 1921
          </Badge>
        </div>
      </div>

      {/* Our Values */}
      <div className="px-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center mb-6 sm:mb-8 lg:mb-12 leading-tight">
          Our Values
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-4 sm:p-6">
                <value.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-2 sm:mb-3 leading-tight">
                  {value.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 rounded-xl p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center mb-6 sm:mb-8 leading-tight">
          Why Choose Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-2 leading-tight">
                {feature.title}
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 leading-tight">
          Ready to Experience the Difference?
        </h2>
        <p className="text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 opacity-90 leading-relaxed">
          Join thousands of satisfied customers and discover premium products at
          unbeatable prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/products">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-white text-black shop-now-btn"
            >
              Shop Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
