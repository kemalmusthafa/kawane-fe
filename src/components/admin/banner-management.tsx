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
} from "lucide-react";
import { apiClient, Deal } from "@/lib/api";
import { toast } from "sonner";

interface BannerConfig {
  id?: string;
  text: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
  dealId?: string;
  priority: number;
}

interface BannerManagementProps {
  deals: Deal[];
  onRefresh: () => void;
}

export function BannerManagement({ deals, onRefresh }: BannerManagementProps) {
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    text: "🚚 Free shipping on orders over $50! Limited time offer.",
    isActive: true,
    backgroundColor: "bg-primary",
    textColor: "text-primary-foreground",
    priority: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load banner config from localStorage or API
  useEffect(() => {
    const savedConfig = localStorage.getItem("banner-config");
    if (savedConfig) {
      setBannerConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Save to localStorage for now (can be moved to API later)
      localStorage.setItem("banner-config", JSON.stringify(bannerConfig));

      toast.success("Banner configuration saved successfully");
      setIsDialogOpen(false);

      // Trigger a page refresh to show changes
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to save banner configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealSelect = (dealId: string) => {
    const selectedDeal = deals.find((deal) => deal.id === dealId);
    if (selectedDeal) {
      setBannerConfig((prev) => ({
        ...prev,
        dealId,
        text: `🔥 ${selectedDeal.title} - ${
          selectedDeal.type === "PERCENTAGE"
            ? `${selectedDeal.value}% OFF`
            : `$${selectedDeal.value} OFF`
        }`,
        linkUrl: `/deals/${dealId}`,
        linkText: "Shop Now",
      }));
    }
  };

  const getActiveDeals = () => {
    return deals.filter(
      (deal) =>
        deal.status === "ACTIVE" &&
        new Date(deal.startDate) <= new Date() &&
        new Date(deal.endDate) >= new Date()
    );
  };

  const activeDeals = getActiveDeals();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Banner Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Banner Preview */}
        <div className="space-y-2">
          <Label>Current Banner Preview</Label>
          <div
            className={`${bannerConfig.backgroundColor} ${bannerConfig.textColor} py-2 px-4 rounded-md text-center text-sm`}
          >
            {bannerConfig.text}
            {bannerConfig.linkUrl && bannerConfig.linkText && (
              <span className="ml-2 underline">{bannerConfig.linkText}</span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Banner Configuration</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Banner Text */}
                <div className="space-y-2">
                  <Label htmlFor="banner-text">Banner Text</Label>
                  <Textarea
                    id="banner-text"
                    value={bannerConfig.text}
                    onChange={(e) =>
                      setBannerConfig((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Enter banner text..."
                    rows={2}
                  />
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
                      value={bannerConfig.linkUrl || ""}
                      onChange={(e) =>
                        setBannerConfig((prev) => ({
                          ...prev,
                          linkUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-text">Link Text</Label>
                    <Input
                      id="link-text"
                      value={bannerConfig.linkText || ""}
                      onChange={(e) =>
                        setBannerConfig((prev) => ({
                          ...prev,
                          linkText: e.target.value,
                        }))
                      }
                      placeholder="Click here"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Select
                    value={bannerConfig.backgroundColor}
                    onValueChange={(value) =>
                      setBannerConfig((prev) => ({
                        ...prev,
                        backgroundColor: value,
                      }))
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
                    value={bannerConfig.textColor}
                    onValueChange={(value) =>
                      setBannerConfig((prev) => ({ ...prev, textColor: value }))
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

                {/* Active Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="banner-active">Show Banner</Label>
                  <Switch
                    id="banner-active"
                    checked={bannerConfig.isActive}
                    onCheckedChange={(checked) =>
                      setBannerConfig((prev) => ({
                        ...prev,
                        isActive: checked,
                      }))
                    }
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={bannerConfig.priority}
                    onChange={(e) =>
                      setBannerConfig((prev) => ({
                        ...prev,
                        priority: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div
                    className={`${bannerConfig.backgroundColor} ${bannerConfig.textColor} py-2 px-4 rounded-md text-center text-sm`}
                  >
                    {bannerConfig.text}
                    {bannerConfig.linkUrl && bannerConfig.linkText && (
                      <span className="ml-2 underline">
                        {bannerConfig.linkText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBannerConfig((prev) => ({
                ...prev,
                isActive: !prev.isActive,
              }));
              localStorage.setItem(
                "banner-config",
                JSON.stringify({
                  ...bannerConfig,
                  isActive: !bannerConfig.isActive,
                })
              );
              window.location.reload();
            }}
          >
            {bannerConfig.isActive ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {bannerConfig.isActive ? "Hide" : "Show"} Banner
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
      </CardContent>
    </Card>
  );
}
