import { MetadataRoute } from "next";

const baseUrl = "https://kawanestudio.com";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api";

async function getAllProducts() {
  try {
    // Fetch all products from API (no pagination limit to get all)
    const response = await fetch(`${apiUrl}/products?page=1&limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.warn("Failed to fetch products for sitemap");
      return [];
    }

    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Main pages with high priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Important pages
  const importantPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch all products from API
  const products = await getAllProducts();

  // Generate product pages
  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...mainPages, ...importantPages, ...productPages];
}
