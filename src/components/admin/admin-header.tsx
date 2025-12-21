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
    window.location.href = "/auth/sign-in";
  };

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b border-border dark:bg-gradient-to-r dark:from-card dark:to-muted/10 dark:border-border/50 dark:shadow-lg sticky top-0 z-20">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <SimpleAvatar user={user} isLoading={isLoading} size="md" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 !z-[100]"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <SimpleAvatar user={user} isLoading={isLoading} size="md" />
                  <div className="flex flex-col space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                    {user?.role && (
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/home" className="flex items-center cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Kembali ke Website</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 sm:px-6 py-3">
          <AdminSearchBar />
        </div>
      )}
    </header>
  );
}
