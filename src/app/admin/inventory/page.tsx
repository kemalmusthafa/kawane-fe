"use client";

import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAdminInventory } from "@/hooks/useApi";

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { inventory, total, isLoading, error, updateStock, mutate } =
    useAdminInventory({
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            In Stock
          </Badge>
        );
      case "LOW_STOCK":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Low Stock
          </Badge>
        );
      case "OUT_OF_STOCK":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockTrend = (currentStock: number, minStock: number) => {
    if (currentStock === 0)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    if (currentStock <= minStock)
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  // Calculate summary statistics
  const totalProducts = total || 0;
  const inStockProducts =
    inventory?.filter((item) => item.status === "IN_STOCK").length || 0;
  const lowStockProducts =
    inventory?.filter((item) => item.status === "LOW_STOCK").length || 0;
  const outOfStockProducts =
    inventory?.filter((item) => item.status === "OUT_OF_STOCK").length || 0;

  if (isLoading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Inventory
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage product stock and monitor inventory
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-sm" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stock</DialogTitle>
              <DialogDescription>
                Add or adjust stock for a product.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Stock adjustment form will be implemented here.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {totalProducts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    In Stock
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {inStockProducts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Low Stock
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                    {lowStockProducts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Out of Stock
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600">
                    {outOfStockProducts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">
              Filter Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                    <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                    <SelectItem value="Hoodie">Hoodie</SelectItem>
                    <SelectItem value="Pants">Pants</SelectItem>
                    <SelectItem value="No Category">No Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Inventory ({inventory?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                <span className="ml-2 text-sm">Loading inventory...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-sm">
                  Error loading inventory: {error.message}
                </p>
                <Button onClick={() => mutate()} className="mt-4" size="sm">
                  Try Again
                </Button>
              </div>
            ) : inventory && inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Product</TableHead>
                      <TableHead className="text-sm hidden sm:table-cell">
                        SKU
                      </TableHead>
                      <TableHead className="text-sm hidden lg:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="text-sm">Stock</TableHead>
                      <TableHead className="text-sm hidden lg:table-cell">
                        Min/Max
                      </TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      <TableHead className="text-sm hidden lg:table-cell">
                        Last Restock
                      </TableHead>
                      <TableHead className="text-sm text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStockTrend(item.currentStock, item.minStock)}
                            <div>
                              <div className="font-medium text-sm">
                                {item.productName}
                              </div>
                              <div className="text-xs text-muted-foreground sm:hidden">
                                SKU: {item.sku}
                              </div>
                              <div className="text-xs text-muted-foreground lg:hidden">
                                {item.category} • {item.minStock}/
                                {item.maxStock}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.sku}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-semibold text-sm">
                              {item.currentStock}
                            </span>
                            <div className="text-xs text-muted-foreground lg:hidden">
                              {format(new Date(item.lastRestock), "dd MMM", {
                                locale: id,
                              })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-gray-600">
                            {item.minStock}/{item.maxStock}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs">
                            {format(new Date(item.lastRestock), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              title="View Details"
                              className="text-xs"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Adjust Stock"
                              className="text-xs"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No Inventory Found
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  No inventory items match your current filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
