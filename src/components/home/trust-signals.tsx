"use client";

import { Shield, Truck, RotateCcw, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

const signals = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "100% secure payment processing with SSL encryption",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $50 with tracking",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns and exchanges",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support via chat and phone",
  },
];

export function TrustSignals() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            We're committed to providing the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <signal.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-medium mb-2">
                {signal.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
