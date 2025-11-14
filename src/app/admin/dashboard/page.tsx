"use client";

import { useMemo, useState } from "react";
import { useAdminAccess } from "@/components/guards/admin-guard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAdminAnalytics } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  MoreHorizontal,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { user, isAdmin, isStaff } = useAdminAccess();
  const { data, isLoading, error } = useAdminDashboard();
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const { analytics: analyticsData, isLoading: analyticsLoading } =
    useAdminAnalytics({
      period: "30",
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth.toFixed(1)}%`;
  };

  const stats = data?.stats
    ? [
        {
          title: "Total Users",
          value: formatNumber(data.stats.totalUsers),
          change: formatGrowth(data.stats.userGrowth),
          changeType:
            data.stats.userGrowth >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: Users,
        },
        {
          title: "Total Products",
          value: formatNumber(data.stats.totalProducts),
          change: formatGrowth(data.stats.productGrowth),
          changeType:
            data.stats.productGrowth >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: Package,
        },
        {
          title: "Total Orders",
          value: formatNumber(data.stats.totalOrders),
          change: formatGrowth(data.stats.orderGrowth),
          changeType:
            data.stats.orderGrowth >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: ShoppingCart,
        },
        {
          title: "Revenue",
          value: formatCurrency(data.stats.totalRevenue),
          change: formatGrowth(data.stats.revenueGrowth),
          changeType:
            data.stats.revenueGrowth >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: DollarSign,
        },
      ]
    : [];

  const recentOrders = data?.recentOrders || [];

  const chartData = useMemo(
    () =>
      analyticsData?.salesData?.map((item) => ({
        month: item.month,
        sales: item.sales,
      })) || [],
    [analyticsData?.salesData]
  );

  const chartTypeOptions = [
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "line", label: "Line Chart", icon: LineChartIcon },
    { value: "pie", label: "Pie Chart", icon: PieChartIcon },
  ] as const;

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="text-center py-4 text-xs text-gray-500">
          No sales data available.
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    };

    const axisStyle = {
      fontSize: "10px",
      fill: "#6b7280",
    };

    const tickStyle = {
      fontSize: "9px",
      fill: "#9ca3af",
    };

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                style={axisStyle}
                tick={tickStyle}
                tickMargin={5}
              />
              <YAxis
                tickFormatter={(value) => {
                  const formatted = formatCurrency(value);
                  return formatted.length > 12
                    ? formatted.replace("Rp", "Rp").substring(0, 10) + ".."
                    : formatted.replace("Rp", "Rp");
                }}
                style={axisStyle}
                tick={tickStyle}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: "11px", padding: "6px" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
                activeDot={{ r: 4 }}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: "11px", padding: "6px" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Pie
                data={chartData}
                dataKey="sales"
                nameKey="month"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.month}
                    fill={
                      ["#6366f1", "#22c55e", "#f97316", "#14b8a6"][index % 4]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                style={axisStyle}
                tick={tickStyle}
                tickMargin={5}
              />
              <YAxis
                tickFormatter={(value) => {
                  const formatted = formatCurrency(value);
                  return formatted.length > 12
                    ? formatted.replace("Rp", "Rp").substring(0, 10) + ".."
                    : formatted.replace("Rp", "Rp");
                }}
                style={axisStyle}
                tick={tickStyle}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: "11px", padding: "6px" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Bar dataKey="sales" fill="#2563eb" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {isAdmin ? "Administrator" : "Staff"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Recent Orders ({recentOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                    Items
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">Total</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                    Payment
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm hidden xl:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="font-medium truncate max-w-20 sm:max-w-none">
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">
                          {order.customer}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customer}@example.com
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {order.items && order.items.length > 0
                        ? `${order.items.reduce(
                            (sum, item) => sum + (item.quantity || 0),
                            0
                          )} items`
                        : "0 items"}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
                      {getPaymentStatusBadge("pending")}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs sm:text-sm">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      >
                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base lg:text-lg font-medium mb-2">
                No recent orders found
              </p>
              <p className="text-xs sm:text-sm">
                Orders will appear here once customers start placing them
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
            <CardTitle className="flex items-center text-xs sm:text-sm">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Sales Trend
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] sm:text-xs h-7"
                >
                  {
                    chartTypeOptions.find(
                      (option) => option.value === chartType
                    )?.label
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {chartTypeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setChartType(option.value)}
                    className={
                      chartType === option.value ? "bg-accent" : undefined
                    }
                  >
                    <option.icon className="w-3 h-3 mr-2" />
                    <span className="text-xs">{option.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                <span className="ml-2 text-[10px] sm:text-xs">
                  Loading sales data...
                </span>
              </div>
            ) : (
              renderChart()
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-white shadow-sm border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xs sm:text-sm">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                <span className="ml-2 text-[10px] sm:text-xs">
                  Loading products...
                </span>
              </div>
            ) : analyticsData?.topProducts && analyticsData.topProducts.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium truncate max-w-[120px] sm:max-w-none">
                          {product.name}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-gray-500">
                No top products data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Manage Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add, edit, or remove products from your store.
            </p>
            <a
              href="/admin/products"
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
            >
              Go to Products →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              View Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Track and manage customer orders.
            </p>
            <a
              href="/admin/orders"
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
            >
              Go to Orders →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Manage Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View and manage user accounts.
            </p>
            <a
              href="/admin/users"
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
            >
              Go to Users →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
