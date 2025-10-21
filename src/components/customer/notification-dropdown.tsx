"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationDropdownProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  url?: string;
}

export function CustomerNotificationDropdown({
  className,
}: NotificationDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<
    Notification[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Fetch unread count
      const countResponse = await fetch("/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (countResponse.ok) {
        const countData = await countResponse.json();
        setUnreadCount(countData.data.unreadCount);
      }

      // Fetch recent notifications
      const notificationsResponse = await fetch("/api/notifications?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setRecentNotifications(notificationsData.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      fetchNotifications();
    }
  }, [isDropdownOpen]);

  // Fetch notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });

      // Update local state
      setRecentNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAll: true }),
      });

      // Update local state
      setRecentNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_UPDATE":
        return "📦";
      case "PAYMENT_UPDATE":
        return "💳";
      case "SHIPMENT_UPDATE":
        return "🚚";
      case "PRODUCT_LAUNCH":
        return "🆕";
      case "FLASH_SALE":
        return "⚡";
      case "WISHLIST_UPDATE":
        return "❤️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ORDER_UPDATE":
        return "text-blue-600";
      case "PAYMENT_UPDATE":
        return "text-green-600";
      case "SHIPMENT_UPDATE":
        return "text-purple-600";
      case "PRODUCT_LAUNCH":
        return "text-orange-600";
      case "FLASH_SALE":
        return "text-red-600";
      case "WISHLIST_UPDATE":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "text-red-600 border-red-200";
      case "HIGH":
        return "text-orange-600 border-orange-200";
      case "MEDIUM":
        return "text-yellow-600 border-yellow-200";
      case "LOW":
        return "text-green-600 border-green-200";
      default:
        return "text-gray-600 border-gray-200";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="notification-dropdown">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${className}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-80 dropdown-enhanced dropdown-positioned"
          sideOffset={4}
          forceMount
        >
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold text-foreground">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-7 px-3 text-sm font-medium"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />

          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading notifications...
                </span>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-base font-semibold text-foreground mb-2">
                  No notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className={`p-3 cursor-pointer ${
                      !notification.isRead
                        ? "bg-blue-50 border-l-2 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <Link
                      href={notification.url || "/account/notifications"}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.isRead
                        )
                      }
                      className="flex items-start space-x-3 w-full"
                    >
                      <div
                        className={`flex-shrink-0 mt-0.5 ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        <span className="text-sm">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p
                            className={`text-sm font-medium truncate ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(
                                notification.priority
                              )}`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </ScrollArea>

          {recentNotifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/account/notifications"
                  className="flex items-center justify-center w-full py-3 text-sm font-semibold text-foreground hover:text-primary"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}













