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
    <section className="py-16 bg-primary text-primary-foreground -mt-0">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <Mail className="h-16 w-16 mx-auto mb-6 text-primary-foreground/80" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Stay Updated
          </h2>

          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8">
            Subscribe to our newsletter for exclusive deals, new product alerts,
            and insider tips.
          </p>

          {!isSubscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground transition-colors duration-200 font-semibold shadow-lg"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 rounded-lg p-6"
            >
              <p className="text-lg sm:text-xl font-medium">
                🎉 Thank you for subscribing!
              </p>
              <p className="text-base text-primary-foreground/80 mt-2">
                You'll receive our next newsletter soon.
              </p>
            </motion.div>
          )}

          <p className="text-sm sm:text-base text-primary-foreground/60 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
