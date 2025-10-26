"use client";

import { useState } from "react";
import { useInventory, useProducts } from "@/hooks/useApi";
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
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  BarChart3,
  Package2,
  AlertCircle,
} from "lucide-react";

export default function InventoryManagement() {
  const {
    stockSummary,
    lowStockProducts,
    error,
    isLoading,
    getLogs,
    createLog,
  } = useInventory();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustForm, setAdjustForm] = useState({
    quantity: 0,
    reason: "",
    type: "ADD" as "ADD" | "REMOVE",
  });

  const filteredProducts =
    products?.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleAdjustStock = (product: any) => {
    setSelectedProduct(product);
    setAdjustForm({
      quantity: 0,
      reason: "",
      type: "ADD",
    });
    setIsAdjustDialogOpen(true);
  };

  const handleSubmitAdjustment = async () => {
    if (!selectedProduct || adjustForm.quantity <= 0 || !adjustForm.reason) {
      toast.error("All fields must be filled");
      return;
    }

    try {
      const response = await createLog({
        productId: selectedProduct.id,
        change:
          adjustForm.type === "ADD"
            ? adjustForm.quantity
            : -adjustForm.quantity,
        note: adjustForm.reason,
      });

      if (response.success) {
        toast.success("Stock successfully adjusted");
        setIsAdjustDialogOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error("Failed to adjust stock");
      }
    } catch (error) {
      toast.error("Failed to adjust stock");
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { status: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5)
      return { status: "Low Stock", variant: "destructive" as const };
    if (stock <= 10)
      return { status: "Medium Stock", variant: "default" as const };
    return { status: "In Stock", variant: "secondary" as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading inventory: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage stock and monitor inventory</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockSummary?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stockSummary?.totalValue
                ? `Total Value: ${stockSummary.totalValue}`
                : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stockSummary?.inStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">Products available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stockSummary?.lowStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stockSummary?.outOfStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">No stock available</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Low Stock Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Current stock: {product.stock}
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <p className="text-sm text-yellow-700">
                  And {lowStockProducts.length - 5} more products with low stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search criteria."
                    : "No products available."}
                </p>
              </div>
            ) : (
              filteredProducts.map((product: any) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="text-sm text-gray-600 whitespace-pre-line">
                          {product.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-medium">
                            Stock: {product.stock}
                          </span>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustStock(product)}
                      >
                        Adjust Stock
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold">
                {selectedProduct?.stock || 0}
              </p>
            </div>

            <div>
              <Label htmlFor="adjust-type">Adjustment Type</Label>
              <Select
                value={adjustForm.type}
                onValueChange={(value: "ADD" | "REMOVE") =>
                  setAdjustForm({ ...adjustForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADD">Add Stock</SelectItem>
                  <SelectItem value="REMOVE">Remove Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adjust-quantity">Quantity</Label>
              <Input
                id="adjust-quantity"
                type="number"
                min="1"
                value={adjustForm.quantity}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label htmlFor="adjust-reason">Reason</Label>
              <Input
                id="adjust-reason"
                value={adjustForm.reason}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, reason: e.target.value })
                }
                placeholder="Enter reason for adjustment"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAdjustDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitAdjustment}>Adjust Stock</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
