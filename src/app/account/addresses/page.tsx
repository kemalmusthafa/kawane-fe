"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useAddresses } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddressesPage() {
  const { isAuthenticated } = useAuth();
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error("Gagal mengambil data alamat");
    }
  }, [error]);

  const handleAddAddress = async () => {
    try {
      setIsCreating(true);
      // For now, create a sample address
      // In a real app, this would open a modal or navigate to a form
      const sampleAddress = {
        detail: "Sample Address Detail",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12345",
        // isDefault: addresses.length === 0, // Will be available after migration
      };

      await createAddress(sampleAddress);
      toast.success("Address berhasil ditambahkan");
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan alamat");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditAddress = async (addressId: string) => {
    try {
      // Find the address to edit
      const addressToEdit = addresses.find(
        (addr: any) => addr.id === addressId
      );
      if (!addressToEdit) {
        toast.error("Address not found");
        return;
      }

      // For now, update with sample data
      // In a real app, this would open a modal or navigate to a form
      const updatedData = {
        detail: `${addressToEdit.detail} (Updated)`,
        city: addressToEdit.city,
        province: addressToEdit.province,
        postalCode: addressToEdit.postalCode,
        // isDefault: addressToEdit.isDefault, // Will be available after migration
      };

      await updateAddress(addressId, updatedData);
      toast.success("Address berhasil diupdate");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengedit alamat");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
        await deleteAddress(addressId);
        toast.success("Address berhasil dihapus");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus alamat");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to view your addresses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Addresses
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Manage your shipping addresses
          </p>
        </div>
        <Button
          onClick={handleAddAddress}
          disabled={isCreating}
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add Address
            </>
          )}
        </Button>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-600" />
          </div>
        ) : addresses.length === 0 ? (
          <Card className="border border-gray-200 bg-white rounded-lg">
            <CardContent className="text-center py-8 sm:py-12">
              <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">
                No Addresses Found
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                You haven't added any addresses yet.
              </p>
              <Button
                onClick={handleAddAddress}
                disabled={isCreating}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Your First Address
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Array.isArray(addresses)
              ? addresses.map((address: any, index: number) => (
                  <div key={address.id}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                              <h3 className="text-sm sm:text-base font-semibold break-all">
                                {address.label || "Address"}
                              </h3>
                              <div className="flex items-center gap-2">
                                {/* Default badge will be available after migration */}
                                {/* {address.isDefault && (
                                  <Badge className="bg-gray-100 text-gray-800">
                                    Default
                                  </Badge>
                                )} */}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                {address.city || "Unknown City"}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-gray-500">•</span>
                                {address.postalCode || "00000"}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-gray-500">•</span>
                                {address.province || "Unknown Province"}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                              <p className="font-medium break-words text-gray-900 text-xs sm:text-sm">
                                {address.detail ||
                                  address.street ||
                                  "No address detail"}
                              </p>
                              {address.phone && (
                                <p className="text-xs sm:text-sm text-gray-600 break-words mt-1">
                                  Phone: {address.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <Button
                              onClick={() => handleEditAddress(address.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteAddress(address.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    </div>
  );
}
