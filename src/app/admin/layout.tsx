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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Don't apply AdminGuard to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar - bisa ciut (icon only) / full, logo by theme */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((s) => !s)}
        />

        {/* Main Content Area - margin ikut lebar sidebar */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          {/* Header - Sticky */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content - full width saat sidebar ciut/expand, tidak ada space kosong kanan */}
          <main className="flex-1 bg-background min-w-0 w-full overflow-x-hidden">
            <div className="h-full w-full min-w-0 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
