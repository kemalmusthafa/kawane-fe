"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Image as ImageIcon,
  Clock,
  Users,
} from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { apiClient, Deal } from "@/lib/api";
import { isValidImageUrl } from "@/utils/image-validation";
import Image from "next/image";
import { DealsSkeleton } from "@/components/admin/deals-skeleton";
import { toast } from "sonner";
import { adminToast } from "@/utils/admin-toast";
import { MultipleBannerManagement } from "@/components/admin/multiple-banner-management";
import { DealImageCarousel } from "@/components/ui/deal-image-carousel";

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

export default function AdminDealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    deals,
    isLoading: dealsLoading,
    refetch,
  } = useDeals({
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
  });

  const filteredDeals = deals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDeal = async (dealData: any) => {
    try {
      setIsLoading(true);

      // Additional validation before API call
      if (
        !dealData.title ||
        !dealData.type ||
        !dealData.value ||
        !dealData.startDate ||
        !dealData.endDate ||
        !dealData.productName ||
        !dealData.productPrice
      ) {
        adminToast.general.error(
          "Validation failed",
          "Please fill in all required fields"
        );
        return;
      }

      // Validate data types
      if (typeof dealData.value !== "number" || isNaN(dealData.value)) {
        toast.error("Invalid value format");
        return;
      }

      if (
        typeof dealData.productPrice !== "number" ||
        isNaN(dealData.productPrice)
      ) {
        toast.error("Invalid product price format");
        return;
      }

      if (typeof dealData.isFlashSale !== "boolean") {
        toast.error("Invalid flash sale format");
        return;
      }

      // Validate image field
      if (dealData.image && typeof dealData.image !== "string") {
        toast.error("Invalid image format");
        return;
      }

      // Validate image URL if provided
      if (dealData.image && dealData.image.trim().length < 1) {
        toast.error("Image URL cannot be empty");
        return;
      }

      // Validate image URL format if provided
      if (
        dealData.image &&
        dealData.image.trim() &&
        !isValidImageUrl(dealData.image)
      ) {
        toast.error("Please enter a valid image URL or file path");
        return;
      }

      // Validate images array if provided
      if (dealData.images && Array.isArray(dealData.images)) {
        for (const imageUrl of dealData.images) {
          if (typeof imageUrl !== "string" || !isValidImageUrl(imageUrl)) {
            toast.error("Please enter valid image URLs");
            return;
          }
        }
      }

      // Validate date format
      if (isNaN(new Date(dealData.startDate).getTime())) {
        toast.error("Invalid start date format");
        return;
      }

      if (isNaN(new Date(dealData.endDate).getTime())) {
        toast.error("Invalid end date format");
        return;
      }

      // Final data preparation
      const finalDealData = {
        ...dealData,
        image:
          dealData.image && dealData.image.trim()
            ? dealData.image.trim()
            : undefined,
        maxUses: dealData.maxUses || undefined,
        // Ensure sizes are properly formatted
        sizes:
          dealData.sizes &&
          Array.isArray(dealData.sizes) &&
          dealData.sizes.length > 0
            ? dealData.sizes.map((s: any) => ({
                size: s.size?.trim().toUpperCase() || s.size,
                stock: Number(s.stock) || 0,
              }))
            : undefined,
      };

      // Debug log to verify sizes data is being sent
      console.log("Creating deal with sizes:", finalDealData.sizes);
      console.log(
        "Full deal data being sent:",
        JSON.stringify(finalDealData, null, 2)
      );

      const response = await apiClient.createDeal(finalDealData);

      // Log response to verify sizes were saved
      console.log("Deal created successfully:", response);
      if (response?.dealProducts?.[0]) {
        console.log("Saved product data:", response.dealProducts[0]);
      }
      toast.success("Deal created successfully");
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Create deal error:", error);
      console.error("Error details:", error.response?.data || error.message);

      // Show detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create deal";
      toast.error(errorMessage);

      // Log the full error for debugging
      if (error.response?.data) {
        console.error(
          "Full error response:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeal = async (id: string, dealData: any) => {
    try {
      setIsLoading(true);

      // Ensure sizes are properly formatted
      const finalDealData = {
        ...dealData,
        sizes: dealData.sizes && Array.isArray(dealData.sizes) && dealData.sizes.length > 0
          ? dealData.sizes.map((s: any) => ({
              size: s.size?.trim().toUpperCase() || s.size,
              stock: Number(s.stock) || 0,
            }))
          : undefined,
      };

      // Debug log to verify sizes data is being sent
      console.log("Updating deal with sizes:", finalDealData.sizes);
      console.log("Full deal update data:", JSON.stringify(finalDealData, null, 2));

      await apiClient.updateDeal(id, finalDealData);
      toast.success("Deal updated successfully");
      setIsEditDialogOpen(false);
      setSelectedDeal(null);
      refetch();
    } catch (error: any) {
      console.error("Update deal error:", error);
      toast.error(error.message || "Failed to update deal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      setIsLoading(true);
      await apiClient.deleteDeal(id);
      toast.success("Deal deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete deal");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="cancelled">Inactive</Badge>;
      case "expired":
        return <Badge variant="danger">Expired</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return <Badge variant="info">Percentage</Badge>;
      case "FIXED_AMOUNT":
        return <Badge variant="warning">Fixed Amount</Badge>;
      case "FLASH_SALE":
        return <Badge variant="pending">Flash Sale</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (dealsLoading) {
    return <DealsSkeleton />;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Deals Management
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your product deals and promotions
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="text-sm w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Deal</span>
                  <span className="sm:hidden">Add Deal</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-4xl max-h-[95vh] overflow-y-auto"
                aria-describedby="create-deal-description"
              >
                <DialogHeader>
                  <DialogTitle>Create New Deal</DialogTitle>
                  <p
                    id="create-deal-description"
                    className="text-sm text-muted-foreground"
                  >
                    Create a new promotional deal for your products
                  </p>
                </DialogHeader>
                <CreateDealForm
                  onSubmit={handleCreateDeal}
                  isLoading={isLoading}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Banner Management */}
      <motion.div
        className="mb-6"
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {dealsLoading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Loading banner management...
              </p>
            </CardContent>
          </Card>
        ) : (
          <MultipleBannerManagement deals={deals || []} onRefresh={refetch} />
        )}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="mb-6"
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deals Table */}
      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              All Deals ({filteredDeals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {deal.images && deal.images.length > 0 ? (
                              <Image
                                src={deal.images[0].url}
                                alt={deal.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : deal.image ? (
                              <Image
                                src={deal.image}
                                alt={deal.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            {/* Multiple images indicator */}
                            {((deal.images && deal.images.length > 1) ||
                              (deal.image &&
                                deal.images &&
                                deal.images.length > 0)) && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {deal.images ? deal.images.length : 2}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{deal.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {deal.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getTypeBadge(deal.type)}
                          {deal.isFlashSale && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              Flash Sale
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {deal.type === "PERCENTAGE"
                            ? `${deal.value}%`
                            : `Rp ${deal.value.toLocaleString()}`}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(deal.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {getTimeRemaining(deal.endDate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(deal.startDate)} -{" "}
                          {formatDate(deal.endDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {deal.dealProducts?.length || 0} products
                        </div>
                      </TableCell>
                      <TableCell>
                        {deal.dealProducts?.[0]?.product?.sizes &&
                        deal.dealProducts[0].product.sizes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {deal.dealProducts[0].product.sizes.map((sizeItem, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {sizeItem.size} ({sizeItem.stock})
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No sizes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(deal.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          onEdit={() => {
                            setSelectedDeal(deal);
                            setIsEditDialogOpen(true);
                          }}
                          onDelete={() => handleDeleteDeal(deal.id)}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="max-w-4xl max-h-[95vh] overflow-y-auto"
          aria-describedby="edit-deal-description"
        >
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <p
              id="edit-deal-description"
              className="text-sm text-muted-foreground"
            >
              Update the deal information and settings
            </p>
          </DialogHeader>
          {selectedDeal && (
            <EditDealForm
              deal={selectedDeal}
              onSubmit={(data) => handleUpdateDeal(selectedDeal.id, data)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Create Deal Form Component
function CreateDealForm({
  onSubmit,
  isLoading,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    image: "",
    images: [] as string[],
    isFlashSale: false,
    maxUses: "",
    // Product information
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: 0,
    categoryId: "",
  });

  // Size management state
  const [sizes, setSizes] = useState<Array<{ size: string; stock: number }>>(
    []
  );
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Size options
  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "SM", label: "SM" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  // Calculate total stock from sizes
  const calculateTotalStock = () => {
    return sizes.reduce((total, sizeItem) => total + sizeItem.stock, 0);
  };

  // Update stock quantity when sizes change
  React.useEffect(() => {
    const totalStock = calculateTotalStock();
    if (sizes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        productStock: totalStock,
      }));
    }
  }, [sizes]);

  // Size management functions
  const addSize = () => {
    // Add empty size row for dropdown/input selection
    // User will select size from dropdown or enter custom size
    setSizes([...sizes, { size: "", stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: "size" | "stock",
    value: string | number
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const addCustomSize = () => {
    if (customSizeInput.trim()) {
      setSizes([
        ...sizes,
        { size: customSizeInput.trim().toUpperCase(), stock: 0 },
      ]);
      setCustomSizeInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (formData.title.length > 100) {
        toast.error("Title must be less than 100 characters");
        return;
      }

      if (
        !formData.value ||
        formData.value === "" ||
        Number(formData.value) <= 0
      ) {
        toast.error("Value must be greater than 0");
        return;
      }

      if (formData.type === "PERCENTAGE" && Number(formData.value) > 100) {
        toast.error("Percentage value cannot exceed 100%");
        return;
      }

      if (
        formData.type === "FIXED_AMOUNT" &&
        Number(formData.value) > 1000000
      ) {
        toast.error("Fixed amount cannot exceed 1,000,000");
        return;
      }

      if (formData.type === "FLASH_SALE" && Number(formData.value) > 100) {
        toast.error("Flash sale percentage cannot exceed 100%");
        return;
      }

      // Additional validation for percentage values
      if (formData.type === "PERCENTAGE" && Number(formData.value) < 0) {
        toast.error("Percentage discount cannot be negative");
        return;
      }

      if (formData.type === "FIXED_AMOUNT" && Number(formData.value) < 0) {
        toast.error("Fixed amount discount cannot be negative");
        return;
      }

      if (formData.type === "FLASH_SALE" && Number(formData.value) < 0) {
        toast.error("Flash sale discount cannot be negative");
        return;
      }

      // Additional validation for deal type
      if (formData.type === "FLASH_SALE" && Number(formData.value) <= 0) {
        toast.error("Flash sale value must be greater than 0");
        return;
      }

      // Validate date format
      if (isNaN(new Date(formData.startDate).getTime())) {
        toast.error("Invalid start date format");
        return;
      }

      if (isNaN(new Date(formData.endDate).getTime())) {
        toast.error("Invalid end date format");
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        toast.error("Start date and end date are required");
        return;
      }

      // Validate date logic
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const now = new Date();

      // Create local date strings for comparison (without timezone conversion)
      const startDateLocal = new Date(formData.startDate + ":00");
      const endDateLocal = new Date(formData.endDate + ":00");
      const nowLocal = new Date();

      if (endDate <= startDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Check if start date is in the past using local comparison
      // Note: Disabled for now due to timezone issues
      // if (startDateLocal <= nowLocal) {
      //   console.log("Validation failed: Start date cannot be in the past", {
      //     startDate: formData.startDate,
      //     startDateLocal: startDateLocal.toISOString(),
      //     nowLocal: nowLocal.toISOString(),
      //   });
      //   toast.error("Start date must be in the future");
      //   return;
      // }

      // Validate max uses if provided
      if (
        formData.maxUses &&
        (parseInt(formData.maxUses) < 1 || parseInt(formData.maxUses) > 10000)
      ) {
        toast.error("Max uses must be between 1 and 10,000");
        return;
      }

      // Validate image URL if provided
      if (formData.image && formData.image.trim()) {
        if (formData.image.trim().length < 1) {
          toast.error("Image URL cannot be empty");
          return;
        }
        if (!isValidImageUrl(formData.image)) {
          toast.error("Please enter a valid image URL or file path");
          return;
        }
      }

      // Additional validation for required fields
      if (!formData.type) {
        toast.error("Deal type is required");
        return;
      }

      // Validate value is a valid number
      if (isNaN(Number(formData.value)) || formData.value === "") {
        toast.error("Value must be a valid number");
        return;
      }

      // Validate sizes if provided
      if (sizes.length > 0) {
        const invalidSizes = sizes.filter(
          (sizeItem) => !sizeItem.size || sizeItem.size.trim() === ""
        );
        if (invalidSizes.length > 0) {
          toast.error("All sizes must have a value");
          return;
        }

        const invalidStocks = sizes.filter(
          (sizeItem) => isNaN(sizeItem.stock) || sizeItem.stock < 0
        );
        if (invalidStocks.length > 0) {
          toast.error("All stock values must be valid numbers (≥ 0)");
          return;
        }
      }

      // Filter and format sizes - only include valid ones
      const validSizes = sizes
        .filter((sizeItem) => sizeItem.size && sizeItem.size.trim() !== "")
        .map((sizeItem) => ({
          size: sizeItem.size.trim().toUpperCase(),
          stock: Math.max(0, Number(sizeItem.stock) || 0),
        }));

      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        value: Number(formData.value),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        image:
          formData.image && formData.image.trim()
            ? formData.image.trim()
            : undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        isFlashSale: Boolean(formData.isFlashSale),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        // Product information
        productName: formData.productName.trim(),
        productDescription: formData.productDescription.trim() || undefined,
        productPrice: Number(formData.productPrice),
        sizes: validSizes.length > 0 ? validSizes : undefined,
        productStock:
          validSizes.length > 0
            ? validSizes.reduce((sum, s) => sum + s.stock, 0)
            : formData.productStock,
        categoryId: formData.categoryId || undefined,
      };

      // Debug log to verify sizes data
      console.log("Submitting deal with sizes:", validSizes);
      console.log("Full submit data:", JSON.stringify(submitData, null, 2));

      onSubmit(submitData);
    } catch (error: any) {
      console.error("Form validation error:", error);
      toast.error("Please check your input and try again");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(
              value: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE"
            ) => {
              setFormData({
                ...formData,
                type: value,
                // Auto-set isFlashSale based on type selection
                isFlashSale: value === "FLASH_SALE",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
              <SelectItem value="FIXED_AMOUNT">
                Fixed Amount Discount
              </SelectItem>
              <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground mt-1">
            {formData.type === "PERCENTAGE" && "Enter percentage (0-100%)"}
            {formData.type === "FIXED_AMOUNT" &&
              "Enter fixed amount in currency"}
            {formData.type === "FLASH_SALE" &&
              "Limited time offer with special pricing"}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter deal description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) =>
              setFormData({
                ...formData,
                value: e.target.value,
              })
            }
            placeholder="Enter deal value..."
            required
            className={
              !formData.value ||
              formData.value === "" ||
              Number(formData.value) <= 0
                ? "border-red-500"
                : ""
            }
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formData.type === "PERCENTAGE" &&
              "Enter percentage value (0-100%)"}
            {formData.type === "FIXED_AMOUNT" &&
              "Enter fixed amount in currency (max 1,000,000)"}
            {formData.type === "FLASH_SALE" &&
              "Enter flash sale percentage (0-100%)"}
          </div>
          {formData.type === "PERCENTAGE" && Number(formData.value) > 100 && (
            <div className="text-xs text-red-500 mt-1">
              ⚠️ Percentage cannot exceed 100%
            </div>
          )}
          {formData.type === "FIXED_AMOUNT" &&
            Number(formData.value) > 1000000 && (
              <div className="text-xs text-red-500 mt-1">
                ⚠️ Fixed amount cannot exceed 1,000,000
              </div>
            )}
          {formData.type === "FLASH_SALE" && Number(formData.value) > 100 && (
            <div className="text-xs text-red-500 mt-1">
              ⚠️ Flash sale percentage cannot exceed 100%
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="maxUses">Max Uses (optional)</Label>
          <Input
            id="maxUses"
            type="number"
            min="1"
            max="10000"
            value={formData.maxUses}
            onChange={(e) =>
              setFormData({ ...formData, maxUses: e.target.value })
            }
            placeholder="Enter max uses..."
          />
          <div className="text-xs text-muted-foreground mt-1">
            Maximum 10,000 uses
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
            className={!formData.startDate ? "border-red-500" : ""}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
            className={!formData.endDate ? "border-red-500" : ""}
          />
        </div>
      </div>

      <ImageUpload
        images={formData.images}
        onImagesChange={(images) => setFormData({ ...formData, images })}
        maxImages={10}
        disabled={isLoading}
      />

      {/* Product Information Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Product Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="Enter product name..."
              required
            />
          </div>
          <div>
            <Label htmlFor="productPrice">Product Price *</Label>
            <Input
              id="productPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.productPrice}
              onChange={(e) =>
                setFormData({ ...formData, productPrice: e.target.value })
              }
              placeholder="Enter product price..."
              required
            />
          </div>
        </div>

        {/* Sizes & Stock Section */}
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sizes & Stock</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSize}
                >
                  + Add Size
                </Button>
              </div>
            </div>

            {/* Custom Size Input */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Enter custom size (e.g., 28, 30, S, M, L)"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSize}
                disabled={!customSizeInput.trim()}
              >
                Add Custom
              </Button>
            </div>

            {sizes.length === 0 ? (
              <p className="text-sm text-gray-500">No sizes added yet</p>
            ) : (
              <div className="space-y-2">
                {sizes.map((sizeItem, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <Select
                        value={sizeItem.size || undefined}
                        onValueChange={(value) =>
                          updateSize(index, "size", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Custom"
                        value={sizeItem.size}
                        onChange={(e) =>
                          updateSize(
                            index,
                            "size",
                            e.target.value.toUpperCase()
                          )
                        }
                        className="w-20"
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={sizeItem.stock}
                      onChange={(e) =>
                        updateSize(
                          index,
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                      min="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Stock Display */}
          <div className="space-y-2">
            <Label htmlFor="productStock">Total Stock</Label>
            <Input
              id="productStock"
              type="number"
              min="0"
              value={formData.productStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productStock: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Enter product stock..."
              disabled={sizes.length > 0}
              className={sizes.length > 0 ? "bg-gray-100" : ""}
            />
            {sizes.length > 0 && (
              <p className="text-xs text-gray-500">
                Stock quantity automatically calculated from sizes
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="productDescription">Product Description</Label>
          <Textarea
            id="productDescription"
            value={formData.productDescription}
            onChange={(e) =>
              setFormData({ ...formData, productDescription: e.target.value })
            }
            placeholder="Enter product description..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFlashSale"
          checked={formData.isFlashSale}
          disabled={formData.type === "FLASH_SALE"}
          onChange={(e) =>
            setFormData({ ...formData, isFlashSale: e.target.checked })
          }
        />
        <Label htmlFor="isFlashSale">
          {formData.type === "FLASH_SALE"
            ? "Flash Sale (Auto-enabled)"
            : "Mark as Flash Sale"}
        </Label>
        <div className="text-xs text-muted-foreground ml-2">
          {formData.type === "FLASH_SALE"
            ? "Flash sale type automatically enables flash sale badge"
            : "Optional: Adds flash sale badge to deal"}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.title.trim() ||
            !formData.value ||
            formData.value === "" ||
            Number(formData.value) <= 0 ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.productName.trim() ||
            !formData.productPrice ||
            Number(formData.productPrice) <= 0 ||
            (formData.type === "PERCENTAGE" && Number(formData.value) > 100) ||
            (formData.type === "FIXED_AMOUNT" &&
              Number(formData.value) > 1000000) ||
            (formData.type === "FLASH_SALE" && Number(formData.value) > 100)
          }
        >
          {isLoading ? "Creating..." : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}

// Edit Deal Form Component
function EditDealForm({
  deal,
  onSubmit,
  isLoading,
}: {
  deal: Deal;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  // Load sizes from deal product
  const initialSizes = deal.dealProducts?.[0]?.product?.sizes?.map((s) => ({
    size: s.size,
    stock: s.stock,
  })) || [];

  const [formData, setFormData] = useState({
    title: deal.title,
    description: deal.description || "",
    type: deal.type,
    value: deal.value,
    startDate: new Date(deal.startDate).toISOString().slice(0, 16),
    endDate: new Date(deal.endDate).toISOString().slice(0, 16),
    image: deal.image || "",
    images: deal.images?.map((img) => img.url) || [],
    isFlashSale: deal.isFlashSale,
    maxUses: deal.maxUses?.toString() || "",
    status: deal.status,
  });

  // Size management state
  const [sizes, setSizes] = useState<Array<{ size: string; stock: number }>>(
    initialSizes
  );
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Size options
  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "SM", label: "SM" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  // Size management functions
  const addSize = () => {
    setSizes([...sizes, { size: "", stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: "size" | "stock",
    value: string | number
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const addCustomSize = () => {
    if (customSizeInput.trim()) {
      setSizes([
        ...sizes,
        { size: customSizeInput.trim().toUpperCase(), stock: 0 },
      ]);
      setCustomSizeInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (formData.value <= 0) {
      toast.error("Value must be greater than 0");
      return;
    }

    if (formData.type === "PERCENTAGE" && formData.value > 100) {
      toast.error("Percentage value cannot exceed 100%");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start date and end date are required");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    // Validate image URL if provided
    if (
      formData.image &&
      formData.image.trim() &&
      !isValidImageUrl(formData.image)
    ) {
      toast.error("Please enter a valid image URL or file path");
      return;
    }

    // Validate sizes if provided
    if (sizes.length > 0) {
      const invalidSizes = sizes.filter(
        (sizeItem) => !sizeItem.size || sizeItem.size.trim() === ""
      );
      if (invalidSizes.length > 0) {
        toast.error("All sizes must have a value");
        return;
      }

      const invalidStocks = sizes.filter(
        (sizeItem) => isNaN(sizeItem.stock) || sizeItem.stock < 0
      );
      if (invalidStocks.length > 0) {
        toast.error("All stock values must be valid numbers (≥ 0)");
        return;
      }
    }

    // Filter and format sizes - only include valid ones
    const validSizes = sizes
      .filter((sizeItem) => sizeItem.size && sizeItem.size.trim() !== "")
      .map((sizeItem) => ({
        size: sizeItem.size.trim().toUpperCase(),
        stock: Math.max(0, Number(sizeItem.stock) || 0),
      }));

    onSubmit({
      ...formData,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      images: formData.images.length > 0 ? formData.images : undefined,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      sizes: validSizes.length > 0 ? validSizes : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(
              value: "PERCENTAGE" | "FIXED_AMOUNT" | "FLASH_SALE"
            ) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
              <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: parseFloat(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="maxUses">Max Uses (optional)</Label>
          <Input
            id="maxUses"
            type="number"
            value={formData.maxUses}
            onChange={(e) =>
              setFormData({ ...formData, maxUses: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "ACTIVE" | "INACTIVE" | "EXPIRED") =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <ImageUpload
        images={formData.images}
        onImagesChange={(images) => setFormData({ ...formData, images })}
        maxImages={10}
        disabled={isLoading}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFlashSale"
          checked={formData.isFlashSale}
          onChange={(e) =>
            setFormData({ ...formData, isFlashSale: e.target.checked })
          }
        />
        <Label htmlFor="isFlashSale">Flash Sale</Label>
      </div>

      {/* Sizes & Stock Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Product Sizes & Stock</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sizes & Stock</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSize}
                >
                  + Add Size
                </Button>
              </div>
            </div>

            {/* Custom Size Input */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Enter custom size (e.g., 28, 30, S, M, L)"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSize}
                disabled={!customSizeInput.trim()}
              >
                Add Custom
              </Button>
            </div>

            {sizes.length === 0 ? (
              <p className="text-sm text-gray-500">No sizes added yet</p>
            ) : (
              <div className="space-y-2">
                {sizes.map((sizeItem, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <Select
                        value={sizeItem.size || undefined}
                        onValueChange={(value) =>
                          updateSize(index, "size", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Custom"
                        value={sizeItem.size}
                        onChange={(e) =>
                          updateSize(
                            index,
                            "size",
                            e.target.value.toUpperCase()
                          )
                        }
                        className="w-20"
                      />
                    </div>
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={sizeItem.stock}
                      onChange={(e) =>
                        updateSize(
                          index,
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                      min="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Stock Display */}
          <div className="space-y-2">
            <Label>Total Stock</Label>
            <Input
              type="number"
              min="0"
              value={sizes.reduce((sum, s) => sum + s.stock, 0)}
              disabled
              className="bg-gray-100"
            />
            {sizes.length > 0 && (
              <p className="text-xs text-gray-500">
                Stock quantity automatically calculated from sizes
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Deal"}
        </Button>
      </div>
    </form>
  );
}
