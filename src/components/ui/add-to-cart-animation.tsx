"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface AddToCartAnimationProps {
  isAnimating: boolean;
  productId: string | null;
  imageUrl: string | null;
  productName: string | null;
  cartPosition?: { x: number; y: number };
}

export const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  isAnimating,
  productId,
  imageUrl,
  productName,
  cartPosition = { x: 0, y: 0 },
}) => {
  // Calculate starting position (center of screen)
  const startPosition = {
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  };

  // Calculate target position (cart icon)
  const targetPosition = {
    x: cartPosition.x,
    y: cartPosition.y,
  };

  console.log("🎬 Animation positions:", {
    startPosition,
    targetPosition,
    cartPosition,
  });

  return (
    <AnimatePresence>
      {isAnimating && imageUrl && (
        <>
          {/* Flying Product Image */}
          <motion.div
            initial={{
              x: startPosition.x,
              y: startPosition.y,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: targetPosition.x,
              y: targetPosition.y,
              scale: 0.3,
              opacity: 0.8,
              rotate: 360,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="fixed z-50 pointer-events-none"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <img
                src={imageUrl}
                alt={productName || "Product"}
                className="w-16 h-16 rounded-lg object-cover shadow-lg border-2 border-white"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-sm -z-10" />
            </div>
          </motion.div>

          {/* Cart Icon Pulse Effect */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.6,
              repeat: 1,
              ease: "easeInOut",
            }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: targetPosition.x,
              top: targetPosition.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
          </motion.div>

          {/* Success Particles */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: targetPosition.x,
              top: targetPosition.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 bg-green-500 rounded-full"
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
