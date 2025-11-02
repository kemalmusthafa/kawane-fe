"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { apiClient, Deal } from "@/lib/api";
import { toast } from "sonner";

interface BannerConfig {
  id: string;
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
  dealId?: string;
  priority: number;
  duration?: number; // Duration in seconds for this banner
}

interface MultipleBannerManagementProps {
  deals: Deal[];
  onRefresh: () => void;
}

export function MultipleBannerManagement({
  deals = [],
  onRefresh,
}: MultipleBannerManagementProps) {
  const [banners, setBanners] = useState<BannerConfig[]>([
    {
      id: "1",
      text: "🚚 Free shipping on orders over $50! Limited time offer.",
      isActive: true,
      backgroundColor: "bg-primary",
      textColor: "text-primary-foreground",
      priority: 1,
      duration: 5,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerConfig | null>(null);
  const [editingBannerForm, setEditingBannerForm] =
    useState<BannerConfig | null>(null);
  const [autoScrollInterval, setAutoScrollInterval] = useState(5);
  const [scrollThreshold, setScrollThreshold] = useState(100);

  // Load banners from localStorage (client-side only)
  useEffect(() => {
    try {
      // Check if we're on client side
      if (typeof window === "undefined") return;

      const savedBanners = localStorage.getItem("multiple-banners");
      const savedInterval = localStorage.getItem("banner-auto-scroll-interval");
      const savedThreshold = localStorage.getItem("banner-scroll-threshold");

      if (savedBanners) {
        try {
          const parsed = JSON.parse(savedBanners);
          if (Array.isArray(parsed)) {
            setBanners(parsed);
          }
        } catch (error) {
          console.error("Error parsing banners:", error);
        }
      }

      if (savedInterval) {
        const interval = parseInt(savedInterval);
        if (!isNaN(interval) && interval >= 2 && interval <= 30) {
          setAutoScrollInterval(interval);
        }
      }

      if (savedThreshold) {
        const threshold = parseInt(savedThreshold);
        if (!isNaN(threshold) && threshold >= 50 && threshold <= 500) {
          setScrollThreshold(threshold);
        }
      }
    } catch (error) {
      console.error("Error loading banners from localStorage:", error);
      // Don't throw, just log the error
    }
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!editingBannerForm) {
        toast.error("No banner data to save");
        return;
      }

      if (!editingBannerForm.text.trim()) {
        toast.error("Banner text is required");
        return;
      }

      if (editingBannerForm.text.length > 200) {
        toast.error("Banner text must be less than 200 characters");
        return;
      }

      if (
        editingBannerForm.duration &&
        (editingBannerForm.duration < 2 || editingBannerForm.duration > 30)
      ) {
        toast.error("Duration must be between 2 and 30 seconds");
        return;
      }

      let updatedBanners;

      if (editingBanner?.id) {
        // Update existing banner
        updatedBanners = banners.map((banner) =>
          banner.id === editingBanner.id ? editingBannerForm : banner
        );
      } else {
        // Add new banner
        updatedBanners = [...banners, editingBannerForm];
      }

      // Update state first
      setBanners(updatedBanners);

      // Save to localStorage with error handling
      try {
        if (typeof window === "undefined") {
          throw new Error("localStorage is not available");
        }
        localStorage.setItem(
          "multiple-banners",
          JSON.stringify(updatedBanners)
        );
        localStorage.setItem(
          "banner-auto-scroll-interval",
          autoScrollInterval.toString()
        );
        localStorage.setItem(
          "banner-scroll-threshold",
          scrollThreshold.toString()
        );
      } catch (storageError: any) {
        console.error("localStorage error:", storageError);
        toast.error(
          storageError.message ||
            "Failed to save to browser storage. Please try again."
        );
        // Revert state change on storage failure
        setBanners(banners);
        return;
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("bannerUpdated"));

      toast.success("Banner configuration saved successfully");
      setIsDialogOpen(false);
      setEditingBanner(null);
      setEditingBannerForm(null);
    } catch (error: any) {
      console.error("Save banner error:", error);
      toast.error(error.message || "Failed to save banner configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBanner = () => {
    try {
      const newBanner: BannerConfig = {
        id: `banner-${Date.now()}`,
        text: "New banner text",
        isActive: true,
        backgroundColor: "bg-primary",
        textColor: "text-primary-foreground",
        priority: banners.length + 1,
        duration: 5,
      };
      setEditingBanner(null); // Set to null for new banner
      setEditingBannerForm({ ...newBanner });
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error("Error adding banner:", error);
      toast.error("Failed to open add banner dialog. Please try again.");
    }
  };

  const handleEditBanner = (banner: BannerConfig) => {
    setEditingBanner(banner);
    setEditingBannerForm({ ...banner });
    setIsDialogOpen(true);
  };

  const handleDeleteBanner = (id: string) => {
    try {
      if (banners.length <= 1) {
        toast.error("You must have at least one banner");
        return;
      }

      if (confirm("Are you sure you want to delete this banner?")) {
        const updatedBanners = banners.filter((banner) => banner.id !== id);
        setBanners(updatedBanners);

        // Save to localStorage immediately
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("multiple-banners", JSON.stringify(updatedBanners));
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent("bannerUpdated"));
            toast.success("Banner deleted successfully");
          } catch (storageError) {
            console.error("localStorage error:", storageError);
            toast.error("Failed to save to browser storage");
          }
        }
      }
    } catch (error: any) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner. Please try again.");
    }
  };

  const handleDuplicateBanner = (banner: BannerConfig) => {
    try {
      const duplicatedBanner: BannerConfig = {
        ...banner,
        id: `banner-${Date.now()}`,
        text: `${banner.text} (Copy)`,
        priority: banners.length + 1,
      };
      const updatedBanners = [...banners, duplicatedBanner];
      setBanners(updatedBanners);

      // Save to localStorage immediately
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("multiple-banners", JSON.stringify(updatedBanners));
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent("bannerUpdated"));
          toast.success("Banner duplicated successfully");
        } catch (storageError) {
          console.error("localStorage error:", storageError);
          toast.error("Failed to save to browser storage");
        }
      }
    } catch (error: any) {
      console.error("Error duplicating banner:", error);
      toast.error("Failed to duplicate banner. Please try again.");
    }
  };

  const handleMoveBanner = (id: string, direction: "up" | "down") => {
    try {
      setBanners((prev) => {
        const index = prev.findIndex((banner) => banner.id === id);
        if (index === -1) return prev;

        const newBanners = [...prev];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newBanners.length) return prev;

        // Swap banners
        [newBanners[index], newBanners[targetIndex]] = [
          newBanners[targetIndex],
          newBanners[index],
        ];

        // Update priorities
        newBanners.forEach((banner, idx) => {
          banner.priority = idx + 1;
        });

        // Save to localStorage immediately
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("multiple-banners", JSON.stringify(newBanners));
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent("bannerUpdated"));
            toast.success("Banner order updated successfully");
          } catch (storageError) {
            console.error("localStorage error:", storageError);
            toast.error("Failed to save to browser storage");
          }
        }

        return newBanners;
      });
    } catch (error: any) {
      console.error("Error moving banner:", error);
      toast.error("Failed to move banner. Please try again.");
    }
  };

  const handleDealSelect = (dealId: string) => {
    try {
      if (!editingBannerForm || !dealId) return;

      const selectedDeal = deals?.find((deal) => deal?.id === dealId);
      if (selectedDeal) {
        setEditingBannerForm((prev) =>
          prev
            ? {
                ...prev,
                dealId,
                text: `🔥 ${selectedDeal.title || "Deal"} - ${
                  selectedDeal.type === "PERCENTAGE"
                    ? `${selectedDeal.value}% OFF`
                    : `$${selectedDeal.value || 0} OFF`
                }`,
                linkUrl: `/deals/${dealId}`,
                linkText: "Shop Now",
              }
            : null
        );
      }
    } catch (error: any) {
      console.error("Error selecting deal:", error);
      toast.error("Failed to select deal. Please try again.");
    }
  };

  const getActiveDeals = () => {
    try {
      if (!deals || !Array.isArray(deals)) return [];
      return deals.filter(
        (deal) =>
          deal &&
          deal.status === "ACTIVE" &&
          deal.startDate &&
          deal.endDate &&
          new Date(deal.startDate) <= new Date() &&
          new Date(deal.endDate) >= new Date()
      );
    } catch (error) {
      console.error("Error getting active deals:", error);
      return [];
    }
  };

  const activeDeals = getActiveDeals();
  const activeBanners = banners.filter((banner) => banner.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Multiple Banner Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auto Scroll Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="auto-scroll-interval">
              Auto Scroll Interval (seconds)
            </Label>
            <Input
              id="auto-scroll-interval"
              type="number"
              min="2"
              max="30"
              value={autoScrollInterval}
              onChange={(e) => {
                try {
                  const value = parseInt(e.target.value) || 5;
                  setAutoScrollInterval(value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "banner-auto-scroll-interval",
                      value.toString()
                    );
                  }
                } catch (error) {
                  console.error("Error saving auto scroll interval:", error);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scroll-threshold">Scroll Threshold (pixels)</Label>
            <Input
              id="scroll-threshold"
              type="number"
              min="50"
              max="500"
              value={scrollThreshold}
              onChange={(e) => {
                try {
                  const value = parseInt(e.target.value) || 100;
                  setScrollThreshold(value);
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "banner-scroll-threshold",
                      value.toString()
                    );
                  }
                } catch (error) {
                  console.error("Error saving scroll threshold:", error);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Banner stops animating when scrolled past this point
            </p>
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Banners ({activeBanners.length} active)</Label>
            <Button onClick={handleAddBanner} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="flex items-center gap-2 p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div
                    className={`${banner.backgroundColor} ${banner.textColor} py-1 px-2 rounded text-xs mb-1`}
                  >
                    {banner.text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Priority: {banner.priority} | Duration: {banner.duration}s |
                    {banner.isActive ? (
                      <span className="text-success"> Active</span>
                    ) : (
                      <span className="text-muted-foreground"> Inactive</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveBanner(banner.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveBanner(banner.id, "down")}
                    disabled={index === banners.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBanner(banner)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateBanner(banner)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
                    disabled={banners.length <= 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              try {
                if (typeof window !== "undefined") {
                  localStorage.setItem("multiple-banners", JSON.stringify(banners));
                  localStorage.setItem(
                    "banner-auto-scroll-interval",
                    autoScrollInterval.toString()
                  );
                  localStorage.setItem(
                    "banner-scroll-threshold",
                    scrollThreshold.toString()
                  );
                  // Dispatch custom event to notify other components
                  window.dispatchEvent(new CustomEvent("bannerUpdated"));
                  toast.success("All banners saved successfully");
                } else {
                  toast.error("Browser storage is not available");
                }
              } catch (error: any) {
                console.error("Error saving all banners:", error);
                toast.error("Failed to save banners. Please try again.");
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Banners
          </Button>
        </div>

        {/* Active Deals Info */}
        {activeDeals.length > 0 && (
          <div className="space-y-2">
            <Label>Active Deals Available</Label>
            <div className="flex flex-wrap gap-2">
              {activeDeals.map((deal) => (
                <Badge key={deal.id} variant="secondary">
                  {deal.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Edit Banner Dialog */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              // Reset form when dialog closes
              setEditingBanner(null);
              setEditingBannerForm(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>

            {editingBannerForm ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {/* Banner Text */}
                <div className="space-y-2">
                  <Label htmlFor="banner-text">Banner Text *</Label>
                  <Textarea
                    id="banner-text"
                    value={editingBannerForm.text}
                    onChange={(e) =>
                      setEditingBannerForm((prev) =>
                        prev ? { ...prev, text: e.target.value } : null
                      )
                    }
                    placeholder="Enter banner text..."
                    rows={2}
                    maxLength={200}
                    className={
                      !editingBannerForm.text.trim() ? "border-red-500" : ""
                    }
                  />
                  <div className="text-xs text-muted-foreground">
                    {editingBannerForm.text.length}/200 characters
                  </div>
                </div>

                {/* Deal Selection */}
                {activeDeals.length > 0 && (
                  <div className="space-y-2">
                    <Label>Link to Active Deal (Optional)</Label>
                    <Select onValueChange={handleDealSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a deal to promote" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No deal link</SelectItem>
                        {activeDeals.map((deal) => (
                          <SelectItem key={deal.id} value={deal.id!}>
                            {deal.title} -{" "}
                            {deal.type === "PERCENTAGE"
                              ? `${deal.value}% OFF`
                              : `$${deal.value} OFF`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Custom Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-url">Link URL</Label>
                    <Input
                      id="link-url"
                      value={editingBannerForm.linkUrl || ""}
                      onChange={(e) =>
                        setEditingBannerForm((prev) =>
                          prev ? { ...prev, linkUrl: e.target.value } : null
                        )
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-text">Link Text</Label>
                    <Input
                      id="link-text"
                      value={editingBannerForm.linkText || ""}
                      onChange={(e) =>
                        setEditingBannerForm((prev) =>
                          prev ? { ...prev, linkText: e.target.value } : null
                        )
                      }
                      placeholder="Click here"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Select
                    value={editingBannerForm.backgroundColor}
                    onValueChange={(value) =>
                      setEditingBannerForm((prev) =>
                        prev ? { ...prev, backgroundColor: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-primary">Primary (Blue)</SelectItem>
                      <SelectItem value="bg-success">
                        Success (Green)
                      </SelectItem>
                      <SelectItem value="bg-warning">
                        Warning (Orange)
                      </SelectItem>
                      <SelectItem value="bg-destructive">
                        Destructive (Red)
                      </SelectItem>
                      <SelectItem value="bg-secondary">
                        Secondary (Gray)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Select
                    value={editingBannerForm.textColor}
                    onValueChange={(value) =>
                      setEditingBannerForm((prev) =>
                        prev ? { ...prev, textColor: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-primary-foreground">
                        White
                      </SelectItem>
                      <SelectItem value="text-foreground">Default</SelectItem>
                      <SelectItem value="text-primary">Primary</SelectItem>
                      <SelectItem value="text-success">Success</SelectItem>
                      <SelectItem value="text-warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Display Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="2"
                    max="30"
                    value={editingBannerForm.duration || 5}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 5;
                      setEditingBannerForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              duration: Math.min(Math.max(value, 2), 30),
                            }
                          : null
                      );
                    }}
                    className={
                      editingBannerForm.duration &&
                      (editingBannerForm.duration < 2 ||
                        editingBannerForm.duration > 30)
                        ? "border-red-500"
                        : ""
                    }
                  />
                  <div className="text-xs text-muted-foreground">
                    Duration: 2-30 seconds
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="banner-active">Show Banner</Label>
                  <Switch
                    id="banner-active"
                    checked={editingBannerForm.isActive}
                    onCheckedChange={(checked) =>
                      setEditingBannerForm((prev) =>
                        prev ? { ...prev, isActive: checked } : null
                      )
                    }
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div
                    className={`${editingBannerForm.backgroundColor} ${editingBannerForm.textColor} py-2 px-4 rounded-md text-center text-sm`}
                  >
                    {editingBannerForm.text}
                    {editingBannerForm.linkUrl &&
                      editingBannerForm.linkText && (
                        <span className="ml-2 underline">
                          {editingBannerForm.linkText}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading banner form...</p>
              </div>
            )}

            <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isLoading ||
                  !editingBannerForm ||
                  !editingBannerForm.text.trim() ||
                  editingBannerForm.text.length > 200 ||
                  !!(
                    editingBannerForm.duration &&
                    editingBannerForm.duration > 0 &&
                    (editingBannerForm.duration < 2 ||
                      editingBannerForm.duration > 30)
                  )
                }
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
