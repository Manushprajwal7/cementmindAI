"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Mail, Link, Users, Eye } from "lucide-react"
import type { GeneratedReport } from "@/types/reports"

interface SharedReport {
  id: string
  reportId: string
  reportName: string
  sharedWith: string[]
  permissions: "view" | "download" | "full"
  expiresAt?: Date
  shareLink?: string
  isPublic: boolean
  accessCount: number
  lastAccessed?: Date
}

const mockSharedReports: SharedReport[] = [
  {
    id: "1",
    reportId: "1",
    reportName: "Daily Production Summary - Jan 9, 2024",
    sharedWith: ["manager@company.com", "supervisor@company.com"],
    permissions: "download",
    expiresAt: new Date("2024-01-16T23:59:59"),
    shareLink: "https://reports.company.com/shared/abc123",
    isPublic: false,
    accessCount: 12,
    lastAccessed: new Date("2024-01-09T16:30:00"),
  },
  {
    id: "2",
    reportId: "2",
    reportName: "Quality Control Analysis - Week 1",
    sharedWith: ["quality@company.com", "director@company.com", "auditor@company.com"],
    permissions: "view",
    expiresAt: new Date("2024-01-20T23:59:59"),
    isPublic: true,
    accessCount: 8,
    lastAccessed: new Date("2024-01-09T14:15:00"),
  },
]

interface ReportSharingProps {
  reports: GeneratedReport[]
}

export function ReportSharing({ reports }: ReportSharingProps) {
  const [sharedReports, setSharedReports] = useState(mockSharedReports)
  const [activeTab, setActiveTab] = useState("shared")
  const [shareForm, setShareForm] = useState({
    reportId: "",
    emails: "",
    message: "",
    permissions: "view" as const,
    expiresIn: "7" as const,
    allowPublic: false,
  })

  const handleShareReport = () => {
    const newShare: SharedReport = {
      id: Date.now().toString(),
      reportId: shareForm.reportId,
      reportName: reports.find((r) => r.id === shareForm.reportId)?.name || "Unknown Report",
      sharedWith: shareForm.emails
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
      permissions: shareForm.permissions,
      expiresAt: new Date(Date.now() + Number.parseInt(shareForm.expiresIn) * 24 * 60 * 60 * 1000),
      shareLink: `https://reports.company.com/shared/${Math.random().toString(36).substr(2, 9)}`,
      isPublic: shareForm.allowPublic,
      accessCount: 0,
    }

    setSharedReports((prev) => [...prev, newShare])
    setShareForm({
      reportId: "",
      emails: "",
      message: "",
      permissions: "view",
      expiresIn: "7",
      allowPublic: false,
    })
  }

  const revokeAccess = (shareId: string) => {
    setSharedReports((prev) => prev.filter((share) => share.id !== shareId))
  }

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link)
    // Show toast notification
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "view":
        return "bg-blue-100 text-blue-800"
      case "download":
        return "bg-green-100 text-green-800"
      case "full":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Report Sharing</h3>
          <p className="text-muted-foreground">Share reports with team members and external stakeholders</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Share2 className="w-4 h-4 mr-2" />
          Share New Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared Reports</p>
                <p className="text-2xl font-bold text-blue-600">{sharedReports.length}</p>
              </div>
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recipients</p>
                <p className="text-2xl font-bold text-green-600">
                  {sharedReports.reduce((sum, report) => sum + report.sharedWith.length, 0)}
                </p>
              </div>
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sharedReports.reduce((sum, report) => sum + report.accessCount, 0)}
                </p>
              </div>
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Reports</p>
                <p className="text-2xl font-bold text-orange-600">{sharedReports.filter((r) => r.isPublic).length}</p>
              </div>
              <Link className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shared">Shared Reports</TabsTrigger>
          <TabsTrigger value="share">Share Report</TabsTrigger>
          <TabsTrigger value="analytics">Access Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="shared" className="space-y-4">
          {sharedReports.map((share) => (
            <Card key={share.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{share.reportName}</h3>
                      <Badge className={getPermissionColor(share.permissions)}>{share.permissions.toUpperCase()}</Badge>
                      {share.isPublic && <Badge className="bg-orange-100 text-orange-800">PUBLIC</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Shared With</p>
                        <p className="font-medium">{share.sharedWith.length} recipients</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Access Count</p>
                        <p className="font-medium">{share.accessCount} views</p>
                      </div>
                      {share.expiresAt && (
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{share.expiresAt.toLocaleDateString()}</p>
                        </div>
                      )}
                      {share.lastAccessed && (
                        <div>
                          <p className="text-muted-foreground">Last Accessed</p>
                          <p className="font-medium">{share.lastAccessed.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {share.sharedWith.slice(0, 3).map((email, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                      {share.sharedWith.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{share.sharedWith.length - 3} more
                        </Badge>
                      )}
                    </div>
                    {share.shareLink && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Share Link:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-background px-2 py-1 rounded flex-1">{share.shareLink}</code>
                          <Button size="sm" variant="outline" onClick={() => copyShareLink(share.shareLink!)}>
                            <Link className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Access
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => revokeAccess(share.id)}>
                      Revoke Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Report</CardTitle>
              <CardDescription>Share a report with team members or external stakeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Report</label>
                    <Select
                      value={shareForm.reportId}
                      onValueChange={(value) => setShareForm((prev) => ({ ...prev, reportId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a report to share" />
                      </SelectTrigger>
                      <SelectContent>
                        {reports.map((report) => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Recipients (comma-separated)</label>
                    <Textarea
                      placeholder="user1@company.com, user2@company.com"
                      value={shareForm.emails}
                      onChange={(e) => setShareForm((prev) => ({ ...prev, emails: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message (optional)</label>
                    <Textarea
                      placeholder="Add a message for recipients"
                      value={shareForm.message}
                      onChange={(e) => setShareForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Permissions</label>
                    <Select
                      value={shareForm.permissions}
                      onValueChange={(value: any) => setShareForm((prev) => ({ ...prev, permissions: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="download">View & Download</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expires In</label>
                    <Select
                      value={shareForm.expiresIn}
                      onValueChange={(value) => setShareForm((prev) => ({ ...prev, expiresIn: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Allow Public Access</label>
                      <p className="text-xs text-muted-foreground">Generate a public link that anyone can access</p>
                    </div>
                    <Switch
                      checked={shareForm.allowPublic}
                      onCheckedChange={(checked) => setShareForm((prev) => ({ ...prev, allowPublic: checked }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleShareReport} className="bg-red-600 hover:bg-red-700 flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Link className="w-4 h-4 mr-2" />
                  Generate Link Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Trends</CardTitle>
                <CardDescription>Report access patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Access trends chart would be displayed here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Reports</CardTitle>
                <CardDescription>Most accessed shared reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sharedReports
                    .sort((a, b) => b.accessCount - a.accessCount)
                    .slice(0, 5)
                    .map((report, index) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{report.reportName}</p>
                            <p className="text-xs text-muted-foreground">{report.sharedWith.length} recipients</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{report.accessCount}</p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
