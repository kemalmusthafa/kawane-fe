"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, TrendingUp } from "lucide-react";
import { useAdminShipments } from "@/hooks/useApi";

interface ShipmentStatsProps {
  startDate?: string;
  endDate?: string;
}

export default function ShipmentStats({
  startDate,
  endDate,
}: ShipmentStatsProps) {
  const { getShipmentStats } = useAdminShipments();
  const [stats, setStats] = useState({
    totalShipments: 0,
    shipmentsByCarrier: [] as Array<{ carrier: string; count: number }>,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await getShipmentStats({ startDate, endDate });
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching shipment stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]); // Remove getShipmentStats from dependencies to prevent infinite loop

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Shipments
              </p>
              <p className="text-2xl font-bold">{stats.totalShipments}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Carriers
              </p>
              <p className="text-2xl font-bold">
                {stats.shipmentsByCarrier.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Carrier</p>
              <p className="text-lg font-bold">
                {stats.shipmentsByCarrier.length > 0
                  ? stats.shipmentsByCarrier[0].carrier
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg per Carrier
              </p>
              <p className="text-2xl font-bold">
                {stats.shipmentsByCarrier.length > 0
                  ? Math.round(
                      stats.totalShipments / stats.shipmentsByCarrier.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
