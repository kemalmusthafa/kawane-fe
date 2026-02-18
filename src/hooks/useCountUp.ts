import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  duration?: number;
  startValue?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

export function useCountUp(
  endValue: number | string,
  options: UseCountUpOptions = {}
) {
  const {
    duration = 2000,
    startValue = 0,
    decimals = 0,
    suffix = "",
    prefix = "",
    separator = ",",
  } = options;

  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Parse endValue to number
  const parseValue = (value: number | string): number => {
    if (typeof value === "number") return value;
    
    // Handle "1.5K+" -> 1500
    if (value.includes("K") || value.includes("k")) {
      const num = parseFloat(value.replace(/[Kk+]/g, ""));
      return num * 1000;
    }
    
    // Handle "98%" -> 98
    if (value.includes("%")) {
      return parseFloat(value.replace("%", ""));
    }
    
    // Handle decimal "4.8" -> 4.8
    return parseFloat(value.toString().replace(/[^0-9.]/g, ""));
  };

  const endNumber = parseValue(endValue);
  const hasK = typeof endValue === "string" && (endValue.includes("K") || endValue.includes("k"));
  const hasPercent = typeof endValue === "string" && endValue.includes("%");

  // Setup Intersection Observer to trigger animation when element is visible
  useEffect(() => {
    if (!elementRef.current) return;

    let hasAnimated = false;
    const currentElement = elementRef.current;

    const animate = () => {
      setIsAnimating(true);
      const startTime = Date.now();
      const start = startValue;

      const updateCount = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = start + (endNumber - start) * easeOut;
        setCount(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(updateCount);
        } else {
          setCount(endNumber);
          setIsAnimating(false);
        }
      };

      updateCount();
    };

    const currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animate();
            // Stop observing after animation starts
            currentObserver.unobserve(currentElement);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: "0px",
      }
    );

    observerRef.current = currentObserver;
    currentObserver.observe(currentElement);

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [endNumber, startValue, duration]);

  // Determine display format
  let displayValue: string;
  if (hasK) {
    // For K format, always convert to K format
    const kValue = count / 1000;
    const plusSign = typeof endValue === "string" && endValue.includes("+") ? "+" : "";
    displayValue = kValue.toFixed(1) + "K" + plusSign;
  } else if (hasPercent) {
    displayValue = count.toFixed(0) + "%";
  } else if (decimals > 0) {
    displayValue = count.toFixed(decimals);
  } else {
    displayValue = Math.floor(count).toString();
  }

  return {
    count: displayValue,
    isAnimating,
    elementRef,
  };
}

