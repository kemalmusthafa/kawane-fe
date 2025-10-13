import Image from "next/image";
import { getOptimizedImageUrl, isValidImageUrl } from "@/utils/image-utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  // Get optimized URL
  const optimizedSrc = getOptimizedImageUrl(src);

  // Check if URL is valid for Next.js Image
  const isValid = isValidImageUrl(optimizedSrc);

  if (!isValid) {
    // Fallback to regular img tag for invalid URLs
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      quality={quality}
    />
  );
}
