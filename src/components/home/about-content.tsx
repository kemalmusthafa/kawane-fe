import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Products Sold", value: "1M+", icon: Award },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Years Experience", value: "10+", icon: Heart },
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
    description: "On orders over $50",
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6">
          About <span className="text-primary">Kawane Studio</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          We're passionate about bringing you the finest products with
          exceptional service. Since our founding, we've been committed to
          quality, innovation, and customer satisfaction.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4 sm:p-6">
              <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl font-semibold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground">
            <p>
              Founded in 2014, Kawane Studio started as a small team with a big
              dream: to make premium products accessible to everyone. What began
              as a passion project has grown into a trusted e-commerce platform
              serving customers worldwide.
            </p>
            <p>
              We believe that everyone deserves access to high-quality products
              that enhance their daily lives. That's why we carefully curate our
              selection, working directly with manufacturers to ensure the best
              quality and value.
            </p>
            <p>
              Today, we're proud to serve over 50,000 satisfied customers across
              25+ countries, but our commitment to quality and customer service
              remains unchanged.
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
            Since 2014
          </Badge>
        </div>
      </div>

      {/* Our Values */}
      <div className="px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-12">
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
                <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/30 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
          Why Choose Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-sm sm:text-base font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Ready to Experience the Difference?
        </h2>
        <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">
          Join thousands of satisfied customers and discover premium products at
          unbeatable prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto bg-white text-black shop-now-btn"
          >
            Shop Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
