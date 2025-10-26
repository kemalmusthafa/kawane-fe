"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAdminShipments } from "@/hooks/useApi";
import ShipmentStats from "@/components/admin/shipment-stats";
import CreateShipmentForm from "@/components/admin/create-shipment-form";
import EditShipmentForm from "@/components/admin/edit-shipment-form";

export default function AdminShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // Use API hook
  const {
    shipments,
    total,
    isLoading,
    error,
    createShipment,
    updateShipment,
    deleteShipment,
    mutate,
  } = useAdminShipments({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    carrier: carrierFilter !== "all" ? carrierFilter : undefined,
  });

  // Force refresh function to sync with backend
  const forceRefresh = () => {
    console.log("🔄 Force refreshing shipments data...");
    mutate();
  };

  const getStatusBadge = (orderStatus: string) => {
    switch (orderStatus) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "PAID":
        return <Badge variant="default">Paid</Badge>;
      case "SHIPPED":
        return <Badge variant="default">Shipped</Badge>;
      case "DELIVERED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{orderStatus}</Badge>;
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filtering
  };

  const handleCarrierFilterChange = (value: string) => {
    setCarrierFilter(value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle shipment actions
  const handleCreateShipment = async (shipmentData: any) => {
    try {
      await createShipment(shipmentData);
      // Dialog will be closed by parent component
    } catch (error) {
      console.error("Failed to create shipment:", error);
    }
  };

  const handleUpdateShipment = async (shipmentId: string, updateData: any) => {
    try {
      await updateShipment(shipmentId, updateData);
    } catch (error) {
      console.error("Failed to update shipment:", error);
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    try {
      await deleteShipment(shipmentId);
      setIsDeleteDialogOpen(false);
      setSelectedShipment(null);
      // Refresh data after successful deletion
      mutate();
    } catch (error: any) {
      console.error("Failed to delete shipment:", error);

      // Handle specific error cases
      if (
        error.message?.includes("not found") ||
        error.message?.includes("404")
      ) {
        // Shipment not found - refresh data to sync with backend
        console.log("🔄 Shipment not found, refreshing data...");
        mutate();
        setIsDeleteDialogOpen(false);
        setSelectedShipment(null);
      } else {
        // Other errors - show user-friendly message
        alert(`Failed to delete shipment: ${error.message || "Unknown error"}`);
      }
    }
  };

  // Handle view shipment
  const handleViewShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsViewDialogOpen(true);
  };

  // Handle edit shipment
  const handleEditShipment = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsDeleteDialogOpen(true);
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  if (isLoading) {
    return <AdminPageSkeleton />;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="mb-6"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-600 mt-2">
              Manage shipments and order tracking
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={forceRefresh}
              disabled={isLoading}
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Add New Shipment
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Create a new shipment record for an order.
                  </DialogDescription>
                </DialogHeader>
                <CreateShipmentForm
                  onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    mutate();
                  }}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Shipment Statistics */}
        <ShipmentStats />

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={carrierFilter}
                onValueChange={handleCarrierFilterChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
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
          </CardContent>
        </Card>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Shipments ({total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading shipments...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">
                  Error loading shipments: {error.message}
                </p>
                <Button onClick={() => mutate()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : shipments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Estimated Days</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-sm">
                            {shipment.trackingNo || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{shipment.orderId}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {shipment.order?.user?.name || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            {shipment.order?.user?.email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {shipment.courier || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          Rp {shipment.cost?.toLocaleString("id-ID") || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(shipment.order?.status || "PENDING")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{shipment.estimatedDays || 0} days</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(
                              new Date(shipment.createdAt),
                              "dd MMM yyyy",
                              {
                                locale: id,
                              }
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewShipment(shipment)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Edit Shipment"
                            onClick={() => handleEditShipment(shipment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete Shipment"
                            onClick={() => handleDeleteConfirm(shipment)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Shipments Found
                </h3>
                <p className="text-gray-600 mb-4">
                  No shipments match your current filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Shipment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipment Details - {selectedShipment?.trackingNo}
            </DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              {/* Shipment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">Courier</span>
                  </div>
                  <div className="text-sm font-medium">
                    {selectedShipment.courier}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">Cost</span>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    Rp {selectedShipment.cost?.toLocaleString("id-ID") || 0}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm">Created</span>
                  </div>
                  <div className="text-sm">
                    {format(
                      new Date(selectedShipment.createdAt),
                      "dd MMM yyyy HH:mm",
                      { locale: id }
                    )}
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Shipment Information</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Tracking Number:</span>
                      <div className="font-mono font-medium">
                        {selectedShipment.trackingNo}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Days:</span>
                      <div className="font-medium">
                        {selectedShipment.estimatedDays} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Order Information</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Order ID:</span>
                      <div className="font-mono font-medium">
                        {selectedShipment.orderId}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <div className="font-medium">
                        {selectedShipment.order?.user?.name || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <div className="font-medium">
                        {selectedShipment.order?.user?.email || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div>
                        {getStatusBadge(selectedShipment.order?.status || "PENDING")}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-600">Total Amount:</span>
                      <div className="font-semibold text-green-600">
                        Rp{" "}
                        {selectedShipment.order?.totalAmount?.toLocaleString("id-ID") || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Order Items */}
              {selectedShipment.order?.items &&
                selectedShipment.order.items.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-medium text-sm">Order Items</span>
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedShipment.order.items.map(
                          (item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {item.product?.name || "Unknown Product"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    SKU: {item.product?.sku || "N/A"}
                                    {item.size && ` | Size: ${item.size}`}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                Rp {item.price?.toLocaleString("id-ID") || 0}
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell className="font-medium">
                                Rp{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "id-ID"
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shipment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Shipment
            </DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <EditShipmentForm
              shipment={selectedShipment}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedShipment(null);
                mutate();
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedShipment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Shipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shipment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">
                      Tracking: {selectedShipment.trackingNo}
                    </div>
                    <div className="text-sm text-red-700">
                      Order: {selectedShipment.orderId}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedShipment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteShipment(selectedShipment.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
