"use client";

interface ProductStructuredDataProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    images?: Array<{ url: string; alt?: string }>;
    category?: string;
    brand?: string;
    availability?: string;
    condition?: string;
    sku?: string;
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const baseUrl = "https://kawanestudio.com";
  const productUrl = `${baseUrl}/products/${product.id}`;
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : `${baseUrl}/og-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url) || [productImage],
    description:
      product.description ||
      `Premium ${product.name} from Kawane Studio. Shop now for the best quality products.`,
    brand: {
      "@type": "Brand",
      name: product.brand || "Kawane Studio",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IDR",
      price: product.price.toString(),
      availability:
        product.availability === "in stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Kawane Studio",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "10",
    },
    sku: product.sku || product.id,
    category: product.category || "Fashion & Lifestyle",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationStructuredData({
  name = "Kawane Studio",
  url = "https://kawanestudio.com",
  logo = "https://kawanestudio.com/logo-hitam.png",
  description = "Premium e-commerce platform for fashion and lifestyle products",
}: OrganizationStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    alternateName: ["Kawane", "Kawané", "Kawane Studio"],
    url: url,
    logo: logo,
    description: description,
    keywords: "kawane, kawane studio, kawanestudio, kawane fashion, kawane lifestyle, kawane products",
    sameAs: [
      "https://www.facebook.com/kawanestudio",
      "https://www.instagram.com/kawanestudio",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "kawane.studio1921@gmail.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface WebsiteStructuredDataProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebsiteStructuredData({
  name = "Kawane Studio",
  url = "https://kawanestudio.com",
  description = "Premium e-commerce platform for fashion and lifestyle products",
}: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    alternateName: ["Kawane", "Kawané", "Kawane Studio"],
    url: url,
    description: description,
    keywords: "kawane, kawane studio, kawanestudio, kawane fashion, kawane lifestyle, kawane products, kawane store, kawane brand",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

