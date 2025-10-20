"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, Truck, CreditCard } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2024-01-15",
    status: "COMPLETED",
    total: 299.99,
    payment: "PAID",
    shipping: "DELIVERED",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2024-01-14",
    status: "SHIPPED",
    total: 149.99,
    payment: "PAID",
    shipping: "IN_TRANSIT",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    date: "2024-01-13",
    status: "PROCESSING",
    total: 89.99,
    payment: "PENDING",
    shipping: "PENDING",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    date: "2024-01-12",
    status: "CANCELLED",
    total: 199.99,
    payment: "REFUNDED",
    shipping: "CANCELLED",
  },
];

const statusConfig = {
  COMPLETED: { label: "Completed", variant: "success" as const },
  SHIPPED: { label: "Shipped", variant: "default" as const },
  PROCESSING: { label: "Processing", variant: "secondary" as const },
  PENDING: { label: "Pending", variant: "outline" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

const paymentConfig = {
  PAID: { label: "Paid", variant: "success" as const },
  PENDING: { label: "Pending", variant: "warning" as const },
  REFUNDED: { label: "Refunded", variant: "secondary" as const },
  FAILED: { label: "Failed", variant: "destructive" as const },
};

const shippingConfig = {
  DELIVERED: { label: "Delivered", variant: "success" as const },
  IN_TRANSIT: { label: "In Transit", variant: "default" as const },
  PENDING: { label: "Pending", variant: "outline" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

export function OrdersTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const status =
                statusConfig[order.status as keyof typeof statusConfig];
              const payment =
                paymentConfig[order.payment as keyof typeof paymentConfig];
              const shipping =
                shippingConfig[order.shipping as keyof typeof shippingConfig];

              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payment.variant}>{payment.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={shipping.variant}>{shipping.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Truck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
