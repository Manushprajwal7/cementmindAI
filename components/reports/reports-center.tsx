"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Download,
  FileText,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportTemplate, GeneratedReport } from "@/types/reports";
import { ScheduledReports } from "./scheduled-reports";
import { CustomReportBuilder } from "./custom-report-builder";
import { ReportSharing } from "./report-sharing";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const reportTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Daily Production Summary",
    description: "Comprehensive overview of daily cement production metrics",
    category: "production",
    frequency: "daily",
    format: "pdf",
    lastGenerated: new Date("2024-01-09T08:00:00"),
  },
  {
    id: "2",
    name: "Quality Control Analysis",
    description: "Detailed quality metrics and compliance report",
    category: "quality",
    frequency: "weekly",
    format: "excel",
    lastGenerated: new Date("2024-01-08T16:30:00"),
  },
  {
    id: "3",
    name: "Logistics Performance",
    description: "Truck scheduling efficiency and delivery metrics",
    category: "logistics",
    frequency: "weekly",
    format: "pdf",
  },
  {
    id: "4",
    name: "Anomaly Incidents Report",
    description: "Summary of detected anomalies and corrective actions",
    category: "maintenance",
    frequency: "monthly",
    format: "excel",
  },
];

const recentReports: GeneratedReport[] = [
  {
    id: "1",
    templateId: "1",
    name: "Daily Production Summary - Jan 9, 2024",
    generatedAt: new Date("2024-01-09T08:00:00"),
    size: "2.4 MB",
    downloadUrl: "#",
    status: "ready",
  },
  {
    id: "2",
    templateId: "2",
    name: "Quality Control Analysis - Week 1",
    generatedAt: new Date("2024-01-08T16:30:00"),
    size: "1.8 MB",
    downloadUrl: "#",
    status: "ready",
  },
  {
    id: "3",
    templateId: "1",
    name: "Daily Production Summary - Jan 8, 2024",
    generatedAt: new Date("2024-01-08T08:00:00"),
    size: "2.2 MB",
    downloadUrl: "#",
    status: "ready",
  },
];

export function ReportsCenter() {
  const { currentData, error, loading, lastUpdate } = useRealTimeData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [reportData, setReportData] = useState({
    templates: reportTemplates,
    generatedReports: recentReports,
    analytics: {},
  });

  useEffect(() => {
    if (currentData && !loading) {
      setReportData({
        templates: reportTemplates,
        generatedReports: recentReports,
        analytics: {},
      });
    }
  }, [currentData, loading]);

  const filteredTemplates = reportTemplates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = (templateId: string) => {
    console.log("[v0] Generating report for template:", templateId);
    // Simulate report generation
  };

  const handleDownloadReport = (reportId: string) => {
    console.log("[v0] Downloading report:", reportId);
    // Simulate download
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
          <p className="text-gray-600 mt-1">
            Generate and download production reports
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="builder">Custom Builder</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search report templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Frequency: {template.frequency}</span>
                    <span>Format: {template.format.toUpperCase()}</span>
                  </div>
                  {template.lastGenerated && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last: {template.lastGenerated.toLocaleDateString()}
                    </div>
                  )}
                  <Button
                    onClick={() => handleGenerateReport(template.id)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{report.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Generated: {report.generatedAt.toLocaleString()}
                        </span>
                        <span>Size: {report.size}</span>
                        <Badge
                          variant={
                            report.status === "ready" ? "default" : "secondary"
                          }
                          className={
                            report.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={report.status !== "ready"}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <ScheduledReports />
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <ReportSharing reports={recentReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
