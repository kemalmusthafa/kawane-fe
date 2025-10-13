"use client";

import { useState } from "react";
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

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  // Temporary static data to prevent infinite loop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const unreadCount = 0; // Static for now
  const recentNotifications: any[] = []; // Static for now
  const isLoading = false;
  const error = null;

  // Mock functions to prevent errors
  const markAsRead = async (id: string) => {};

  const markAllAsRead = async () => {};

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
                      href={notification.url || "/admin/notifications"}
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
                  href="/admin/notifications"
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
