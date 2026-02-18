import { DealDetail } from "@/components/home/deal-detail";

interface DealDetailPageProps {
  params: {
    id: string;
  };
}

export default function DealDetailPage({ params }: DealDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DealDetail dealId={params.id} />
    </div>
  );
}
