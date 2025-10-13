"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageSkeleton } from "@/components/admin/skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  Loader2,
} from "lucide-react";
import { useAdminReports } from "@/hooks/useApi";

const reportTypes = [
  { value: "SALES", label: "Sales Report", icon: TrendingUp },
  { value: "INVENTORY", label: "Inventory Report", icon: Package },
  { value: "CUSTOMER", label: "Customer Report", icon: Users },
  { value: "PRODUCT", label: "Product Report", icon: BarChart3 },
];

export default function AdminReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    format: "PDF",
  });

  const {
    reports,
    total,
    isLoading,
    error,
    generateReport,
    downloadReport,
    mutate,
  } = useAdminReports({
    page,
    limit,
    search: searchTerm || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "GENERATED":
        return "bg-green-100 text-green-800";
      case "GENERATING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SALES":
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "INVENTORY":
        return <Package className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "CUSTOMER":
        return <Users className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "PRODUCT":
        return <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const handleGenerateReport = async () => {
    if (
      !generateForm.type ||
      !generateForm.startDate ||
      !generateForm.endDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      // Create period string from start and end dates
      const period = `${generateForm.startDate} to ${generateForm.endDate}`;

      const response = await generateReport({
        type: generateForm.type,
        period: period,
        format: generateForm.format,
      });

      if (response.success) {
        alert("Report generation started successfully!");
        setGenerateForm({
          type: "",
          startDate: "",
          endDate: "",
          format: "PDF",
        });
      } else {
        alert(
          "Failed to generate report: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const blob = await downloadReport(reportId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Reports
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Generate dan kelola laporan bisnis
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Generate Report</span>
                <span className="sm:hidden">Generate</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-base">
                  Generate New Report
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Create a new business report with custom parameters.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-type" className="text-xs sm:text-sm">
                    Report Type
                  </Label>
                  <Select
                    value={generateForm.type}
                    onValueChange={(value) =>
                      setGenerateForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              {type.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-xs sm:text-sm">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      id="start-date"
                      value={generateForm.startDate}
                      onChange={(e) =>
                        setGenerateForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs sm:text-sm">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      id="end-date"
                      value={generateForm.endDate}
                      onChange={(e) =>
                        setGenerateForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="format" className="text-xs sm:text-sm">
                    Format
                  </Label>
                  <Select
                    value={generateForm.format}
                    onValueChange={(value) =>
                      setGenerateForm((prev) => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EXCEL">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-6"
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Quick Report Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {reportTypes.map((type) => (
            <Card
              key={type.value}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <type.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">
                      {type.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Generate report
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SALES">Sales</SelectItem>
                    <SelectItem value="INVENTORY">Inventory</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="GENERATED">Generated</SelectItem>
                    <SelectItem value="GENERATING">Generating</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm sm:text-base">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generated Reports ({reports?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
                <span className="ml-2 text-xs sm:text-sm">
                  Loading reports...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-xs sm:text-sm">
                  Error loading reports: {error.message}
                </p>
                <Button
                  onClick={() => mutate()}
                  className="mt-4 text-xs sm:text-sm"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        {getTypeIcon(report.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold truncate">
                          {report.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {report.period}
                          </span>
                          <span>{report.size}</span>
                          <span className="uppercase">{report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="View Report"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Download Report"
                          disabled={report.status !== "GENERATED"}
                          onClick={() => handleDownloadReport(report.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No Reports Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  No reports match your current filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
