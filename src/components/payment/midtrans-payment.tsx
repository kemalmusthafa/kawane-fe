"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CreditCard, Smartphone, Building2 } from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

interface MidtransPaymentProps {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onPending?: (result: any) => void;
}

export default function MidtransPayment({
  orderId,
  amount,
  customerDetails,
  onSuccess,
  onError,
  onPending,
}: MidtransPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnapLoaded, setIsSnapLoaded] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction =
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

  useEffect(() => {
    if (!midtransClientKey) {
      console.error("Midtrans Client Key not found in environment variables");
      return;
    }

    // Load Midtrans Snap script
    const script = document.createElement("script");
    script.src = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.snap) {
        setIsSnapLoaded(true);
        // Set available payment methods
        setPaymentMethods([
          "credit_card",
          "bca_va",
          "bni_va",
          "bri_va",
          "echannel",
          "permata_va",
          "gopay",
          "shopeepay",
          "qris",
        ]);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      const existingScript = document.querySelector(
        `script[src*="midtrans.com/snap/snap.js"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [midtransClientKey, isProduction]);

  const handlePayment = async (paymentMethod: string) => {
    if (!isSnapLoaded) {
      toast.error("Payment gateway belum siap, silakan coba lagi");
      return;
    }

    setIsLoading(true);
    try {
      // Get payment token from backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/midtrans-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            orderId,
            amount,
            customerDetails,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      console.log("=== MIDTRANS FRONTEND DEBUG ===");
      console.log("API Response:", data);
      console.log("Token:", data.data?.token);
      console.log("Success:", data.success);
      console.log("===============================");

      if (data.success && data.data.token) {
        // Open Midtrans payment popup
        window.snap.pay(data.data.token, {
          onSuccess: (result: any) => {
            toast.success("Pembayaran berhasil!");
            if (onSuccess) {
              onSuccess(result);
            }
          },
          onPending: (result: any) => {
            toast.info("Pembayaran sedang diproses");
            if (onPending) {
              onPending(result);
            }
          },
          onError: (result: any) => {
            toast.error("Pembayaran gagal");
            if (onError) {
              onError(result);
            }
          },
          onClose: () => {
            toast.info("Pembayaran dibatalkan");
          },
        });
      } else {
        throw new Error(data.message || "Gagal mendapatkan token pembayaran");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat memproses pembayaran"
      );

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodInfo = (method: string) => {
    const methods = {
      credit_card: {
        name: "Credit Card",
        icon: CreditCard,
        description: "Visa, Mastercard, JCB",
      },
      bca_va: {
        name: "BCA Virtual Account",
        icon: Building2,
        description: "Transfer ke BCA VA",
      },
      bni_va: {
        name: "BNI Virtual Account",
        icon: Building2,
        description: "Transfer ke BNI VA",
      },
      bri_va: {
        name: "BRI Virtual Account",
        icon: Building2,
        description: "Transfer ke BRI VA",
      },
      echannel: {
        name: "Mandiri E-Channel",
        icon: Building2,
        description: "ATM Mandiri",
      },
      permata_va: {
        name: "Permata Virtual Account",
        icon: Building2,
        description: "Transfer ke Permata VA",
      },
      gopay: {
        name: "GoPay",
        icon: Smartphone,
        description: "Bayar dengan GoPay",
      },
      shopeepay: {
        name: "ShopeePay",
        icon: Smartphone,
        description: "Bayar dengan ShopeePay",
      },
      qris: {
        name: "QRIS",
        icon: Smartphone,
        description: "Scan QR Code",
      },
    };
    return (
      methods[method as keyof typeof methods] || {
        name: method,
        icon: CreditCard,
        description: "",
      }
    );
  };

  if (!midtransClientKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Midtrans tidak dikonfigurasi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Metode Pembayaran</CardTitle>
        <p className="text-sm text-gray-600">Total: {formatCurrency(amount)}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const methodInfo = getPaymentMethodInfo(method);
            const Icon = methodInfo.icon;

            return (
              <Button
                key={method}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={() => handlePayment(method)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{methodInfo.name}</span>
                </div>
                <p className="text-xs text-gray-600 text-left">
                  {methodInfo.description}
                </p>
              </Button>
            );
          })}
        </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Memproses pembayaran...</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Catatan:</strong> Ini adalah mode{" "}
            {isProduction ? "Production" : "Sandbox"}.
            {!isProduction && " Gunakan kartu test untuk pembayaran."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
