"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Mail, Plus, Settings } from "lucide-react"

interface ScheduledReport {
  id: string
  name: string
  description: string
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  format: "pdf" | "excel" | "csv"
  recipients: string[]
  nextRun: Date
  lastRun?: Date
  isActive: boolean
  template: string
}

const mockScheduledReports: ScheduledReport[] = [
  {
    id: "1",
    name: "Daily Production Summary",
    description: "Automated daily production metrics report",
    frequency: "daily",
    format: "pdf",
    recipients: ["manager@company.com", "supervisor@company.com"],
    nextRun: new Date("2024-01-10T08:00:00"),
    lastRun: new Date("2024-01-09T08:00:00"),
    isActive: true,
    template: "production-summary",
  },
  {
    id: "2",
    name: "Weekly Quality Report",
    description: "Comprehensive quality control analysis",
    frequency: "weekly",
    format: "excel",
    recipients: ["quality@company.com", "director@company.com"],
    nextRun: new Date("2024-01-15T09:00:00"),
    lastRun: new Date("2024-01-08T09:00:00"),
    isActive: true,
    template: "quality-analysis",
  },
  {
    id: "3",
    name: "Monthly Logistics Review",
    description: "Monthly logistics performance and efficiency report",
    frequency: "monthly",
    format: "pdf",
    recipients: ["logistics@company.com"],
    nextRun: new Date("2024-02-01T10:00:00"),
    isActive: false,
    template: "logistics-performance",
  },
]

export function ScheduledReports() {
  const [reports, setReports] = useState(mockScheduledReports)
  const [showNewReportForm, setShowNewReportForm] = useState(false)
  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    frequency: "weekly" as const,
    format: "pdf" as const,
    recipients: "",
    template: "",
  })

  const toggleReportStatus = (reportId: string) => {
    setReports((prev) =>
      prev.map((report) => (report.id === reportId ? { ...report, isActive: !report.isActive } : report)),
    )
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-blue-100 text-blue-800"
      case "weekly":
        return "bg-green-100 text-green-800"
      case "monthly":
        return "bg-purple-100 text-purple-800"
      case "quarterly":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateReport = () => {
    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      description: newReport.description,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients.split(",").map((email) => email.trim()),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      isActive: true,
      template: newReport.template,
    }

    setReports((prev) => [...prev, report])
    setNewReport({
      name: "",
      description: "",
      frequency: "weekly",
      format: "pdf",
      recipients: "",
      template: "",
    })
    setShowNewReportForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Scheduled Reports</h3>
          <p className="text-muted-foreground">Automate report generation and distribution</p>
        </div>
        <Button onClick={() => setShowNewReportForm(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Schedules</p>
                <p className="text-2xl font-bold text-green-600">{reports.filter((r) => r.isActive).length}</p>
              </div>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Report</p>
                <p className="text-2xl font-bold text-blue-600">2h</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reports This Week</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">98%</p>
              </div>
              <Settings className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Report Form */}
      {showNewReportForm && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Report</CardTitle>
            <CardDescription>Create a new automated report schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Report Name</label>
                <Input
                  placeholder="Enter report name"
                  value={newReport.name}
                  onChange={(e) => setNewReport((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Template</label>
                <Select
                  value={newReport.template}
                  onValueChange={(value) => setNewReport((prev) => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production-summary">Production Summary</SelectItem>
                    <SelectItem value="quality-analysis">Quality Analysis</SelectItem>
                    <SelectItem value="logistics-performance">Logistics Performance</SelectItem>
                    <SelectItem value="maintenance-report">Maintenance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter report description"
                value={newReport.description}
                onChange={(e) => setNewReport((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Frequency</label>
                <Select
                  value={newReport.frequency}
                  onValueChange={(value: any) => setNewReport((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={newReport.format}
                  onValueChange={(value: any) => setNewReport((prev) => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Recipients (comma-separated)</label>
                <Input
                  placeholder="email1@company.com, email2@company.com"
                  value={newReport.recipients}
                  onChange={(e) => setNewReport((prev) => ({ ...prev, recipients: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateReport} className="bg-red-600 hover:bg-red-700">
                Create Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowNewReportForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{report.name}</h3>
                    <Badge className={getFrequencyColor(report.frequency)}>{report.frequency.toUpperCase()}</Badge>
                    <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                    {report.isActive ? (
                      <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
                    ) : (
                      <Badge variant="secondary">PAUSED</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{report.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Next Run</p>
                      <p className="font-medium">{report.nextRun.toLocaleString()}</p>
                    </div>
                    {report.lastRun && (
                      <div>
                        <p className="text-muted-foreground">Last Run</p>
                        <p className="font-medium">{report.lastRun.toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Recipients</p>
                      <p className="font-medium">{report.recipients.length} recipients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={report.isActive} onCheckedChange={() => toggleReportStatus(report.id)} />
                      <span className="text-sm">{report.isActive ? "Active" : "Paused"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Run Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
