"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminNotifications } from "./useApi";

export interface HeaderNotification {
  id: string;
  title: string;
  description: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  isRead: boolean;
  createdAt: string;
  url?: string;
}

export const useHeaderNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<
    HeaderNotification[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { notifications, isLoading, markAsRead, mutate } =
    useAdminNotifications({
      page: 1,
      limit: 5,
      // Remove all filters to prevent validation errors
    });

  // Update unread count and recent notifications
  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter((n: any) => !n.isRead);
      setUnreadCount(unread.length);

      // Get recent notifications (last 5)
      const recent = notifications
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((notification: any) => ({
          id: notification.id,
          title: notification.title,
          description: notification.description || notification.message,
          type: notification.type as "SUCCESS" | "WARNING" | "ERROR" | "INFO",
          priority: notification.priority as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "URGENT",
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          url: notification.url,
        }));

      setRecentNotifications(recent);
    }
  }, [notifications]);

  const markAsReadHandler = useCallback(
    async (notificationId: string) => {
      try {
        await markAsRead(notificationId);
        // Update local state instead of refetching
        setRecentNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [markAsRead]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = recentNotifications.filter((n) => !n.isRead);
      await Promise.all(
        unreadNotifications.map((notification) => markAsRead(notification.id))
      );
      // Update local state instead of refetching
      setRecentNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [recentNotifications, markAsRead]);

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
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return {
    unreadCount,
    recentNotifications,
    isDropdownOpen,
    setIsDropdownOpen,
    markAsRead: markAsReadHandler,
    markAllAsRead,
    isLoading,
    getNotificationIcon,
    getNotificationColor,
    getPriorityColor,
    formatTimeAgo,
    refresh: mutate,
  };
};
