"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useAddresses } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AddressesPage() {
  const { isAuthenticated } = useAuth();
  const { addresses, isLoading, error } = useAddresses();

  useEffect(() => {
    if (error) {
      toast.error("Gagal mengambil data alamat");
    }
  }, [error]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Addresses</h1>
          <p className="text-sm text-gray-600">
            Manage your shipping addresses
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </motion.div>

      <motion.div
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-900 mb-2">
                No Addresses Found
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You haven't added any addresses yet.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(addresses)
              ? addresses.map((address: any, index: number) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base break-words">
                            {address.label || "Address"}
                          </CardTitle>
                          {address.isDefault && (
                            <Badge className="bg-green-100 text-green-800">
                              Default
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-medium break-words">
                            {address.detail ||
                              address.street ||
                              "No address detail"}
                          </p>
                          <p className="break-words">
                            {address.city || "Unknown City"},{" "}
                            {address.postalCode || "00000"}
                          </p>
                          <p className="break-words">
                            {address.province ||
                              address.country ||
                              "Unknown Province"}
                          </p>
                          {address.phone && (
                            <p className="text-sm text-gray-600 break-words">
                              Phone: {address.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : null}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
