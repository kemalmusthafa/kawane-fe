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
import { Eye, Package } from "lucide-react";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2024-01-15",
    status: "COMPLETED",
    total: 299.99,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2024-01-15",
    status: "SHIPPED",
    total: 149.99,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    date: "2024-01-15",
    status: "PROCESSING",
    total: 89.99,
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    date: "2024-01-14",
    status: "PENDING",
    total: 199.99,
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    date: "2024-01-14",
    status: "COMPLETED",
    total: 399.99,
  },
];

const statusConfig = {
  COMPLETED: { label: "Completed", variant: "success" as const },
  SHIPPED: { label: "Shipped", variant: "default" as const },
  PROCESSING: { label: "Processing", variant: "secondary" as const },
  PENDING: { label: "Pending", variant: "outline" as const },
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm">
            View All Orders
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => {
              const status =
                statusConfig[order.status as keyof typeof statusConfig];

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
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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
