"use client";

import { useState, useEffect } from "react";
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
import { useAdminShipments } from "@/hooks/useApi";
import { toast } from "sonner";
import { Loader2, Package, Truck, Save, X } from "lucide-react";

interface EditShipmentFormProps {
  shipment: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditShipmentForm({
  shipment,
  onSuccess,
  onCancel,
}: EditShipmentFormProps) {
  const { updateShipment } = useAdminShipments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courier: "",
    method: "STANDARD",
    trackingNo: "",
    cost: "",
    estimatedDays: "",
    notes: "",
  });

  // Initialize form data when shipment changes
  useEffect(() => {
    if (shipment) {
      setFormData({
        courier: shipment.courier || "",
        method: shipment.method || "STANDARD",
        trackingNo: shipment.trackingNo || "",
        cost: shipment.cost?.toString() || "",
        estimatedDays: shipment.estimatedDays?.toString() || "",
        notes: shipment.notes || "",
      });
    }
  }, [shipment]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        courier: formData.courier,
        method: formData.method,
        trackingNo: formData.trackingNo,
        cost: parseFloat(formData.cost) || 0,
        estimatedDays: parseInt(formData.estimatedDays) || 0,
        notes: formData.notes,
      };

      await updateShipment(shipment.id, updateData);
      toast.success("Shipment updated successfully!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating shipment:", error);
      toast.error(error.message || "Failed to update shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const courierOptions = [
    "JNE",
    "J&T",
    "TIKI",
    "POS Indonesia",
    "SiCepat",
    "AnterAja",
    "GrabExpress",
    "Lion Parcel",
    "Ninja Xpress",
    "SAP Express",
  ];

  const methodOptions = [
    { value: "STANDARD", label: "Standard" },
    { value: "EXPRESS", label: "Express" },
    { value: "OVERNIGHT", label: "Overnight" },
    { value: "SAME_DAY", label: "Same Day" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-pragmatica">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm font-semibold">
            <Truck className="w-4 h-4 mr-2" />
            Edit Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Information (Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-sm">Order Information</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <div className="font-mono font-medium">
                    {shipment?.orderId}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <div className="font-medium">
                    {shipment?.order?.user?.name || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Selection */}
          <div className="space-y-2">
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
                {courierOptions.map((courier) => (
                  <SelectItem key={courier} value={courier}>
                    {courier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="method">Shipping Method *</Label>
            <Select
              value={formData.method}
              onValueChange={(value) => handleInputChange("method", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Number */}
          <div className="space-y-2">
            <Label htmlFor="trackingNo">Tracking Number *</Label>
            <Input
              id="trackingNo"
              type="text"
              value={formData.trackingNo}
              onChange={(e) => handleInputChange("trackingNo", e.target.value)}
              placeholder="Enter tracking number"
              required
              className="font-mono"
            />
          </div>

          {/* Cost and Estimated Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-xs font-medium">
                Shipping Cost (Rp)
              </Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="0"
                min="0"
                step="1000"
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDays" className="text-xs font-medium">
                Estimated Days *
              </Label>
              <Input
                id="estimatedDays"
                type="number"
                value={formData.estimatedDays}
                onChange={(e) =>
                  handleInputChange("estimatedDays", e.target.value)
                }
                placeholder="3"
                min="1"
                max="30"
                required
                className="text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about the shipment"
              rows={3}
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Updating..." : "Update Shipment"}
        </Button>
      </div>
    </form>
  );
}
