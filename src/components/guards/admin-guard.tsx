"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback,
  redirectTo = "/admin/login",
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isLoading) return;

      if (!isAuthenticated || !user) {
        router.push(redirectTo);
        return;
      }

      // Check if user has admin or staff role
      if (user.role !== "ADMIN" && user.role !== "STAFF") {
        // User is authenticated but not admin/staff
        setIsChecking(false);
        return;
      }

      // User is admin/staff
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [isAuthenticated, user, isLoading, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto mb-3 sm:mb-4 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Verifying Access
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Checking admin access rights...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Akses Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Anda harus login terlebih dahulu untuk mengakses halaman ini.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/login">Login Admin</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/home">Kembali ke Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated but not admin/staff
  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              Akses Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Anda tidak memiliki hak akses untuk mengakses dashboard admin.
                Hanya admin dan staff yang dapat mengakses halaman ini.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/login">Login sebagai Admin</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/home">Kembali ke Home</Link>
              </Button>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center">
              <p>
                <strong>Role saat ini:</strong> {user.role}
              </p>
              <p>
                <strong>Required:</strong> ADMIN atau STAFF
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is admin/staff, show protected content
  return <>{children}</>;
};

// Hook untuk check admin access
export const useAdminAccess = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";
  const isAdminOrStaff = isAdmin || isStaff;
  const hasAccess = isAuthenticated && isAdminOrStaff;

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStaff,
    isAdminOrStaff,
    hasAccess,
  };
};
