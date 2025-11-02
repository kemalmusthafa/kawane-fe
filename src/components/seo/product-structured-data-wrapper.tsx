import { ProductStructuredData } from "./structured-data";

interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: Array<{ url: string; alt?: string }>;
  category?: { name: string };
  sku?: string;
  stock: number;
}

interface ProductStructuredDataWrapperProps {
  productId: string;
}

export async function ProductStructuredDataWrapper({
  productId,
}: ProductStructuredDataWrapperProps) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api"
      }/products/${productId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const productData = await response.json();
    const product = productData.data || productData;

    return (
      <ProductStructuredData
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images?.map((img: { url: string }) => ({
            url: img.url,
            alt: product.name,
          })),
          category: product.category?.name,
          brand: "Kawane Studio",
          availability: product.stock > 0 ? "in stock" : "out of stock",
          condition: "new",
          sku: product.sku,
        }}
      />
    );
  } catch (error) {
    console.error("Error fetching product for structured data:", error);
    return null;
  }
}

