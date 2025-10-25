"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Home,
  LogOut,
  ShoppingBag,
  UserPlus,
  MapPin,
  Bell,
  Package,
  Phone,
  Tag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { apiClient, type User } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/home/search-bar";
import { SearchOverlay } from "@/components/home/search-overlay";
import { AlmzvSearchBar } from "@/components/home/almzv-search-bar";
import { AnimatedBannerCarousel } from "@/components/home/animated-banner-carousel";
import { useBanners } from "@/hooks/useBanners";

export function HomeNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { banners, autoScrollInterval, scrollThreshold } = useBanners();

  useEffect(() => {
    setCurrentUser(user as User | null);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    router.push("/auth/sign-in");
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/80 border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <AnimatedBannerCarousel
        banners={banners}
        autoScrollInterval={autoScrollInterval}
        scrollSpeed={30}
        scrollThreshold={scrollThreshold}
      />

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            aria-label="Kawane Home"
          >
            <Image
              src="/logo-hitam.png"
              alt="Kawane"
              width={120}
              height={20}
              className="block h-4 sm:h-5 w-auto object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo-putih.png"
              alt="Kawane"
              width={120}
              height={20}
              className="hidden dark:block h-4 sm:h-5 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-pragmatica font-[600] tracking-[0.06em] uppercase text-[13px] transition-all duration-300 pt-2">
            <Link
              href="/products"
              className="text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary transition-colors duration-200 nav-link-underline"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary transition-colors duration-200 nav-link-underline"
            >
              Contact
            </Link>
            <Link
              href="/deals"
              className="text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary transition-colors duration-200 nav-link-underline"
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary transition-colors duration-200 nav-link-underline"
            >
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4 sm:mx-6 pt-2">
            <AlmzvSearchBar />
          </div>

          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0 pt-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  {currentUser && wishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {currentUser && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            {isLoading ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                disabled
              >
                <Skeleton className="h-8 w-8 rounded-full" />
              </Button>
            ) : currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserAvatar
                      avatar={currentUser.avatar}
                      name={currentUser.name}
                      isVerified={currentUser.isVerified}
                      size="md"
                      showVerifiedBadge={false}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={4}
                  alignOffset={0}
                  className="w-64 p-2 dropdown-enhanced dropdown-positioned"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatar={currentUser.avatar}
                        name={currentUser.name}
                        isVerified={currentUser.isVerified}
                        size="md"
                        showVerifiedBadge={false}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium role-badge">
                            {currentUser.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />

                  {/* Dashboard untuk Admin/Staff */}
                  {(currentUser?.role === "ADMIN" ||
                    currentUser?.role === "STAFF") && (
                    <DropdownMenuItem
                      asChild
                      className="px-3 py-2.5 dropdown-item"
                    >
                      <Link href="/admin" className="flex items-center">
                        <Home className="mr-3 h-4 w-4 text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    asChild
                    className="px-3 py-2.5 rounded-md hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors"
                  >
                    <Link href="/account/profile" className="flex items-center">
                      <UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="px-3 py-2.5 dropdown-item text-destructive focus:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/auth/sign-in">
                  <UserIcon className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Mobile Cart */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {currentUser && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-64 sm:w-72 p-0 mobile-sidebar"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-3 sm:p-4 lg:p-6 pb-3 sm:pb-4 mobile-sidebar-header border-b border-border/20">
                    <h2 className="text-sm sm:text-base font-semibold">Menu</h2>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mobile-sidebar-content overflow-y-auto">
                    {/* User Profile Section */}
                    {currentUser && (
                      <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-muted/50 rounded-lg border border-border/50">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <UserAvatar
                            avatar={currentUser.avatar}
                            name={currentUser.name}
                            isVerified={currentUser.isVerified}
                            size="sm"
                            showVerifiedBadge={false}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {currentUser.email}
                            </p>
                            <div className="mt-0.5 sm:mt-1">
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium role-badge">
                                {currentUser.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg border border-border/30">
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                          Dark Mode
                        </span>
                        <ThemeToggle />
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/50 dark:hover:bg-accent/30 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 py-2 sm:py-3"
                        asChild
                      >
                        <Link href="/wishlist">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Wishlist
                            </span>
                            {currentUser && wishlistItems > 0 && (
                              <span className="ml-auto bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                {wishlistItems}
                              </span>
                            )}
                          </div>
                        </Link>
                      </Button>

                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                      <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
                        Navigation
                      </h3>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/50 dark:hover:bg-accent/30 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 py-2 sm:py-3"
                        asChild
                      >
                        <Link
                          href="/products"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Products
                            </span>
                          </div>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/50 dark:hover:bg-accent/30 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 py-2 sm:py-3"
                        asChild
                      >
                        <Link
                          href="/contact"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Contact
                            </span>
                          </div>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/50 dark:hover:bg-accent/30 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 py-2 sm:py-3"
                        asChild
                      >
                        <Link
                          href="/deals"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Deals
                            </span>
                          </div>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/50 dark:hover:bg-accent/30 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 py-2 sm:py-3"
                        asChild
                      >
                        <Link
                          href="/about"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              About
                            </span>
                          </div>
                        </Link>
                      </Button>
                    </nav>

                    {/* User Actions */}
                    {currentUser ? (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50 space-y-1.5 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
                          Account
                        </h3>

                        {/* Dashboard untuk Admin/Staff */}
                        {(currentUser?.role === "ADMIN" ||
                          currentUser?.role === "STAFF") && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start py-2 sm:py-3 hover:bg-accent/50 dark:hover:bg-accent/30"
                            asChild
                          >
                            <Link
                              href="/admin"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary" />
                              <span className="text-xs sm:text-sm text-foreground">
                                Dashboard
                              </span>
                            </Link>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          className="w-full justify-start py-2 sm:py-3 hover:bg-accent/50 dark:hover:bg-accent/30"
                          asChild
                        >
                          <Link
                            href="/account/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Profile
                            </span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start py-2 sm:py-3 text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                          <span className="text-xs sm:text-sm">Logout</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50 space-y-1.5 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
                          Account
                        </h3>
                        <Button
                          variant="ghost"
                          className="w-full justify-start py-2 sm:py-3 hover:bg-accent/50 dark:hover:bg-accent/30"
                          asChild
                        >
                          <Link
                            href="/auth/sign-in"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Sign In
                            </span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start py-2 sm:py-3 hover:bg-accent/50 dark:hover:bg-accent/30"
                          asChild
                        >
                          <Link
                            href="/auth/sign-up"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-foreground">
                              Sign Up
                            </span>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
