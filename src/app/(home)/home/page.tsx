"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/home/hero-section";
import { LookbookCarousel } from "@/components/home/lookbook-carousel";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { BestSellers } from "@/components/home/best-sellers";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TrustSignals } from "@/components/home/trust-signals";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { NewsletterSignup } from "@/components/home/newsletter-signup";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }}
    >
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HeroSection />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <FeaturedCategories />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <BestSellers />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <NewArrivals />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TrustSignals />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-0"
        >
          <LookbookCarousel />
          <NewsletterSignup />
        </motion.div>
        <motion.div
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <InstagramFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}
