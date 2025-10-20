import { ProductDetail } from "@/components/home/product-detail";
import { Metadata } from "next";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for better WhatsApp previews
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  try {
    // Fetch product data for metadata
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api"
      }/products/${params.id}`,
      {
        cache: "no-store", // Ensure fresh data for metadata
      }
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const productData = await response.json();
    const product = productData.data || productData; // Handle both response formats

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://kawane-fe.vercel.app";
    const productUrl = `${baseUrl}/products/${params.id}`;
    const productImage = product.images?.[0]?.url || `${baseUrl}/og-image.jpg`;

    return {
      title: `${product.name} - Kawane Studio`,
      description:
        product.description ||
        `Premium ${product.name} from Kawane Studio. Shop now for the best quality products.`,
      openGraph: {
        title: `${product.name} - Kawane Studio`,
        description:
          product.description ||
          `Premium ${product.name} from Kawane Studio. Shop now for the best quality products.`,
        url: productUrl,
        siteName: "Kawane Studio",
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        locale: "id_ID",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - Kawane Studio`,
        description:
          product.description ||
          `Premium ${product.name} from Kawane Studio. Shop now for the best quality products.`,
        images: [productImage],
        creator: "@kawanestudio",
        site: "@kawanestudio",
      },
      alternates: {
        canonical: productUrl,
      },
      other: {
        "og:image:width": "800",
        "og:image:height": "600",
        "og:image:type": "image/jpeg",
        "og:image:alt": product.name,
        "og:price:amount": product.price?.toString() || "0",
        "og:price:currency": "IDR",
        "product:brand": "Kawane Studio",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:price:amount": product.price?.toString() || "0",
        "product:price:currency": "IDR",
      },
    };
  } catch (error) {
    // Fallback metadata if product fetch fails
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://kawane-fe.vercel.app";
    return {
      title: "Product - Kawane Studio",
      description:
        "Premium products from Kawane Studio. Shop now for the best quality items.",
      openGraph: {
        title: "Product - Kawane Studio",
        description:
          "Premium products from Kawane Studio. Shop now for the best quality items.",
        url: `${baseUrl}/products/${params.id}`,
        siteName: "Kawane Studio",
        images: [
          {
            url: `${baseUrl}/og-image.jpg`,
            width: 800,
            height: 600,
            alt: "Kawane Studio",
          },
        ],
        locale: "id_ID",
        type: "website",
      },
    };
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail productId={params.id} />
    </div>
  );
}
