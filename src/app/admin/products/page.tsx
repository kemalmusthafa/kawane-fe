"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAdminAccess } from "@/components/guards/admin-guard";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useCategories } from "@/hooks/useApi";
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
import { ActionButtons } from "@/components/admin/action-buttons";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  Filter,
  Download,
  X,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { adminToast } from "@/utils/admin-toast";
import { ProductForm } from "@/components/admin/product-form";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { Product } from "@/lib/api";
import { LegacyPagination } from "@/components/ui/pagination";
import Image from "next/image";

export default function AdminProducts() {
  const { hasAccess } = useAdminAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  const {
    data,
    isLoading,
    isSearching,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts({
    search: searchTerm,
    categoryId: selectedCategory,
    status: filters.status || undefined,
    minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    page: currentPage,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { categories } = useCategories();

  const getStatusBadge = (stock: number) => {
    if (stock > 0) {
      return <Badge variant="in_stock">Active</Badge>;
    } else {
      return <Badge variant="out_of_stock">Out of Stock</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  // Removed inline Category creation from Products page

  const handleCategorySuccess = () => {
    setIsCategoryFormOpen(false);
    // Refresh categories
    window.location.reload();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteConfirm.product) return;

    const result = await deleteProduct(deleteConfirm.product.id);
    if (result.success) {
      adminToast.product.delete(deleteConfirm.product.name);
      setDeleteConfirm({ isOpen: false, product: null });
    } else {
      adminToast.product.deleteError(result.error);
    }
  };

  const handleProductSubmit = async (productData: {
    name: string;
    description?: string;
    price: number;
    categoryId?: string;
    stock: number;
    sku?: string;
  }) => {
    if (editingProduct) {
      return await updateProduct(editingProduct.id, productData);
    } else {
      return await createProduct(productData);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      minPrice: "",
      maxPrice: "",
    });
    setSelectedCategory("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (!data?.products || data.products.length === 0) {
      adminToast.product.exportError();
      return;
    }

    // Create CSV content
    const headers = [
      "Name",
      "Category",
      "Price",
      "Stock",
      "Status",
      "SKU",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...data.products.map((product) =>
        [
          `"${product.name}"`,
          `"${product.category?.name || "No Category"}"`,
          product.price,
          product.stock,
          `"${product.status}"`,
          `"${product.sku || ""}"`,
          `"${new Date(product.createdAt).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `products_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    adminToast.product.exportSuccess(data.products.length);
  };

  if (!hasAccess) {
    return null; // AdminGuard will handle this
  }

  if (isLoading && !data) {
    return <AdminPageSkeleton />;
  }

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

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Products
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <div className="flex items-center justify-end">
          <Button
            onClick={handleCreateProduct}
            className="text-sm w-full sm:w-auto"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add Product</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-4 sm:space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
            <p className="text-sm sm:text-base text-red-700">{error}</p>
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 text-sm"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm flex-1 sm:flex-none"
                    size="sm"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="text-sm flex-1 sm:flex-none"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1); // Reset to first page when category changes
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">All Categories</option>
                        {categories?.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Product Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">All Products</option>
                        <option value="active">In Stock (Active)</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-2 block">
                        Price Range
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Min Price"
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) =>
                            handleFilterChange("minPrice", e.target.value)
                          }
                          className="text-sm"
                        />
                        <Input
                          placeholder="Max Price"
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange("maxPrice", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              All Products ({data?.totalItems || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {data?.products && data.products.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm">Product</TableHead>
                        <TableHead className="text-sm hidden sm:table-cell">
                          Category
                        </TableHead>
                        <TableHead className="text-sm">Price</TableHead>
                        <TableHead className="text-sm">Stock</TableHead>
                        <TableHead className="text-sm hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-sm hidden lg:table-cell">
                          Created
                        </TableHead>
                        <TableHead className="w-[50px] text-sm">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-3">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate max-w-32 sm:max-w-none">
                                  {product.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {product.category?.name || "No Category"}
                                </div>
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            {product.category?.name || "No Category"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell className="text-sm">
                            <span
                              className={
                                product.stock === 0
                                  ? "text-red-600 font-medium"
                                  : "font-medium"
                              }
                            >
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm hidden sm:table-cell">
                            {getStatusBadge(product.stock)}
                          </TableCell>
                          <TableCell className="text-sm hidden lg:table-cell">
                            {new Date(product.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </TableCell>
                          <TableCell>
                            <ActionButtons
                              onEdit={() => handleEditProduct(product)}
                              onDelete={() => handleDeleteProduct(product)}
                              showView={false}
                              showEdit={true}
                              showDelete={true}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 text-gray-500">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-base sm:text-lg font-medium mb-2">
                  No products found
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Start by adding your first product"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data && data.products && data.products.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <LegacyPagination
                currentPage={currentPage}
                totalPages={data.totalPages || 1}
                onPageChange={setCurrentPage}
                totalItems={data.totalItems || 0}
                itemsPerPage={5}
              />
            </CardContent>
          </Card>
        )}

        {/* Product Form Dialog */}
        <ProductForm
          isOpen={isProductFormOpen}
          onClose={() => {
            setIsProductFormOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={refetch}
          product={editingProduct}
          existingProducts={data?.products || []}
          onSubmit={handleProductSubmit}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          description={`Are you sure you want to delete "${deleteConfirm.product?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />

        {/* Category Form Dialog */}
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={() => setIsCategoryFormOpen(false)}
          onSuccess={handleCategorySuccess}
        />
      </motion.div>
    </motion.div>
  );
}
