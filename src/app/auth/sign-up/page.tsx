"use client";

import { motion } from "framer-motion";
import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function SignUpPage() {
  return (
    <motion.div
      className="flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-md w-full space-y-8"
        variants={formVariants}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="text-center"
          variants={headerVariants}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/sign-in"
              className="font-bold text-primary hover:text-primary/80"
            >
              sign in to existing account
            </Link>
          </p>
        </motion.div>
        <SignUpForm />
      </motion.div>
    </motion.div>
  );
}
