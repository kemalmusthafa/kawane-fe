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

export function NotificationDropdown({ className }: NotificationDropdownProps) {
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
      const countResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api"
        }/admin/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (countResponse.ok) {
        const countData = await countResponse.json();
        setUnreadCount(countData.data.unreadCount || 0);
      }

      // Fetch recent notifications
      const notificationsResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api"
        }/admin/notifications?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setRecentNotifications(notificationsData.data.notifications || []);
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

  // Fetch notifications periodically (reduced frequency to prevent looping)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Every 60 seconds instead of 10 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/admin/notifications/mark-read", {
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
      await fetch("/api/admin/notifications/mark-read", {
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
      case "SUCCESS":
        return "✅";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      case "INFO":
        return "ℹ️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "text-green-600";
      case "WARNING":
        return "text-yellow-600";
      case "ERROR":
        return "text-red-600";
      case "INFO":
        return "text-blue-600";
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
          className="w-80 dropdown-enhanced dropdown-positioned bg-card border-border"
          sideOffset={4}
          forceMount
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-card-foreground">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-6 px-2 text-xs font-medium text-card-foreground hover:bg-accent"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <div className="flex justify-start">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-accent text-accent-foreground">
                  {unreadCount} unread
                </Badge>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />

          <ScrollArea className="h-72">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  Loading notifications...
                </span>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm font-semibold text-foreground mb-1">
                  No notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className={`p-2.5 cursor-pointer hover:bg-accent transition-colors ${
                      !notification.isRead
                        ? "bg-accent/50 border-l-2 border-l-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Link
                      href={notification.url || "/admin/notifications"}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.isRead
                        )
                      }
                      className="flex items-start space-x-2.5 w-full"
                    >
                      <div
                        className={`flex-shrink-0 mt-0.5 ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        <span className="text-xs">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p
                            className={`text-xs font-medium truncate text-card-foreground ${
                              !notification.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 text-card-foreground border-border ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority}
                          </Badge>
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
                  href="/admin/notifications"
                  className="flex items-center justify-center w-full py-2.5 text-xs font-semibold text-card-foreground hover:text-primary transition-colors"
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
