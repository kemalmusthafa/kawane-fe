"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [router]);

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
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-yellow-600">
                Payment Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  Your payment is being processed. We will send a confirmation
                  via email after the payment is successful.
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

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium">Payment Status</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Payment is being processed by the bank</li>
                  <li>• You will receive a confirmation email</li>
                  <li>• Order will be processed after payment is successful</li>
                  <li>• If payment fails, the order will be cancelled</li>
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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPendingContent />
    </Suspense>
  );
}
