"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Package } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { apiClient } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [webhookCalled, setWebhookCalled] = useState(false);
  const webhookCalledRef = useRef(false);

  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");
  const redirect = searchParams.get("redirect");

  // Handle redirect separately to avoid setState during render
  const handleRedirect = useCallback(() => {
    if (redirect === "home") {
      router.push("/");
    } else {
      router.push("/");
    }
  }, [router, redirect]);

  // Handle webhook call separately
  const handleWebhookCall = useCallback(async () => {
    if (!orderId || webhookCalledRef.current) return;

    webhookCalledRef.current = true;
    setWebhookCalled(true);

    // Only call webhook if using ngrok (not localhost)
    const isLocalhost = process.env.NEXT_PUBLIC_APP_URL?.includes("localhost");

    if (!isLocalhost) {
      try {
        // Call development webhook endpoint via ngrok
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
          }/payments/dev-webhook`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: orderId,
              transaction_status: "settlement",
              status_code: "200",
              gross_amount: "400000",
              transaction_id: `txn_${Date.now()}`,
              payment_type: "credit_card",
              transaction_time: new Date().toISOString(),
              _bypassSignature: true, // Bypass signature verification for dev
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
          } else {
            console.error("Failed to update payment status:", result.message);
          }
        } else {
          console.error("Failed to update payment status");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    } else {
    }
  }, [orderId]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Call webhook once
    if (orderId && !webhookCalled) {
      handleWebhookCall();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [orderId, webhookCalled, handleWebhookCall]);

  // Separate effect for countdown timer
  useEffect(() => {
    if (isLoading) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isLoading, handleRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  Thank you! Your order has been successfully created and
                  payment has been processed.
                </p>
                {orderId && (
                  <p className="text-sm text-gray-500">
                    Order Number: <span className="font-mono">{orderId}</span>
                  </p>
                )}
                <p className="text-sm text-blue-600 font-medium">
                  Automatically returning to homepage in {countdown} seconds...
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium">Next Steps</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>
                    • You will receive a confirmation email in a few minutes
                  </li>
                  <li>• Order will be processed within 1-2 business days</li>
                  <li>• You will be notified when the order is shipped</li>
                  <li>• Use order number to track shipping status</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/account/orders">View My Orders</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-gray-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
