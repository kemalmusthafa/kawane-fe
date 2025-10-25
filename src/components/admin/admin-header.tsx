"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, User, LogOut, Home, Search } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSearchBar } from "./admin-search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SimpleAvatar } from "@/components/ui/simple-avatar";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b border-border dark:bg-gradient-to-r dark:from-card dark:to-muted/10 dark:border-border/50 dark:shadow-lg sticky top-0 z-20">
      <div className="flex h-14 sm:h-16 items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Left side */}
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo for mobile */}
          <div className="lg:hidden ml-1 sm:ml-2">
            <span className="text-base sm:text-lg font-bold">Kawane</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-lg">
            <AdminSearchBar />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User menu */}
          <div className="admin-header-dropdown">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <SimpleAvatar user={user} isLoading={isLoading} size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 p-2 dropdown-enhanced dropdown-positioned"
                align="start"
                sideOffset={4}
                forceMount
              >
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex items-center gap-3">
                    <SimpleAvatar user={user} isLoading={isLoading} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-none text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                        {user?.email}
                      </p>
                      <div className="mt-2">
                        <Badge
                          variant="secondary"
                          className="w-fit text-xs role-badge"
                        >
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem asChild className="px-3 py-2.5 dropdown-item">
                  <Link href="/account/profile" className="flex items-center">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-3 py-2.5 dropdown-item">
                  <Link href="/home" className="flex items-center">
                    <Home className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Kembali ke Website</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  className="px-3 py-2.5 dropdown-item text-destructive focus:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border bg-card mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
          <AdminSearchBar />
        </div>
      )}
    </header>
  );
}
