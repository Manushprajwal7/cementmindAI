"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Calendar, User, Shield, AlertTriangle } from "lucide-react"

interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high" | "critical"
  category: "authentication" | "data_access" | "configuration" | "system" | "security"
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-09T16:45:00"),
    userId: "user-001",
    userName: "John Smith",
    action: "LOGIN_SUCCESS",
    resource: "Authentication System",
    details: "User successfully logged in",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "low",
    category: "authentication",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-09T16:30:00"),
    userId: "user-002",
    userName: "Maria Garcia",
    action: "REPORT_GENERATED",
    resource: "Quality Control Report",
    details: "Generated weekly quality control analysis report",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "low",
    category: "data_access",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-09T16:15:00"),
    userId: "user-001",
    userName: "John Smith",
    action: "USER_CREATED",
    resource: "User Management",
    details: "Created new user account for Sarah Wilson",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "medium",
    category: "configuration",
  },
  {
    id: "4",
    timestamp: new Date("2024-01-09T15:45:00"),
    userId: "user-003",
    userName: "Robert Johnson",
    action: "ALERT_ACKNOWLEDGED",
    resource: "Anomaly Alert #ALT-001",
    details: "Acknowledged high temperature alert in kiln #2",
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "medium",
    category: "system",
  },
  {
    id: "5",
    timestamp: new Date("2024-01-09T15:30:00"),
    userId: "user-001",
    userName: "John Smith",
    action: "PERMISSION_CHANGED",
    resource: "User Permissions",
    details: "Updated permissions for Maria Garcia - added report generation access",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "high",
    category: "security",
  },
  {
    id: "6",
    timestamp: new Date("2024-01-09T14:20:00"),
    userId: "system",
    userName: "System",
    action: "BACKUP_COMPLETED",
    resource: "Database Backup",
    details: "Automated daily backup completed successfully",
    ipAddress: "127.0.0.1",
    userAgent: "System Process",
    severity: "low",
    category: "system",
  },
]

export function AuditLogs() {
  const [logs, setLogs] = useState(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("logs")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "authentication":
        return "bg-green-100 text-green-800"
      case "data_access":
        return "bg-blue-100 text-blue-800"
      case "configuration":
        return "bg-purple-100 text-purple-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      case "security":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Shield className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity

    return matchesSearch && matchesCategory && matchesSeverity
  })

  const exportLogs = () => {
    console.log("[v0] Exporting audit logs:", filteredLogs)
    // Simulate export
  }

  const logStats = {
    total: logs.length,
    critical: logs.filter((l) => l.severity === "critical").length,
    high: logs.filter((l) => l.severity === "high").length,
    security: logs.filter((l) => l.category === "security").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Audit Logs</h3>
          <p className="text-muted-foreground">Track system activities and security events</p>
        </div>
        <Button onClick={exportLogs} className="bg-red-600 hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{logStats.total}</p>
              </div>
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold text-red-600">{logStats.critical}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{logStats.high}</p>
              </div>
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold text-purple-600">{logStats.security}</p>
              </div>
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search logs by user, action, or resource..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="data_access">Data Access</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(log.severity)}
                        <span className="font-medium">{log.action.replace("_", " ")}</span>
                        <Badge className={getSeverityColor(log.severity)}>{log.severity.toUpperCase()}</Badge>
                        <Badge className={getCategoryColor(log.category)}>
                          {log.category.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">User:</span> {log.userName}
                        </div>
                        <div>
                          <span className="font-medium">Resource:</span> {log.resource}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {log.ipAddress}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {log.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm">{log.details}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>User activity patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Activity trends chart would be displayed here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Security-related activities by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["authentication", "data_access", "configuration", "security"].map((category) => {
                    const count = logs.filter((l) => l.category === category).length
                    const percentage = (count / logs.length) * 100
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category.replace("_", " ")}</span>
                          <span>
                            {count} events ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate compliance reports for auditing purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium">SOX Compliance</h4>
                    <p className="text-sm text-muted-foreground mb-3">Financial controls audit trail</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium">ISO 27001</h4>
                    <p className="text-sm text-muted-foreground mb-3">Information security management</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium">GDPR</h4>
                    <p className="text-sm text-muted-foreground mb-3">Data protection compliance</p>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Retention Policies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Authentication Logs</p>
                    <p className="text-muted-foreground">Retained for 2 years</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Data Access Logs</p>
                    <p className="text-muted-foreground">Retained for 7 years</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Configuration Changes</p>
                    <p className="text-muted-foreground">Retained for 5 years</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Security Events</p>
                    <p className="text-muted-foreground">Retained for 10 years</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
