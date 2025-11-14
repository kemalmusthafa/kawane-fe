"use client";

import { useMemo, useRef, useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useApi";
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

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [isExporting, setIsExporting] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const exportRef = useRef<HTMLDivElement>(null);

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

  const chartData = useMemo(
    () =>
      analytics?.salesData?.map((item) => ({
        month: item.month,
        sales: item.sales,
      })) || [],
    [analytics?.salesData]
  );

  const chartTypeOptions = [
    { value: "bar", label: "Bar Chart", icon: BarChart3 },
    { value: "line", label: "Line Chart", icon: LineChartIcon },
    { value: "pie", label: "Pie Chart", icon: PieChartIcon },
  ] as const;

  const handleExport = async () => {
    if (!analytics || !exportRef.current) {
      alert("No analytics data available to export");
      return;
    }

    setIsExporting(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { default: JsPDF } = await import("jspdf");

      // Hide buttons and dropdowns before capture
      const buttons = exportRef.current.querySelectorAll("button");
      const selects = exportRef.current.querySelectorAll("select");
      const dropdowns = exportRef.current.querySelectorAll(
        '[role="combobox"], [role="button"]'
      );

      const originalStyles: Array<{ element: HTMLElement; display: string }> =
        [];
      buttons.forEach((btn) => {
        if (
          btn.textContent?.includes("Export") ||
          btn.textContent?.includes("Chart")
        ) {
          originalStyles.push({
            element: btn as HTMLElement,
            display: (btn as HTMLElement).style.display,
          });
          (btn as HTMLElement).style.display = "none";
        }
      });
      selects.forEach((sel) => {
        originalStyles.push({
          element: sel as HTMLElement,
          display: (sel as HTMLElement).style.display,
        });
        (sel as HTMLElement).style.display = "none";
      });

      const canvas = await html2canvas(exportRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
      });

      // Restore original styles
      originalStyles.forEach(({ element, display }) => {
        element.style.display = display;
      });

      const imageData = canvas.toDataURL("image/png", 0.95);

      const pdf = new JsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Analytics Report", margin, 15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Period: Last ${period} days | Generated: ${new Date().toLocaleDateString()}`,
        margin,
        22
      );

      position = 28;

      // Add image
      pdf.addImage(imageData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - position - margin;

      // Handle multiple pages
      while (heightLeft > 0) {
        pdf.addPage();
        position = margin;
        const remainingHeight = Math.min(
          imgHeight + heightLeft,
          pdfHeight - margin * 2
        );
        pdf.addImage(
          imageData,
          "PNG",
          margin,
          position,
          imgWidth,
          remainingHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pdfHeight - margin * 2;
      }

      pdf.save(
        `analytics_${period}days_${new Date().toISOString().split("T")[0]}.pdf`
      );
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

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="text-center py-4 text-xs text-gray-500">
          No sales data available for this period.
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
          <ResponsiveContainer width="100%" height={240}>
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
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  fontSize: "11px",
                  padding: "6px",
                }}
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
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  fontSize: "11px",
                  padding: "6px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Pie
                data={chartData}
                dataKey="sales"
                nameKey="month"
                innerRadius={40}
                outerRadius={80}
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
          <ResponsiveContainer width="100%" height={240}>
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
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  fontSize: "11px",
                  padding: "6px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Bar dataKey="sales" fill="#2563eb" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
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
      ref={exportRef}
    >
      <motion.div
        className="mb-6"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Analytics dashboard and business performance insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                {isExporting ? "Exporting..." : "Export PDF"}
              </span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-4"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold">
                    {analytics?.overview
                      ? formatCurrency(analytics.overview.totalRevenue)
                      : "Loading..."}
                  </p>
                  <div className="flex items-center mt-0.5">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500 mr-0.5" />
                    <span className="text-[10px] sm:text-xs text-green-600">
                      +{analytics?.overview?.revenueGrowth || 0}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold">
                    {analytics?.overview?.totalOrders || 0}
                  </p>
                  <div className="flex items-center mt-0.5">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500 mr-0.5" />
                    <span className="text-[10px] sm:text-xs text-green-600">
                      +{analytics?.overview?.ordersGrowth || 0}%
                    </span>
                  </div>
                </div>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold">
                    {analytics?.overview?.totalCustomers || 0}
                  </p>
                  <div className="flex items-center mt-0.5">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500 mr-0.5" />
                    <span className="text-[10px] sm:text-xs text-green-600">
                      +{analytics?.overview?.customersGrowth || 0}%
                    </span>
                  </div>
                </div>
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold">
                    {analytics?.overview?.totalProducts || 0}
                  </p>
                  <div className="flex items-center mt-0.5">
                    <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 mr-0.5" />
                    <span className="text-[10px] sm:text-xs text-gray-600">
                      {analytics?.overview?.productsGrowth || 0}%
                    </span>
                  </div>
                </div>
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Sales Chart */}
          <Card>
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
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="ml-2 text-[10px] sm:text-xs">
                    Loading sales data...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-red-600 text-[10px] sm:text-xs">
                    Error loading sales data: {error.message}
                  </p>
                  <Button
                    onClick={() => mutate()}
                    className="mt-3 text-[10px] sm:text-xs"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                renderChart()
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {analytics?.topProducts?.map((product, index) => (
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
                )) || []}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xs sm:text-sm">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {analytics?.recentOrders?.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 border rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs font-medium truncate">
                        {order.customer}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                        Order #{order.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className="text-[10px] sm:text-xs font-semibold text-right sm:text-left">
                      {formatCurrency(order.amount)}
                    </span>
                    <div className="flex items-center justify-between sm:justify-start space-x-1.5 sm:space-x-2">
                      {getStatusBadge(order.status)}
                      <div className="flex items-center text-[9px] sm:text-[10px] text-gray-500">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
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
                        className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                      >
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
