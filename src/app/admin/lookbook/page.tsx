"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminAccess } from "@/components/guards/admin-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionButtons } from "@/components/admin/action-buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { LookbookImageUpload } from "@/components/admin/lookbook-image-upload";

interface LookbookPhoto {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LookbookManagement() {
  const { hasAccess } = useAdminAccess();
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<LookbookPhoto | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  });

  // Fetch photos
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/lookbook");

      if (response.success) {
        const photosData = response.data;
        setPhotos(photosData);
      } else {
        toast.error(response.message || "Failed to load lookbook data");
      }
    } catch (error: any) {
      console.error("Error fetching lookbook photos:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load lookbook data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication token
    const token = localStorage.getItem("token");

    fetchPhotos();
  }, []);


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!formData.imageUrl.trim()) {
      toast.error("Image URL must be filled");
      return;
    }

    try {
      if (editingPhoto) {
        // Update existing photo
        const response = await apiClient.put(
          `/lookbook/${editingPhoto.id}`,
          formData
        );
        if (response.success) {
          toast.success("Lookbook photo successfully updated");
          fetchPhotos();
          resetForm();
        } else {
          toast.error(response.message || "Failed to update lookbook photo");
        }
      } else {
        // Create new photo
        console.log("Creating lookbook photo with data:", formData);
        const response = await apiClient.post("/lookbook", formData);
        console.log("Create response:", response);

        if (response.success) {
          toast.success("Lookbook photo successfully created");
          fetchPhotos();
          resetForm();
        } else {
          toast.error(response.message || "Failed to create lookbook photo");
        }
      }
    } catch (error: any) {
      console.error("Error creating/updating lookbook photo:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving lookbook photo";
      toast.error(errorMessage);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      order: 0,
      isActive: true,
    });
    setEditingPhoto(null);
    setIsDialogOpen(false);
  };

  // Handle edit
  const handleEdit = (photo: LookbookPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl,
      order: photo.order,
      isActive: photo.isActive,
    });
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await apiClient.delete(`/lookbook/${id}`);
      if (response.success) {
        toast.success("Lookbook photo successfully deleted");
        fetchPhotos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (photo: LookbookPhoto) => {
    try {
      const response = await apiClient.put(`/lookbook/${photo.id}`, {
        isActive: !photo.isActive,
      });
      if (response.success) {
        toast.success(
          `Lookbook photo ${!photo.isActive ? "activated" : "deactivated"}`
        );
        fetchPhotos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle order update
  const handleOrderUpdate = async (photos: LookbookPhoto[]) => {
    try {
      const orderData = photos.map((photo, index) => ({
        id: photo.id,
        order: index,
      }));
      const response = await apiClient.put("/lookbook/order/update", {
        photos: orderData,
      });
      if (response.success) {
        toast.success("Lookbook photos order successfully updated");
        fetchPhotos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  if (!hasAccess) {
    return null; // AdminGuard will handle this
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Lookbook Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage lookbook photos displayed on the homepage
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-lg font-semibold">
                {editingPhoto ? "Edit Lookbook Photo" : "Add Lookbook Photo"}
              </DialogTitle>
              <DialogDescription>
                {editingPhoto
                  ? "Edit existing lookbook photo information"
                  : "Add a new lookbook photo to display on the homepage"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Photo title (optional)"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-medium">
                      Order
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={formData.order || 0}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue =
                          value === "" ? 0 : parseInt(value) || 0;
                        setFormData({
                          ...formData,
                          order: numValue,
                        });
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Photo description (optional)"
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <LookbookImageUpload
                  value={formData.imageUrl}
                  onChange={(value) =>
                    setFormData({ ...formData, imageUrl: value })
                  }
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="text-sm">
                    {editingPhoto ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Photos Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Lookbook Photos List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            console.log(
              "Render check - loading:",
              loading,
              "photos.length:",
              photos.length,
              "photos:",
              photos
            );
            return null;
          })()}
          {loading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading data...
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No lookbook photos yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photos.map((photo) => (
                  <TableRow key={photo.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title || "Lookbook photo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">
                          {photo.title || "No title"}
                        </div>
                        {photo.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {photo.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{photo.order}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={photo.isActive ? "default" : "secondary"}>
                        {photo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(photo.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        onToggleVisibility={() => handleToggleActive(photo)}
                        onEdit={() => handleEdit(photo)}
                        onDelete={() => handleDelete(photo.id)}
                        isVisible={photo.isActive}
                        showToggleVisibility={true}
                        showEdit={true}
                        showDelete={true}
                        showView={false}
                        deleteTitle="Delete Lookbook Photo?"
                        deleteDescription="This action cannot be undone. Photo will be permanently deleted."
                        deleteConfirmText="Delete"
                        deleteCancelText="Cancel"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
