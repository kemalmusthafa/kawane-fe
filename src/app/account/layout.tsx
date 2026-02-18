import { HomeNavigation } from "@/components/home/navigation";
import { HomeFooter } from "@/components/home/footer";
import { AccountSidebar } from "@/components/home/account-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavigation />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <AccountSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
