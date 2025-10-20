import { HomeNavigation } from "@/components/home/navigation";
import { HomeFooter } from "@/components/home/footer";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavigation />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
