"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background dark:from-background dark:via-primary/5 dark:to-secondary/10 py-8 sm:py-0 md:py-0 lg:py-0">
      {/* Enhanced Background for Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background dark:from-primary/20 dark:via-accent/10 dark:to-muted/20">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 text-center hero-content relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="font-pragmatica font-[700] tracking-[-0.02em] leading-[0.95] uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-foreground to-muted-foreground dark:from-foreground dark:to-primary bg-clip-text text-transparent">
            Discover Premium Quality
          </h1>

          <p className="font-pragmatica tracking-[0.02em] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground dark:text-muted-foreground mb-3 sm:mb-4 md:mb-5 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Experience exceptional craftsmanship and timeless design. Shop our
            curated collection of premium products that elevate your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link href="/products">
              <Button
                size="lg"
                className="text-base sm:text-lg px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 dark:from-primary dark:to-primary/80 dark:hover:from-primary/90 dark:hover:to-primary/70 shadow-lg dark:shadow-primary/25 w-full sm:w-auto"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>

            <Link href="/deals">
              <Button
                variant="ghost"
                size="lg"
                className="text-base sm:text-lg px-5 sm:px-6 py-3.5 sm:py-4 bg-background/50 dark:bg-card/50 backdrop-blur-sm hover:bg-background/70 dark:hover:bg-card/70 text-foreground hover:text-primary transition-all duration-300 w-full sm:w-auto"
              >
                View Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base md:text-lg text-muted-foreground dark:text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/50 dark:bg-card/30 backdrop-blur-sm border border-border/20 dark:border-border/30">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>KAWANE</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/50 dark:bg-card/30 backdrop-blur-sm border border-border/20 dark:border-border/30">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>STUDIO</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-background/50 dark:bg-card/30 backdrop-blur-sm border border-border/20 dark:border-border/30">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>1921</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Floating Elements for Dark Mode */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-10 w-16 h-16 bg-success/10 dark:bg-success/20 rounded-full blur-2xl"
      />
    </section>
  );
}
