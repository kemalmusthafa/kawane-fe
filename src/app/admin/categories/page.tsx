"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  Eye,
} from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { apiClient } from "@/lib/api";
import { useCategories } from "@/hooks/useApi";
import { toast } from "sonner";
import { adminToast } from "@/utils/admin-toast";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminCategoriesPage() {
  const { categories, isLoading, error, mutateCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Filter categories
  const filteredCategories = categories.filter(
    (category: any) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    // Find the category to get its name
    const category = categories.find((cat: any) => cat.id === categoryId);
    const categoryName = category?.name || "Category";

    try {
      await apiClient.request(`/categories/${categoryId}`, {
        method: "DELETE",
      });
      adminToast.category.delete(categoryName);
      mutateCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      adminToast.category.deleteError(error.message);
    }
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    mutateCategories();
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            Manage Categories
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage product categories and category images
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setIsFormOpen(true);
            }}
            disabled={isLoading}
            className="text-sm"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Table */}
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm
                  ? "Try using different keywords"
                  : "Start by adding your first category"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Category
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Category List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[80px]">Image</TableHead>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[200px] hidden sm:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Product Count
                      </TableHead>
                      <TableHead className="text-right min-w-[140px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-white border border-gray-200">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="max-w-[120px] truncate">
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate text-muted-foreground hidden sm:table-cell">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category._count?.products || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                              className="w-full sm:w-auto"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Form Modal */}
        <CategoryForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          category={editingCategory}
          existingCategories={categories}
        />
      </div>
    </motion.div>
  );
}
