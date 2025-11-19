"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-primary text-primary-foreground -mt-0">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <Mail className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 lg:mb-6 text-primary-foreground/80" />

          <h2 className="text-base sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">
            Stay Updated
          </h2>

          <p className="text-xs sm:text-base lg:text-lg text-primary-foreground/80 mb-4 sm:mb-8">
            Subscribe to our newsletter for exclusive deals, new product alerts,
            and insider tips.
          </p>

          {!isSubscribed ? (
            <div className="flex justify-center w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-1.5 sm:gap-2 md:gap-4 max-w-sm sm:max-w-md w-full"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4"
                />
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground transition-colors duration-200 font-semibold shadow-lg text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="ml-0.5 sm:ml-1 md:ml-2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 rounded-lg p-6"
            >
              <p className="text-sm sm:text-base lg:text-lg font-medium">
                🎉 Thank you for subscribing!
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-primary-foreground/80 mt-2">
                You'll receive our next newsletter soon.
              </p>
            </motion.div>
          )}

          <p className="text-[10px] sm:text-xs md:text-base text-primary-foreground/60 mt-3 sm:mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
