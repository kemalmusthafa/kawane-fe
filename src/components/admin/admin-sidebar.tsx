"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminSearchBar } from "./admin-search-bar";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  BarChart3,
  X,
  Tag,
  FolderTree,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
];

export function AdminSidebar({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const logoSrc = isDark ? "/logo-putih.png" : "/logo-hitam.png";

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </div>
      )}

      {/* Sidebar - lebar berubah: ciut (w-20) / full (w-64) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card text-card-foreground border-r border-border shadow-lg transition-[width] duration-300 ease-in-out lg:shadow-none dark:bg-gradient-to-b dark:from-card dark:to-muted/20 dark:border-border/50",
          "w-64",
          collapsed && "lg:w-20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo (disembunyikan saat ciut) + toggle */}
          <div
            className={cn(
              "flex h-14 lg:h-16 items-center border-b border-border shrink-0 gap-1 transition-all duration-300",
              collapsed ? "justify-center px-0" : "justify-between pl-4 pr-1"
            )}
          >
            {!collapsed && (
              <Link
                href="/admin"
                className="flex flex-1 min-w-0 items-center overflow-hidden transition-opacity hover:opacity-90"
              >
                <Image
                  src={logoSrc}
                  alt="Kawane"
                  width={120}
                  height={28}
                  className="object-contain object-left"
                />
              </Link>
            )}
            <div className="flex items-center shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex h-9 w-9"
                  onClick={onToggleCollapse}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar - disembunyikan saat ciut */}
          {!collapsed && (
            <div className="px-3 py-3 border-b border-border lg:hidden">
              <AdminSearchBar />
            </div>
          )}

          {/* Navigation: ciut = icon only, full = icon + nama */}
          <nav className="flex-1 space-y-1 py-4 overflow-y-auto overflow-x-hidden px-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "group flex items-center rounded-lg transition-all duration-200 relative",
                    collapsed
                      ? "justify-center px-0 py-2.5 lg:py-2"
                      : "px-3 py-3 sm:py-2.5 text-sm font-medium min-h-[44px] sm:min-h-0 touch-manipulation",
                    isActive
                      ? "bg-black !text-white shadow-md font-semibold border-l-4 border-white dark:bg-primary dark:border-white dark:!text-white [&_span]:!text-white"
                      : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  )}
                >
                  {IconComponent ? (
                    <IconComponent
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-colors",
                        !collapsed && "mr-3",
                        isActive
                          ? "!text-white"
                          : "text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100"
                      )}
                    />
                  ) : null}
                  {!collapsed && (
                    <span className={cn("truncate", isActive && "!text-white")}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
