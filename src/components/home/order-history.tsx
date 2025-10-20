"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Truck } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "COMPLETED",
    total: 299.99,
    items: 2,
    tracking: "TRK123456789",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "SHIPPED",
    total: 149.99,
    items: 1,
    tracking: "TRK987654321",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "PROCESSING",
    total: 89.99,
    items: 1,
    tracking: null,
  },
];

const statusConfig = {
  COMPLETED: { label: "Completed", variant: "success" as const },
  SHIPPED: { label: "Shipped", variant: "default" as const },
  PROCESSING: { label: "Processing", variant: "secondary" as const },
  PENDING: { label: "Pending", variant: "outline" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

export function OrderHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Order History</h2>
        <Button variant="outline" size="sm">
          View All Orders
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status =
            statusConfig[order.status as keyof typeof statusConfig];

          return (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="font-semibold">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{status.label}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.tracking && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                  </div>

                  {order.status === "COMPLETED" && (
                    <Button variant="outline" size="sm">
                      Write Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your order history here.
            </p>
            <Button>Start Shopping</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
