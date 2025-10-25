"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Eye,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useApi";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [isExporting, setIsExporting] = useState(false);

  const { analytics, isLoading, error, mutate } = useAdminAnalytics({
    period: period,
  });
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="completed">Completed</Badge>;
      case "SHIPPED":
        return <Badge variant="info">Shipped</Badge>;
      case "PENDING":
        return <Badge variant="pending">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleExport = () => {
    if (!analytics) {
      alert("No analytics data available to export");
      return;
    }

    setIsExporting(true);

    try {
      // Create CSV content for analytics data
      const headers = ["Metric", "Value", "Growth %", "Period"];

      const csvData = [
        [
          "Total Revenue",
          formatCurrency(analytics.overview.totalRevenue),
          `${analytics.overview.revenueGrowth}%`,
          `${period} days`,
        ],
        [
          "Total Orders",
          analytics.overview.totalOrders.toString(),
          `${analytics.overview.ordersGrowth}%`,
          `${period} days`,
        ],
        [
          "Total Customers",
          analytics.overview.totalCustomers.toString(),
          `${analytics.overview.customersGrowth}%`,
          `${period} days`,
        ],
        [
          "Total Products",
          analytics.overview.totalProducts.toString(),
          "0%",
          `${period} days`,
        ],
      ];

      // Add sales data
      const salesData = analytics.salesData.map((item) => [
        `Sales - ${item.month}`,
        formatCurrency(item.sales),
        "0%",
        `${period} days`,
      ]);

      // Add top products data
      const topProductsData = analytics.topProducts.map((product, index) => [
        `Top Product ${index + 1} - ${product.name}`,
        formatCurrency(product.revenue),
        `${product.sales} units sold`,
        `${period} days`,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ...salesData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ...topProductsData.map((row) =>
          row.map((cell) => `"${cell}"`).join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_${period}days_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Analytics data exported successfully!");
    } catch (error) {
      console.error("Error exporting analytics:", error);
      alert("Failed to export analytics data. Please try again.");
    } finally {
      setIsExporting(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Dashboard analitik dan laporan performa bisnis
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 text-xs sm:text-sm">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={handleExport}
              disabled={isExporting || !analytics}
            >
              {isExporting ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "Export"}
              </span>
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-8"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {analytics?.overview
                      ? formatCurrency(analytics.overview.totalRevenue)
                      : "Loading..."}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                    <span className="text-xs sm:text-sm text-green-600">
                      +{analytics?.overview?.revenueGrowth || 0}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {analytics?.overview?.totalOrders || 0}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                    <span className="text-xs sm:text-sm text-green-600">
                      +{analytics?.overview?.ordersGrowth || 0}%
                    </span>
                  </div>
                </div>
                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {analytics?.overview?.totalCustomers || 0}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                    <span className="text-xs sm:text-sm text-green-600">
                      +{analytics?.overview?.customersGrowth || 0}%
                    </span>
                  </div>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {analytics?.overview?.totalProducts || 0}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {analytics?.overview?.productsGrowth || 0}%
                    </span>
                  </div>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
                  <span className="ml-2 text-xs sm:text-sm">
                    Loading sales data...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-xs sm:text-sm">
                    Error loading sales data: {error.message}
                  </p>
                  <Button
                    onClick={() => mutate()}
                    className="mt-4 text-xs sm:text-sm"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics?.salesData?.map((data, index) => (
                    <div
                      key={`${data.month}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (data.sales /
                                  Math.max(
                                    ...(analytics.salesData?.map(
                                      (d) => d.sales
                                    ) || [0])
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 w-20 text-right">
                          {formatCurrency(data.sales)}
                        </span>
                      </div>
                    </div>
                  )) || []}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topProducts?.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-green-600">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analytics?.recentOrders?.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium truncate">
                        {order.customer}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        Order #{order.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                    <span className="text-sm sm:text-base font-semibold text-right sm:text-left">
                      {formatCurrency(order.amount)}
                    </span>
                    <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
                      {getStatusBadge(order.status)}
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">{order.date}</span>
                        <span className="sm:hidden">
                          {new Date(order.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
