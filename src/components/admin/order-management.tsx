"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useApi";
import { Order } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Search,
  Filter,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface OrderManagementProps {
  userRole?: "ADMIN" | "STAFF";
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  userRole = "STAFF",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  const { orders, error, isLoading, updateOrderStatus, mutateOrders } =
    useOrders({
      status: statusFilter === "all" ? undefined : statusFilter,
      limit: 50,
    });

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      if (response.success) {
        toast.success("Status pesanan berhasil diperbarui");
        setIsUpdateDialogOpen(false);
        setSelectedOrder(null);
        setNewStatus("");
        mutateOrders();
      } else {
        toast.error(response.message || "Gagal memperbarui status pesanan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui status pesanan");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary", label: "Menunggu", icon: Package },
      PROCESSING: { variant: "default", label: "Diproses", icon: Package },
      SHIPPED: { variant: "default", label: "Dikirim", icon: Truck },
      DELIVERED: { variant: "default", label: "Terkirim", icon: CheckCircle },
      CANCELLED: { variant: "destructive", label: "Dibatalkan", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: id });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Terjadi kesalahan saat memuat pesanan: {error.message}
        </p>
        <Button
          onClick={() => mutateOrders()}
          className="mt-4"
          variant="outline"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  const filteredOrders = orders.filter(
    (order: Order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
          <p className="text-muted-foreground">
            Kelola semua pesanan pelanggan dari sini
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{orders.length}</p>
          <p className="text-sm text-muted-foreground">Total Pesanan</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Pesanan</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan ID atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="PROCESSING">Diproses</SelectItem>
                  <SelectItem value="SHIPPED">Dikirim</SelectItem>
                  <SelectItem value="DELIVERED">Terkirim</SelectItem>
                  <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            {filteredOrders.length} pesanan ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada pesanan yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Alamat Pengiriman</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: Order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="font-medium truncate">
                            Produk ID: {order.productId.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{order.quantity}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm truncate">
                            {order.shippingAddress}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* View Order Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Pesanan</DialogTitle>
                                <DialogDescription>
                                  Informasi lengkap pesanan #
                                  {order.id.slice(0, 8)}...
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      ID Pesanan
                                    </label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {order.id}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Status
                                    </label>
                                    <div className="mt-1">
                                      {getStatusBadge(order.status)}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Produk ID
                                    </label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {order.productId}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Jumlah
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {order.quantity}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Total
                                    </label>
                                    <p className="text-sm text-muted-foreground font-medium">
                                      {formatPrice(order.totalAmount)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      Tanggal Dibuat
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(order.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Alamat Pengiriman
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {order.shippingAddress}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Update Status */}
                          {userRole === "ADMIN" && (
                            <Dialog
                              open={isUpdateDialogOpen}
                              onOpenChange={setIsUpdateDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus(order.status);
                                    setIsUpdateDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Update Status Pesanan
                                  </DialogTitle>
                                  <DialogDescription>
                                    Ubah status pesanan #{order.id.slice(0, 8)}
                                    ...
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                      Status Baru
                                    </label>
                                    <Select
                                      value={newStatus}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PENDING">
                                          Menunggu
                                        </SelectItem>
                                        <SelectItem value="PROCESSING">
                                          Diproses
                                        </SelectItem>
                                        <SelectItem value="SHIPPED">
                                          Dikirim
                                        </SelectItem>
                                        <SelectItem value="DELIVERED">
                                          Terkirim
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                          Dibatalkan
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsUpdateDialogOpen(false)
                                      }
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(order.id, newStatus)
                                      }
                                      disabled={newStatus === order.status}
                                    >
                                      Update Status
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More Button */}
      {filteredOrders.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => mutateOrders()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
