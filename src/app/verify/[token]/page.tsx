"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api";

interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    user?: {
      id: string;
      email: string;
      name: string;
      isVerified: boolean;
    };
  };
}

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = params.token as string;

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError("Invalid verification link");
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.verifyEmail(token);
      setResult(data as VerifyResponse);
    } catch (err: any) {
      setError(err.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    verifyEmail();
  };

  const handleLogin = () => {
    router.push("/auth/sign-in");
  };

  const handleHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Verifying your email...</p>
              <p className="text-sm text-gray-600 text-center">
                Please wait while we verify your email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                onClick={handleRetry}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleHome} className="w-full" variant="ghost">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result?.data?.message === "Email already verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <CheckCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Already Verified</CardTitle>
            <CardDescription>
              Your email has already been verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {result.data.user?.email} is already verified and ready to use.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button onClick={handleLogin} className="w-full">
                Sign In to Your Account
              </Button>
              <Button onClick={handleHome} className="w-full" variant="ghost">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {result?.data?.user?.email} is now verified and ready to use.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button onClick={handleLogin} className="w-full">
              Sign In to Your Account
            </Button>
            <Button onClick={handleHome} className="w-full" variant="ghost">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
