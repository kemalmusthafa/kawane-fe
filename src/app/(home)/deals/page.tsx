"use client";

import { motion } from "framer-motion";
import { DealsContent } from "@/components/home/deals-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const breadcrumbVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function DealsPage() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          variants={breadcrumbVariants}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-sm sm:text-base">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm sm:text-base">
                  Deals
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div
          variants={contentVariants}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <DealsContent />
        </motion.div>
      </div>
    </motion.div>
  );
}
