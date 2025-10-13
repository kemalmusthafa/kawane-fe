"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSearchBar } from "./admin-search-bar";
import { SimpleAvatar } from "@/components/ui/simple-avatar";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  X,
  Bell,
  FileText,
  Tag,
  FolderTree,
  Camera,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Deals", href: "/admin/deals", icon: Tag },
  { name: "Lookbook", href: "/admin/lookbook", icon: Camera },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Shipments", href: "/admin/shipments", icon: Truck },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-card text-card-foreground border-r border-border shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64 dark:bg-gradient-to-b dark:from-card dark:to-muted/20 dark:border-border/50 dark:shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground dark:from-foreground dark:to-primary bg-clip-text text-transparent">
                Kawane Admin
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <SimpleAvatar user={user} isLoading={isLoading} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="px-3 py-3 border-b border-border lg:hidden">
            <AdminSearchBar />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => {
              // Improved active state detection
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative",
                    isActive
                      ? "bg-black text-white shadow-md font-semibold border-l-4 border-white"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer - Removed duplicate features, kept only essential info */}
          <div className="border-t border-border p-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Admin Panel v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
