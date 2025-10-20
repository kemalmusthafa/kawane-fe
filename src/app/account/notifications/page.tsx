"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useNotifications } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  X,
  Loader2,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  useEffect(() => {
    if (error) {
      toast.error("Gagal mengambil data notifikasi");
    }
  }, [error]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "shipping":
        return <Truck className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "order":
        return <Badge className="bg-blue-100 text-blue-800">Order</Badge>;
      case "payment":
        return <Badge className="bg-green-100 text-green-800">Payment</Badge>;
      case "shipping":
        return (
          <Badge className="bg-purple-100 text-purple-800">Shipping</Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please login to view your notifications
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-sm text-gray-600">
            Stay updated with your orders and account
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Notifications
                </p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.length - unreadCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No Notifications
            </h3>
            <p className="text-sm text-gray-600">
              You're all caught up! We'll notify you when something important
              happens.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Array.isArray(notifications)
            ? notifications.map((notification: any, index: number) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-shadow ${
                      !notification.isRead ? "border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-sm font-medium break-words">
                                {notification.title || "No Title"}
                              </h3>
                              <div className="flex items-center gap-2">
                                {getNotificationBadge(notification.type)}
                                {!notification.isRead && (
                                  <Badge className="bg-blue-500 text-white">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 break-words">
                              {notification.message ||
                                notification.description ||
                                "No message content"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : null}
        </div>
      )}
    </div>
  );
}
