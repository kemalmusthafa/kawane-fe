"use client";

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
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    stock: 45,
    category: "Electronics",
    status: "active",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    stock: 23,
    category: "Electronics",
    status: "active",
    updatedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Designer Backpack",
    price: 89.99,
    stock: 0,
    category: "Fashion",
    status: "out-of-stock",
    updatedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Organic Skincare Set",
    price: 149.99,
    stock: 67,
    category: "Beauty",
    status: "active",
    updatedAt: "2024-01-12",
  },
];

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  "out-of-stock": { label: "Out of Stock", variant: "destructive" as const },
  draft: { label: "Draft", variant: "secondary" as const },
  archived: { label: "Archived", variant: "outline" as const },
};

export function ProductsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 w-64" />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status =
                statusConfig[product.status as keyof typeof statusConfig];

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-md" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span
                      className={product.stock === 0 ? "text-destructive" : ""}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
