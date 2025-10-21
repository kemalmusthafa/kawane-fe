"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  Users,
  Mail,
  Smartphone,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAdminNotifications } from "@/hooks/useApi";
import { toast } from "sonner";
import { Notification } from "@/lib/api";

export default function AdminNotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "",
    priority: "",
    target: "",
  });

  const {
    notifications,
    total,
    isLoading,
    error,
    sendNotification,
    markAsRead,
    deleteNotification,
    mutate,
  } = useAdminNotifications({
    page,
    limit,
    search: searchTerm || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    isRead: statusFilter !== "all" ? statusFilter === "true" : undefined,
    priority: priorityFilter !== "all" ? priorityFilter : undefined,
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "ERROR":
        return <X className="h-4 w-4 text-red-600" />;
      case "INFO":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <Badge variant="success">Success</Badge>;
      case "WARNING":
        return <Badge variant="warning">Warning</Badge>;
      case "ERROR":
        return <Badge variant="danger">Error</Badge>;
      case "INFO":
        return <Badge variant="info">Info</Badge>;
      case "STOCK_ALERT":
        return <Badge variant="warning">Stock Alert</Badge>;
      case "ORDER":
        return <Badge variant="info">Order</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="danger">High</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">Medium</Badge>;
      case "LOW":
        return <Badge variant="default">Low</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  const unreadCount =
    notifications?.filter((n: Notification) => n.status === "UNREAD").length ||
    0;

  const handleFormChange = (field: string, value: string) => {
    setNotificationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendNotification = async () => {
    if (
      !notificationForm.title ||
      !notificationForm.message ||
      !notificationForm.type ||
      !notificationForm.priority ||
      !notificationForm.target
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendNotification(notificationForm);
      toast.success("Notifikasi berhasil dikirim");
      setNotificationForm({
        title: "",
        message: "",
        type: "",
        priority: "",
        target: "",
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim notifikasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      toast.success("Notifikasi ditandai sebagai dibaca");
    } catch (error: any) {
      toast.error(error.message || "Gagal menandai notifikasi");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus notifikasi ini?")) return;

    try {
      await deleteNotification(notificationId);
      toast.success("Notifikasi berhasil dihapus");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus notifikasi");
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Kelola notifikasi sistem dan pengguna
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Send Notification</span>
                  <span className="sm:hidden">Send</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Send Notification
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Send a notification to users or administrators.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Notification title"
                      value={notificationForm.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Notification message"
                      rows={3}
                      value={notificationForm.message}
                      onChange={(e) =>
                        handleFormChange("message", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type" className="text-sm font-medium">
                        Type
                      </Label>
                      <Select
                        value={notificationForm.type}
                        onValueChange={(value) =>
                          handleFormChange("type", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INFO">Info</SelectItem>
                          <SelectItem value="WARNING">Warning</SelectItem>
                          <SelectItem value="ERROR">Error</SelectItem>
                          <SelectItem value="SUCCESS">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium">
                        Priority
                      </Label>
                      <Select
                        value={notificationForm.priority}
                        onValueChange={(value) =>
                          handleFormChange("priority", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="target" className="text-sm font-medium">
                      Target
                    </Label>
                    <Select
                      value={notificationForm.target}
                      onValueChange={(value) =>
                        handleFormChange("target", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Users</SelectItem>
                        <SelectItem value="ADMIN">Admins Only</SelectItem>
                        <SelectItem value="CUSTOMER">Customers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendNotification}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Notification"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Notifications
                  </p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {notifications?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Unread
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Read
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {(notifications?.length || 0) - unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="ml-3 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    High Priority
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    {notifications?.filter(
                      (n: Notification) => n.priority === "HIGH"
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="false">Unread</SelectItem>
                    <SelectItem value="true">Read</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Bell className="w-5 h-5 mr-2" />
              Notifications ({notifications?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-sm sm:text-base">
                  Loading notifications...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-sm sm:text-base">
                  Error loading notifications: {error.message}
                </p>
                <Button onClick={() => mutate()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {notifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 border rounded-lg ${
                      notification.status === "UNREAD"
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base truncate">
                              {notification.title}
                            </h3>
                            {notification.status === "UNREAD" && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                            {notification.message}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                            <span>
                              {format(
                                new Date(notification.createdAt),
                                "dd MMM yyyy, HH:mm",
                                { locale: id }
                              )}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>Target: {notification.target}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {getTypeBadge(notification.type)}
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <div className="flex items-center space-x-1">
                          {notification.status === "UNREAD" && (
                            <Button
                              variant="outline"
                              size="sm"
                              title="Mark as Read"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No Notifications Found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  No notifications match your current filters
                </p>
                <Button onClick={() => mutate()} variant="outline">
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {total > limit && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, total)} of {total} notifications
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  <span className="text-xs sm:text-sm px-2">
                    Page {page} of {Math.ceil(total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(total / limit)}
                    className="text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
