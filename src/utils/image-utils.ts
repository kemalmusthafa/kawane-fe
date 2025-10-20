/**
 * Utility functions for handling image URLs
 */

/**
 * Convert Google Drive share URL to direct image URL
 * @param shareUrl - Google Drive share URL
 * @returns Direct image URL or original URL if not a Google Drive URL
 */
export function convertGoogleDriveUrl(shareUrl: string): string {
  // Check if it's a Google Drive share URL
  const driveMatch = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Return original URL if not a Google Drive URL
  return shareUrl;
}

/**
 * Check if URL is a valid image URL
 * @param url - URL to check
 * @returns boolean
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validHostnames = [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "img.freepik.com",
      "www.goteso.com",
      "www.digitalopeners.com",
      "drive.google.com",
    ];

    return validHostnames.some((hostname) =>
      urlObj.hostname.includes(hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Get optimized image URL for Next.js Image component
 * @param url - Original image URL
 * @returns Optimized URL for Next.js Image
 */
export function getOptimizedImageUrl(url: string): string {
  // Convert Google Drive URLs
  if (url.includes("drive.google.com/file/d/")) {
    return convertGoogleDriveUrl(url);
  }

  // Return original URL if it's already optimized
  return url;
}
