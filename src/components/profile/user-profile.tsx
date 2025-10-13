"use client";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useUser, useAddresses, useOrders } from "@/hooks/useApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MapPin,
  Package,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Star,
} from "lucide-react";
import Link from "next/link";

export const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { updateUser } = useUser(user?.id);
  const { addresses, createAddress, updateAddress, deleteAddress } =
    useAddresses();
  const { orders } = useOrders();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [addressData, setAddressData] = useState({
    detail: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-8">Silakan login terlebih dahulu</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    try {
      await updateUser(profileData);
      setIsEditingProfile(false);
      toast.success("Profile berhasil diupdate");
    } catch (error) {
      toast.error("Gagal mengupdate profile");
    }
  };

  const handleAddressSubmit = async () => {
    if (
      !addressData.detail ||
      !addressData.city ||
      !addressData.province ||
      !addressData.postalCode
    ) {
      toast.error("Semua field alamat harus diisi");
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressData);
        setEditingAddressId(null);
        toast.success("Alamat berhasil diupdate");
      } else {
        await createAddress(addressData);
        toast.success("Alamat berhasil ditambahkan");
      }

      setAddressData({
        detail: "",
        city: "",
        province: "",
        postalCode: "",
        isDefault: false,
      });
      setIsAddingAddress(false);
    } catch (error) {
      toast.error("Gagal menyimpan alamat");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      try {
        await deleteAddress(addressId);
        toast.success("Alamat berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus alamat");
      }
    }
  };

  const handleEditAddress = (address: any) => {
    setAddressData({
      detail: address.detail,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Pending" },
      PAID: { variant: "default" as const, label: "Paid" },
      SHIPPED: { variant: "default" as const, label: "Shipped" },
      DELIVERED: { variant: "default" as const, label: "Delivered" },
      COMPLETED: { variant: "default" as const, label: "Completed" },
      CANCELLED: { variant: "destructive" as const, label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi profile dan order Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  {isEditingProfile ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleProfileUpdate}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-lg">
                      {format(new Date(user.createdAt), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Addresses
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingAddress(true);
                    setEditingAddressId(null);
                    setAddressData({
                      detail: "",
                      city: "",
                      province: "",
                      postalCode: "",
                      isDefault: false,
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add/Edit Address Form */}
              {isAddingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="detail">Alamat Lengkap</Label>
                      <Textarea
                        id="detail"
                        value={addressData.detail}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            detail: e.target.value,
                          }))
                        }
                        placeholder="Jl. Sudirman No. 123, RT/RW 01/02"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Kota</Label>
                        <Input
                          id="city"
                          value={addressData.city}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          placeholder="Jakarta"
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                          id="province"
                          value={addressData.province}
                          onChange={(e) =>
                            setAddressData((prev) => ({
                              ...prev,
                              province: e.target.value,
                            }))
                          }
                          placeholder="DKI Jakarta"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Kode Pos</Label>
                      <Input
                        id="postalCode"
                        value={addressData.postalCode}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                        placeholder="12345"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressData.isDefault}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            isDefault: e.target.checked,
                          }))
                        }
                      />
                      <Label htmlFor="isDefault">Jadikan alamat default</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddressSubmit}>
                        <Save className="w-4 h-4 mr-2" />
                        {editingAddressId ? "Update" : "Save"} Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingAddress(false);
                          setEditingAddressId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Addresses List */}
              <div className="space-y-4">
                {addresses && addresses.length > 0 ? (
                  addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <p className="font-medium">{address.detail}</p>
                              {address.isDefault && (
                                <Badge variant="default">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.province}{" "}
                              {address.postalCode}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Belum ada alamat yang tersimpan
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {format(
                                new Date(order.createdAt),
                                "dd MMMM yyyy, HH:mm",
                                { locale: id }
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            {getOrderStatusBadge(order.status)}
                            <p className="text-lg font-semibold mt-1">
                              Rp {order.totalAmount.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Product:</span>{" "}
                            {order.product?.name}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Quantity:</span>{" "}
                            {order.quantity}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">
                              Shipping Address:
                            </span>{" "}
                            {order.shippingAddress}
                          </p>
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't placed any orders yet
                  </p>
                  <Link href="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
