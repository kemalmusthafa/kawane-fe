"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Loader2, Package, User, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      product: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
      subtotal: number;
    }>;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    createdAt: string;
    updatedAt: string;
  } | null;
  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<{ success: boolean; error?: string }>;
  onUpdatePaymentStatus: (
    orderId: string,
    status: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export function OrderDetails({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onUpdatePaymentStatus,
}: OrderDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHECKOUT":
        return <Badge className="bg-blue-100 text-blue-800">Checkout</Badge>;
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "SHIPPED":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "WHATSAPP_PENDING":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            WhatsApp Pending
          </Badge>
        );
      case "WHATSAPP_CONFIRMED":
        return (
          <Badge className="bg-teal-100 text-teal-800">
            WhatsApp Confirmed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleUpdateOrderStatus = async () => {
    if (!order || !newOrderStatus) return;

    setIsUpdating(true);
    try {
      const result = await onUpdateStatus(order.id, newOrderStatus);
      if (result.success) {
        toast.success("Order status updated successfully");
        setNewOrderStatus("");
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!order || !newPaymentStatus) return;

    setIsUpdating(true);
    try {
      const result = await onUpdatePaymentStatus(order.id, newPaymentStatus);
      if (result.success) {
        toast.success("Payment status updated successfully");
        setNewPaymentStatus("");
      } else {
        toast.error(result.error || "Failed to update payment status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualUpdateOrderStatus = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const result = await onUpdateStatus(order.id, "PAID");
      if (result.success) {
        toast.success("Order status updated to PAID successfully");
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-sm">Customer</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{order.user.name}</div>
                <div className="text-gray-600">{order.user.email}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-sm">Order Date</span>
              </div>
              <div className="text-sm">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-sm">Total Amount</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Order Status</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex gap-2">
                <Select
                  value={newOrderStatus}
                  onValueChange={setNewOrderStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update order status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHECKOUT">Checkout</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="WHATSAPP_PENDING">
                      WhatsApp Pending
                    </SelectItem>
                    <SelectItem value="WHATSAPP_CONFIRMED">
                      WhatsApp Confirmed
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleUpdateOrderStatus}
                  disabled={!newOrderStatus || isUpdating}
                >
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManualUpdateOrderStatus}
                  disabled={isUpdating}
                  className="ml-2"
                >
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Mark as PAID
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Status</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <div className="flex gap-2">
                <Select
                  value={newPaymentStatus}
                  onValueChange={setNewPaymentStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleUpdatePaymentStatus}
                  disabled={!newPaymentStatus || isUpdating}
                >
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Shipping Address</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-2">
            <span className="font-medium">Order Items</span>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {item.product.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(item.product.price)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
