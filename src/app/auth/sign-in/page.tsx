"use client";

import { motion } from "framer-motion";
import { SignInForm } from "@/components/auth/sign-in-form";
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

export default function SignInPage() {
  return (
    <motion.div
      className="flex items-center justify-center bg-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-md w-full space-y-6"
        variants={formVariants}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="text-center"
          variants={headerVariants}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-primary hover:text-primary/80"
            >
              create a new account
            </Link>
          </p>
        </motion.div>
        <SignInForm />
      </motion.div>
    </motion.div>
  );
}
