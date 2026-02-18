"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

interface OrderTrackingData {
  orderId: string;
  orderNumber: string;
  sku: string;
  productName: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const sku = searchParams.get("sku");

  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  const [searchSku, setSearchSku] = useState(sku || "");

  const fetchTrackingData = async (orderId: string, sku?: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call a tracking API
      // For now, we'll simulate the data
      const mockData: OrderTrackingData = {
        orderId,
        orderNumber: `ORD-${orderId.slice(-6).toUpperCase()}`,
        sku: sku || "KWN-TSH-001",
        productName: "Basic T-Shirt",
        status: "shipped",
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        trackingNumber: "TRK123456789",
        shippingAddress: {
          street: "Jl. Contoh No. 123",
          city: "Jakarta",
          postalCode: "12345",
          country: "Indonesia",
        },
        timeline: [
          {
            status: "pending",
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            description: "Pesanan diterima dan sedang diproses",
          },
          {
            status: "processing",
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            description: "Pesanan sedang disiapkan",
          },
          {
            status: "shipped",
            timestamp: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            description: "Pesanan telah dikirim",
          },
        ],
      };

      setTrackingData(mockData);
    } catch (error) {
      toast.error("Gagal mengambil data tracking");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchTrackingData(orderId, sku || undefined);
    }
  }, [orderId, sku]);

  const handleSearch = () => {
    if (!searchOrderId.trim()) {
      toast.error("Masukkan Order ID");
      return;
    }
    fetchTrackingData(searchOrderId, searchSku || undefined);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tracking Pesanan
          </h1>
          <p className="text-gray-600">
            Lacak status pesanan Anda menggunakan Order ID atau SKU
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cari Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="Masukkan Order ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Opsional)</Label>
                <Input
                  id="sku"
                  value={searchSku}
                  onChange={(e) => setSearchSku(e.target.value.toUpperCase())}
                  placeholder="KWN-TSH-001"
                  className="uppercase"
                />
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Cari Pesanan
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detail Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold">{trackingData.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SKU</p>
                    <p className="font-semibold font-mono">
                      {trackingData.sku}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Produk</p>
                    <p className="font-semibold">{trackingData.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trackingData.status)}
                      {getStatusBadge(trackingData.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Timeline Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            {trackingData.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Alamat Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>{trackingData.shippingAddress.street}</p>
                    <p>
                      {trackingData.shippingAddress.city},{" "}
                      {trackingData.shippingAddress.postalCode}
                    </p>
                    <p>{trackingData.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tracking Number */}
            {trackingData.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle>Nomor Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-lg">
                    {trackingData.trackingNumber}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Gunakan nomor ini untuk melacak pengiriman di website kurir
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* No Results */}
        {!trackingData && !isLoading && orderId && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pesanan Tidak Ditemukan
              </h3>
              <p className="text-gray-600">
                Order ID atau SKU yang Anda masukkan tidak ditemukan.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
