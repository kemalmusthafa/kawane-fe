/**
 * Utility functions for image validation
 */

export function isValidImageUrl(url: string): boolean {
  if (!url.trim()) return true; // Allow empty values

  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    // If not a valid URL, check if it's a local file path or base64
    return (
      url.startsWith("data:image/") ||
      url.startsWith("/") ||
      (url.includes(".") && /\.(jpg|jpeg|png|gif|webp)$/i.test(url))
    );
  }

  // If it's a valid URL, check if it's an image
  return (
    /\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
    url.includes("image") ||
    url.startsWith("data:image/")
  );
}

export function getImageValidationMessage(url: string): string {
  if (!url.trim()) return "";

  if (!isValidImageUrl(url)) {
    return "Please enter a valid image URL or file path";
  }

  return "";
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function isValidImageFileSize(
  file: File,
  maxSizeMB: number = 5
): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

