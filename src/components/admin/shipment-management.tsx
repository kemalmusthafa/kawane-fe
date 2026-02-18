"use client";

import { useState } from "react";
import { useShipments, useOrders } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Eye,
  Edit,
} from "lucide-react";

export default function ShipmentManagement() {
  const { shipments, error, isLoading, createShipment, updateShipment } =
    useShipments();
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [createForm, setCreateForm] = useState({
    orderId: "",
    trackingNo: "",
    carrier: "",
    method: "",
    estimatedDelivery: "",
    notes: "",
  });
  const [updateForm, setUpdateForm] = useState({
    status: "PENDING" as "PENDING" | "DELIVERED" | "IN_TRANSIT",
    trackingNo: "",
    carrier: "",
    estimatedDelivery: "",
    notes: "",
  });

  const filteredShipments =
    shipments?.filter((shipment) => {
      const matchesSearch =
        shipment.trackingNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || shipment.order?.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "default";
      case "IN_TRANSIT":
        return "default";
      case "DELIVERED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "PROCESSING":
        return <Package className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "IN_TRANSIT":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleCreateShipment = async () => {
    if (!createForm.orderId || !createForm.trackingNo || !createForm.carrier) {
      toast.error("Order ID, Tracking Number, dan Carrier harus diisi");
      return;
    }

    try {
      const response = await createShipment({
        orderId: createForm.orderId,
        trackingNumber: createForm.trackingNo,
        carrier: createForm.carrier,
        method: createForm.method,
        estimatedDelivery: createForm.estimatedDelivery,
        notes: createForm.notes,
      });

      if (response.success) {
        toast.success("Shipment berhasil dibuat");
        setIsCreateDialogOpen(false);
        setCreateForm({
          orderId: "",
          trackingNo: "",
          carrier: "",
          method: "",
          estimatedDelivery: "",
          notes: "",
        });
      } else {
        toast.error("Gagal membuat shipment");
      }
    } catch (error) {
      toast.error("Gagal membuat shipment");
    }
  };

  const handleUpdateShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setUpdateForm({
      status: shipment.status as "PENDING" | "DELIVERED" | "IN_TRANSIT",
      trackingNo: shipment.trackingNo || "",
      carrier: shipment.carrier || "",
      estimatedDelivery: shipment.estimatedDelivery || "",
      notes: shipment.notes || "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = async () => {
    if (!selectedShipment) return;

    try {
      const response = await updateShipment(selectedShipment.id, updateForm);
      if (response.success) {
        toast.success("Shipment berhasil diperbarui");
        setIsUpdateDialogOpen(false);
        setSelectedShipment(null);
      } else {
        toast.error("Gagal memperbarui shipment");
      }
    } catch (error) {
      toast.error("Gagal memperbarui shipment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading shipments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipment Management</h1>
          <p className="text-gray-600">Kelola pengiriman dan tracking order</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="order-id">Order ID</Label>
                <Select
                  value={createForm.orderId}
                  onValueChange={(value) =>
                    setCreateForm({ ...createForm, orderId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders?.map((order: any) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.product?.name || "Product"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <Input
                  id="tracking-number"
                  value={createForm.trackingNo}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      trackingNo: e.target.value,
                    })
                  }
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <Label htmlFor="carrier">Carrier</Label>
                <Input
                  id="carrier"
                  value={createForm.carrier}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, carrier: e.target.value })
                  }
                  placeholder="Enter carrier name"
                />
              </div>

              <div>
                <Label htmlFor="method">Method</Label>
                <Input
                  id="method"
                  value={createForm.method}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, method: e.target.value })
                  }
                  placeholder="Enter shipping method"
                />
              </div>

              <div>
                <Label htmlFor="estimated-delivery">Estimated Delivery</Label>
                <Input
                  id="estimated-delivery"
                  type="date"
                  value={createForm.estimatedDelivery}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      estimatedDelivery: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={createForm.notes}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, notes: e.target.value })
                  }
                  placeholder="Enter notes (optional)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateShipment}>Create Shipment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by tracking number or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No shipments found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No shipments have been created yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {getStatusIcon(shipment.order?.status || "PENDING")}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">
                          {shipment.trackingNo || "No tracking number"}
                        </h3>
                        <Badge
                          variant={getStatusBadgeVariant(
                            shipment.order?.status || "PENDING"
                          )}
                        >
                          {shipment.order?.status || "PENDING"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Package className="h-4 w-4" />
                          <span>Order: {shipment.orderId}</span>
                        </div>
                        {shipment.courier && (
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4" />
                            <span>{shipment.courier}</span>
                          </div>
                        )}
                        {shipment.estimatedDays && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>ETA: {shipment.estimatedDays} days</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {format(
                          new Date(shipment.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateShipment(shipment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Shipment Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="update-status">Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(
                  value: "PENDING" | "DELIVERED" | "IN_TRANSIT"
                ) => setUpdateForm({ ...updateForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="update-tracking">Tracking Number</Label>
              <Input
                id="update-tracking"
                value={updateForm.trackingNo}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    trackingNo: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="update-carrier">Carrier</Label>
              <Input
                id="update-carrier"
                value={updateForm.carrier}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, carrier: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="update-delivery">Estimated Delivery</Label>
              <Input
                id="update-delivery"
                type="date"
                value={updateForm.estimatedDelivery}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    estimatedDelivery: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="update-notes">Notes</Label>
              <Input
                id="update-notes"
                value={updateForm.notes}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, notes: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitUpdate}>Update Shipment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
