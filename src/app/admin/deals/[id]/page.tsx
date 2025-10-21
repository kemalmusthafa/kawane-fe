"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Calendar,
  Tag,
  Image as ImageIcon,
  Clock,
  Users,
  DollarSign,
  Percent,
} from "lucide-react";
import { useDealById } from "@/hooks/useDeals";
import { apiClient, Deal } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { DealDetailSkeleton } from "@/components/admin/deals-skeleton";
import { DealImageUpload } from "@/components/admin/deal-image-upload";
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

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const { deal, isLoading, error, refetch } = useDealById(dealId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description || "",
        type: deal.type,
        value: deal.value,
        startDate: new Date(deal.startDate).toISOString().slice(0, 16),
        endDate: new Date(deal.endDate).toISOString().slice(0, 16),
        image: deal.image || "",
        isFlashSale: deal.isFlashSale,
        maxUses: deal.maxUses?.toString() || "",
        status: deal.status,
      });
    }
  }, [deal]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert datetime-local format to ISO string for API
      const updateData = {
        ...formData,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
      };

      await apiClient.updateDeal(dealId, updateData);
      toast.success("Deal updated successfully");
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update deal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description || "",
        type: deal.type,
        value: deal.value,
        startDate: new Date(deal.startDate).toISOString().slice(0, 16),
        endDate: new Date(deal.endDate).toISOString().slice(0, 16),
        image: deal.image || "",
        isFlashSale: deal.isFlashSale,
        maxUses: deal.maxUses?.toString() || "",
        status: deal.status,
      });
    }
    setIsEditing(false);
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
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return <DealDetailSkeleton />;
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Deal not found</p>
          <Button onClick={() => router.push("/admin/deals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/deals")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deals
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isEditing ? "Edit Deal" : "Deal Details"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing
                  ? "Update deal information"
                  : "View and manage deal details"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Deal
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Information */}
          <motion.div
            variants={contentVariants}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Deal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    {isEditing ? (
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-lg font-medium">{deal.title}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    {isEditing ? (
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="FIXED_AMOUNT">
                            Fixed Amount
                          </SelectItem>
                          <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getTypeBadge(deal.type)}
                        {deal.isFlashSale && (
                          <Badge className="bg-orange-100 text-orange-800">
                            Flash Sale
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {deal.description || "No description provided"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    {isEditing ? (
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            value: parseFloat(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {deal.type === "PERCENTAGE" ? (
                          <>
                            <Percent className="h-4 w-4" />
                            <span className="text-lg font-medium">
                              {deal.value}%
                            </span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4" />
                            <span className="text-lg font-medium">
                              Rp {deal.value.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="maxUses">Max Uses</Label>
                    {isEditing ? (
                      <Input
                        id="maxUses"
                        type="number"
                        value={formData.maxUses}
                        onChange={(e) =>
                          setFormData({ ...formData, maxUses: e.target.value })
                        }
                        placeholder="Unlimited"
                      />
                    ) : (
                      <p className="text-lg font-medium">
                        {deal.maxUses
                          ? deal.maxUses.toLocaleString()
                          : "Unlimited"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
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
                    ) : (
                      getStatusBadge(deal.status)
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    {isEditing ? (
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(deal.startDate)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    {isEditing ? (
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(deal.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <DealImageUpload
                      value={formData.image}
                      onChange={(value) =>
                        setFormData({ ...formData, image: value })
                      }
                      disabled={isSaving}
                    />
                  ) : (
                    <div>
                      <Label>Images</Label>
                      <div className="mt-2">
                        <DealImageCarousel
                          images={
                            deal.images && deal.images.length > 0
                              ? deal.images.map((img) => img.url)
                              : deal.image
                              ? [deal.image]
                              : []
                          }
                          dealTitle={deal.title}
                          dealId={deal.id}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFlashSale"
                      checked={formData.isFlashSale}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFlashSale: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="isFlashSale">Flash Sale</Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Products in Deal */}
          <motion.div
            variants={contentVariants}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Products in Deal ({deal.dealProducts?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deal.dealProducts && deal.dealProducts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Original Price</TableHead>
                        <TableHead>Discounted Price</TableHead>
                        <TableHead>Discount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deal.dealProducts.map((dealProduct) => (
                        <TableRow key={dealProduct.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {dealProduct.product.images &&
                              dealProduct.product.images.length > 0 ? (
                                <Image
                                  src={dealProduct.product.images[0].url}
                                  alt={dealProduct.product.name}
                                  width={40}
                                  height={40}
                                  className="rounded object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">
                                  {dealProduct.product.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {dealProduct.product.category?.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="line-through text-muted-foreground">
                              Rp{" "}
                              {dealProduct.product.originalPrice.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              Rp{" "}
                              {dealProduct.product.discountedPrice.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-800">
                              -{dealProduct.product.discountPercentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No products assigned to this deal
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deal Stats */}
          <motion.div
            variants={contentVariants}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Deal Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Time Remaining
                  </span>
                  <span className="font-medium">
                    {getTimeRemaining(deal.endDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Used Count
                  </span>
                  <span className="font-medium">{deal.usedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Max Uses
                  </span>
                  <span className="font-medium">
                    {deal.maxUses ? deal.maxUses.toLocaleString() : "Unlimited"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {formatDate(deal.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {formatDate(deal.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
