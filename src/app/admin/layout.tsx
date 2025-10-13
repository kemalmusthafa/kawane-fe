"use client";

import { AdminGuard } from "@/components/guards/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Don't apply AdminGuard to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-white text-foreground flex flex-col lg:flex-row">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 bg-white overflow-x-hidden">
            <div className="py-3 sm:py-4 lg:py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
