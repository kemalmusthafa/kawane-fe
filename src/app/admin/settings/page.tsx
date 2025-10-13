"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Shield,
  Database,
  Bell,
  Palette,
  Users,
  CreditCard,
  Truck,
  Loader2,
} from "lucide-react";
import { useAdminSettings } from "@/hooks/useApi";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { settings, isLoading, error, updateSettings, mutate } =
    useAdminSettings();

  const [localSettings, setLocalSettings] = useState({
    // General Settings
    siteName: "Kawane Studio",
    siteDescription: "Premium E-commerce Platform",
    siteUrl: "https://kawane-studio.com",
    adminEmail: "admin@kawane.com",
    timezone: "Asia/Jakarta",
    language: "id",
    currency: "IDR",

    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@kawane.com",
    smtpPassword: "********",
    emailFrom: "Kawane Studio <noreply@kawane.com>",

    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorAuth: true,
    ipWhitelist: "",
    userLoginRateLimit: 1000, // Rate limit untuk user login per hari

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlert: true,
    newOrderAlert: true,
    paymentAlert: true,

    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: false,
    bankTransferEnabled: true,
    codEnabled: true,

    // Shipping Settings
    freeShippingThreshold: 500000,
    defaultShippingCost: 15000,
    shippingZones: "Indonesia",

    // Appearance Settings
    primaryColor: "#3B82F6",
    secondaryColor: "#64748B",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
  });

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Validasi rate limit
      if (
        localSettings.userLoginRateLimit < 1 ||
        localSettings.userLoginRateLimit > 10000
      ) {
        toast.error("Rate limit harus antara 1 dan 10000");
        return;
      }

      await updateSettings(localSettings);
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    }
  };

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

  if (isLoading) {
    return <AdminPageSkeleton />;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="mb-6"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Kelola pengaturan sistem dan konfigurasi aplikasi
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger
              value="general"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment</span>
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="flex items-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>Shipping</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={localSettings.siteName}
                      onChange={(e) =>
                        handleSettingChange("siteName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={localSettings.siteUrl}
                      onChange={(e) =>
                        handleSettingChange("siteUrl", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={localSettings.siteDescription}
                      onChange={(e) =>
                        handleSettingChange("siteDescription", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={localSettings.adminEmail}
                      onChange={(e) =>
                        handleSettingChange("adminEmail", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={localSettings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">
                          Asia/Jakarta
                        </SelectItem>
                        <SelectItem value="Asia/Makassar">
                          Asia/Makassar
                        </SelectItem>
                        <SelectItem value="Asia/Jayapura">
                          Asia/Jayapura
                        </SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={localSettings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={localSettings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">
                          Indonesian Rupiah (IDR)
                        </SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={localSettings.smtpHost}
                      onChange={(e) =>
                        handleSettingChange("smtpHost", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={localSettings.smtpPort}
                      onChange={(e) =>
                        handleSettingChange("smtpPort", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={localSettings.smtpUsername}
                      onChange={(e) =>
                        handleSettingChange("smtpUsername", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={localSettings.smtpPassword}
                      onChange={(e) =>
                        handleSettingChange("smtpPassword", e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="emailFrom">From Email</Label>
                    <Input
                      id="emailFrom"
                      value={localSettings.emailFrom}
                      onChange={(e) =>
                        handleSettingChange("emailFrom", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={localSettings.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("sessionTimeout", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={localSettings.maxLoginAttempts}
                      onChange={(e) =>
                        handleSettingChange("maxLoginAttempts", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">
                      Password Min Length
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={localSettings.passwordMinLength}
                      onChange={(e) =>
                        handleSettingChange("passwordMinLength", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="userLoginRateLimit">
                      User Login Rate Limit (per day)
                    </Label>
                    <Input
                      id="userLoginRateLimit"
                      type="number"
                      min="1"
                      max="10000"
                      value={localSettings.userLoginRateLimit}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value >= 1 && value <= 10000) {
                          handleSettingChange("userLoginRateLimit", value);
                        }
                      }}
                      placeholder="1000"
                      className={
                        localSettings.userLoginRateLimit < 1 ||
                        localSettings.userLoginRateLimit > 10000
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Maksimal jumlah login yang diizinkan per hari per user
                      (1-10000)
                    </p>
                    {(localSettings.userLoginRateLimit < 1 ||
                      localSettings.userLoginRateLimit > 10000) && (
                      <p className="text-sm text-red-500 mt-1">
                        Rate limit harus antara 1 dan 10000
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="twoFactorAuth"
                      checked={localSettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSettingChange("twoFactorAuth", checked)
                      }
                    />
                    <Label htmlFor="twoFactorAuth">
                      Enable Two-Factor Authentication
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="ipWhitelist">
                      IP Whitelist (comma-separated)
                    </Label>
                    <Textarea
                      id="ipWhitelist"
                      value={localSettings.ipWhitelist}
                      onChange={(e) =>
                        handleSettingChange("ipWhitelist", e.target.value)
                      }
                      placeholder="192.168.1.1, 10.0.0.1"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={localSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={localSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("smsNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send push notifications to mobile apps
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={localSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("pushNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when product stock is low
                      </p>
                    </div>
                    <Switch
                      id="lowStockAlert"
                      checked={localSettings.lowStockAlert}
                      onCheckedChange={(checked) =>
                        handleSettingChange("lowStockAlert", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newOrderAlert">New Order Alert</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when new order is received
                      </p>
                    </div>
                    <Switch
                      id="newOrderAlert"
                      checked={localSettings.newOrderAlert}
                      onCheckedChange={(checked) =>
                        handleSettingChange("newOrderAlert", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paymentAlert">Payment Alert</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert when payment is received
                      </p>
                    </div>
                    <Switch
                      id="paymentAlert"
                      checked={localSettings.paymentAlert}
                      onCheckedChange={(checked) =>
                        handleSettingChange("paymentAlert", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stripeEnabled">Stripe Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Stripe payment gateway
                      </p>
                    </div>
                    <Switch
                      id="stripeEnabled"
                      checked={localSettings.stripeEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("stripeEnabled", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paypalEnabled">PayPal Payment</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PayPal payment gateway
                      </p>
                    </div>
                    <Switch
                      id="paypalEnabled"
                      checked={localSettings.paypalEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("paypalEnabled", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bankTransferEnabled">Bank Transfer</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable bank transfer payment
                      </p>
                    </div>
                    <Switch
                      id="bankTransferEnabled"
                      checked={localSettings.bankTransferEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("bankTransferEnabled", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="codEnabled">Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable cash on delivery payment
                      </p>
                    </div>
                    <Switch
                      id="codEnabled"
                      checked={localSettings.codEnabled}
                      onCheckedChange={(checked) =>
                        handleSettingChange("codEnabled", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="freeShippingThreshold">
                      Free Shipping Threshold (IDR)
                    </Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={localSettings.freeShippingThreshold}
                      onChange={(e) =>
                        handleSettingChange(
                          "freeShippingThreshold",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultShippingCost">
                      Default Shipping Cost (IDR)
                    </Label>
                    <Input
                      id="defaultShippingCost"
                      type="number"
                      value={localSettings.defaultShippingCost}
                      onChange={(e) =>
                        handleSettingChange(
                          "defaultShippingCost",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="shippingZones">Shipping Zones</Label>
                    <Textarea
                      id="shippingZones"
                      value={localSettings.shippingZones}
                      onChange={(e) =>
                        handleSettingChange("shippingZones", e.target.value)
                      }
                      placeholder="Indonesia, Malaysia, Singapore"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={localSettings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange("primaryColor", e.target.value)
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={localSettings.primaryColor}
                        onChange={(e) =>
                          handleSettingChange("primaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={localSettings.secondaryColor}
                        onChange={(e) =>
                          handleSettingChange("secondaryColor", e.target.value)
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={localSettings.secondaryColor}
                        onChange={(e) =>
                          handleSettingChange("secondaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={localSettings.logoUrl}
                      onChange={(e) =>
                        handleSettingChange("logoUrl", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={localSettings.faviconUrl}
                      onChange={(e) =>
                        handleSettingChange("faviconUrl", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
