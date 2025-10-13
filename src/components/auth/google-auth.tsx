"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";

interface GoogleAuthProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  text?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function GoogleAuth({
  onSuccess,
  onError,
  text = "Continue with Google",
  variant = "outline",
  size = "default",
  className = "",
}: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin } = useAuth();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        const result = await googleLogin(response.code);
        if (result.success) {
          toast.success("Login berhasil! Selamat datang! ✅");

          // Call success callback without page reload
          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error(result.message || "Google login gagal");
        }
      } catch (error: any) {
        console.error("Google Login Error:", error);
        toast.error(error.message || "Silakan coba lagi.");
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth Error:", error);
      toast.error("Terjadi kesalahan saat login dengan Google.");
      setIsLoading(false);
      if (onError) {
        onError(error);
      }
    },
  });

  if (!googleClientId) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        Google Auth tidak dikonfigurasi
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {text}
        </>
      )}
    </Button>
  );
}
