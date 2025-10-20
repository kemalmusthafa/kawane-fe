"use client";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useDashboard, useInventory } from "@/hooks/useApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  userRole?: "ADMIN" | "STAFF";
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole = "STAFF" }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("30"); // days

  const {
    dashboardStats,
    error: dashboardError,
    isLoading: dashboardLoading,
  } = useDashboard({
    startDate: new Date(
      Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000
    ).toISOString(),
    endDate: new Date().toISOString(),
  });

  const {
    stockSummary,
    lowStockProducts,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useInventory();

  const handleRefresh = () => {
    // SWR will automatically refetch when we call mutate
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "PAID":
        return "text-blue-600 bg-blue-100";
      case "SHIPPED":
        return "text-purple-600 bg-purple-100";
      case "DELIVERED":
        return "text-green-600 bg-green-100";
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (dashboardLoading || inventoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardError || inventoryError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Terjadi kesalahan saat memuat data dashboard
          </p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const stats = dashboardStats?.data;
  const summary = stockSummary?.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name}! Here's what's happening with your
              store.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor((stats?.totalUsers || 0) * 0.1)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.lowStockProducts || 0} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor((stats?.totalOrders || 0) * 0.15)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {(stats?.totalRevenue || 0).toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor((stats?.totalRevenue || 0) * 0.2)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Orders
              </CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Stock Alerts
              </CardTitle>
              <Link href="/admin/inventory">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts?.data && lowStockProducts.data.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.data.slice(0, 5).map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        SKU: {product.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          product.stock === 0 ? "destructive" : "secondary"
                        }
                      >
                        {product.stock} left
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">All products are well stocked</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/products">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <Package className="w-6 h-6 mb-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 mb-2" />
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <Users className="w-6 h-6 mb-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center"
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                Inventory
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
