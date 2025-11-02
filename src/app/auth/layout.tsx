import { HomeFooter } from "@/components/home/footer";
import { HomeNavigation } from "@/components/home/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavigation />
      <main className="flex-1">{children}</main>
      <HomeFooter />
    </div>
  );
}
