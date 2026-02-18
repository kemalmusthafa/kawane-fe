"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Home, Search, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { AdminSearchBar } from "./admin-search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SimpleAvatar } from "@/components/ui/simple-avatar";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/sign-in";
  };

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b border-border dark:bg-gradient-to-r dark:from-card dark:to-muted/10 dark:border-border/50 dark:shadow-lg sticky top-0 z-20">
      <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between gap-2 px-3 sm:px-4 md:px-6 lg:px-8 min-h-0">
        {/* Left side */}
        <div className="flex items-center flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo for mobile */}
          <div className="lg:hidden ml-1 sm:ml-2 min-w-0">
            <span className="text-sm sm:text-base font-bold truncate block">Kawane</span>
          </div>

          {/* Desktop Search - full width when sidebar collapsed */}
          <div className="hidden lg:block flex-1 min-w-0 max-w-xl">
            <AdminSearchBar />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User menu - style referensi: trigger avatar + nama/role, dropdown putih bersih */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full py-1.5 pl-1 pr-2 h-auto hover:bg-accent/50"
              >
                <SimpleAvatar user={user} isLoading={isLoading} size="md" />
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold leading-tight text-foreground">
                    {user?.name || "Admin"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn(
                "w-64 p-0 !z-[100] rounded-lg border border-border",
                "bg-white dark:bg-card shadow-lg",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[side=bottom]:slide-in-from-top-2"
              )}
              align="end"
              sideOffset={8}
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs leading-tight text-muted-foreground truncate mt-0.5">
                  {user?.email || ""}
                </p>
              </div>
              <div className="py-1.5">
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-2 py-2.5 px-3 text-sm cursor-pointer focus:bg-muted/50 outline-none"
                  >
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/home"
                    className="flex items-center gap-2 py-2.5 px-3 text-sm cursor-pointer focus:bg-muted/50 outline-none"
                  >
                    <Home className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>Kembali ke Website</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <div className="py-1.5">
                <DropdownMenuItem
                  className="flex items-center gap-2 py-2.5 px-3 text-sm cursor-pointer rounded-none text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - full width, responsive padding */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border bg-card px-3 sm:px-4 py-3 w-full">
          <AdminSearchBar className="w-full" />
        </div>
      )}
    </header>
  );
}
