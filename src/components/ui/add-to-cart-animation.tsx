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

  // Debug logging for animation positioning
  console.log("🎬 AddToCartAnimation received cartPosition:", cartPosition);
  console.log(
    "🎬 AddToCartAnimation calculated targetPosition:",
    targetPosition
  );

  console.log("🎬 Animation positions:", {
    startPosition,
    targetPosition,
    cartPosition,
  });

  return (
    <AnimatePresence>
      {/* Debug Visual Indicators */}
      {isAnimating && (
        <>
          {/* Target Position Indicator */}
          <div
            style={{
              position: "fixed",
              left: targetPosition.x,
              top: targetPosition.y,
              width: "20px",
              height: "20px",
              background: "red",
              borderRadius: "50%",
              zIndex: 10000,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          
          {/* Debug Info Box */}
          <div
            style={{
              position: "fixed",
              top: 10,
              left: 10,
              background: "red",
              color: "white",
              padding: "10px",
              zIndex: 10000,
              fontSize: "12px",
              borderRadius: "4px",
            }}
          >
            <div>Target: {targetPosition.x.toFixed(1)}, {targetPosition.y.toFixed(1)}</div>
            <div>Cart: {cartPosition.x.toFixed(1)}, {cartPosition.y.toFixed(1)}</div>
            <div>Start: {startPosition.x.toFixed(1)}, {startPosition.y.toFixed(1)}</div>
          </div>
        </>
      )}
      
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
              duration: 1.0,
              ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother animation
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
                className="w-12 h-12 rounded-lg object-cover shadow-lg border-2 border-white"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-sm -z-10" />
            </div>
          </motion.div>

          {/* Cart Icon Pulse Effect - More precise positioning */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 0.8,
              repeat: 1,
              ease: [0.25, 0.46, 0.45, 0.94], // Match product image easing
            }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: targetPosition.x,
              top: targetPosition.y,
              transform: "translate(-50%, -50%)",
            }}
            onAnimationStart={() => {
              console.log("🎬 Cart pulse animation starting at:", {
                left: targetPosition.x,
                top: targetPosition.y,
                transform: "translate(-50%, -50%)",
              });
            }}
          >
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-3 h-3 text-white" />
            </div>
          </motion.div>

          {/* Success Particles - More precise positioning */}
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
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute w-1.5 h-1.5 bg-green-500 rounded-full"
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
