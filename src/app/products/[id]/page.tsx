import { ProductDetail } from "@/components/home/product-detail";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail productId={params.id} />
    </div>
  );
}
