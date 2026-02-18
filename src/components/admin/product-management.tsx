"use client";
import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useApi";
import { Product, Category } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductViewEnhanced } from "./product-view-enhanced";

interface ProductManagementProps {
  userRole?: "ADMIN" | "STAFF";
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  userRole = "STAFF",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const {
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    error,
    isLoading,
  } = useProducts({
    search: searchTerm || undefined,
    categoryId: categoryFilter === "all" ? undefined : categoryFilter,
  });

  const { categories } = useCategories();

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus product ini?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus product");
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Products
          </h1>
          <p className="text-gray-600">
            Terjadi kesalahan saat memuat data products
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola semua produk di toko Anda
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products ({products?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {product.sku || "N/A"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.stock}</span>
                    </TableCell>
                    <TableCell>{getStockBadge(product.stock)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {format(new Date(product.createdAt), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(product)}
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {userRole === "ADMIN" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first product
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialogs */}
      <ProductForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (data) => {
          try {
            await createProduct(data);
            return { success: true };
          } catch (error) {
            return { success: false, error: "Failed to create product" };
          }
        }}
        existingProducts={products || []}
      />

      <ProductForm
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={async (data) => {
          if (!editingProduct)
            return { success: false, error: "No product selected" };
          try {
            await updateProduct(editingProduct.id, data);
            return { success: true };
          } catch (error) {
            return { success: false, error: "Failed to update product" };
          }
        }}
        existingProducts={products || []}
      />

      {/* Product View Dialog */}
      <ProductViewEnhanced
        product={viewingProduct}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setViewingProduct(null);
        }}
        onEdit={openEditDialog}
        onDelete={handleDeleteProduct}
        userRole={userRole}
      />
    </div>
  );
};
