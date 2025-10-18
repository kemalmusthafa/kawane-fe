"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminShipments, useAdminOrders } from "@/hooks/useApi";
import { toast } from "sonner";
import { Loader2, Package, Truck } from "lucide-react";
import { Order } from "@/types/order";

interface CreateShipmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateShipmentForm({
  onSuccess,
  onCancel,
}: CreateShipmentFormProps) {
  const { createShipment } = useAdminShipments();
  const { orders } = useAdminOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    courier: "",
    method: "STANDARD",
    trackingNo: "",
    cost: "",
    estimatedDays: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orderId || !formData.courier || !formData.method) {
      toast.error("Order ID, Courier, and Method are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createShipment({
        orderId: formData.orderId,
        courier: formData.courier,
        method: formData.method,
        trackingNo: formData.trackingNo || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        estimatedDays: formData.estimatedDays
          ? parseInt(formData.estimatedDays)
          : undefined,
      });

      if (response.success) {
        toast.success("Shipment created successfully");
        setFormData({
          orderId: "",
          courier: "",
          method: "STANDARD",
          trackingNo: "",
          cost: "",
          estimatedDays: "",
          notes: "",
        });
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to create shipment");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter orders that are ready for shipment (PAID status and no existing shipment)
  const availableOrders =
    orders?.filter((order: any) => {
      // ✅ FIXED: More flexible filtering with proper enum values
      const isReadyForShipment =
        order.status === "PAID" ||
        order.status === "COMPLETED" ||
        order.status === "SHIPPED" ||
        (order.status === "PENDING" &&
          (order.paymentStatus === "SUCCEEDED" ||
            order.paymentStatus === "PAID"));

      const hasNoShipment = !order.shipment;

      console.log("🔍 Order filtering:", {
        orderId: order.id,
        status: order.status,
        paymentStatus: (order as any).paymentStatus,
        hasShipment: !!order.shipment,
        isReadyForShipment,
        hasNoShipment,
        willInclude: isReadyForShipment && hasNoShipment,
      });

      return isReadyForShipment && hasNoShipment;
    }) || [];

  // ✅ DEBUG: Log orders for debugging
  console.log("All orders:", orders);
  console.log("Available orders for shipment:", availableOrders);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Create New Shipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderId">Order ID *</Label>
              <Select
                value={formData.orderId}
                onValueChange={(value) => handleInputChange("orderId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {availableOrders.map((order: any) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.user?.name} - Rp{" "}
                      {order.totalAmount.toLocaleString("id-ID")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableOrders.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No orders ready for shipment
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="courier">Courier *</Label>
              <Select
                value={formData.courier}
                onValueChange={(value) => handleInputChange("courier", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JNE">JNE</SelectItem>
                  <SelectItem value="J&T">J&T</SelectItem>
                  <SelectItem value="TIKI">TIKI</SelectItem>
                  <SelectItem value="POS Indonesia">POS Indonesia</SelectItem>
                  <SelectItem value="SiCepat">SiCepat</SelectItem>
                  <SelectItem value="AnterAja">AnterAja</SelectItem>
                  <SelectItem value="GrabExpress">GrabExpress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="method">Shipping Method *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => handleInputChange("method", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard (3-5 days)</SelectItem>
                  <SelectItem value="EXPRESS">Express (1-2 days)</SelectItem>
                  <SelectItem value="OVERNIGHT">Overnight (1 day)</SelectItem>
                  <SelectItem value="SAME_DAY">Same Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trackingNo">Tracking Number</Label>
              <Input
                id="trackingNo"
                placeholder="Enter tracking number"
                value={formData.trackingNo}
                onChange={(e) =>
                  handleInputChange("trackingNo", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="cost">Shipping Cost (Rp)</Label>
              <Input
                id="cost"
                type="number"
                placeholder="0"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedDays">Estimated Delivery Days</Label>
            <Input
              id="estimatedDays"
              type="number"
              placeholder="3"
              value={formData.estimatedDays}
              onChange={(e) =>
                handleInputChange("estimatedDays", e.target.value)
              }
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.orderId ||
                !formData.courier ||
                !formData.method
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Shipment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
