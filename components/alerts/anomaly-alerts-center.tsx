"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Download, RefreshCw, Settings, AlertTriangle } from "lucide-react"
import { AlertsTable } from "./alerts-table"
import { AnomalyModal } from "./anomaly-modal"
import { LiveEventToast } from "./live-event-toast"
import { BulkActionsPanel } from "./bulk-actions-panel"
import { AlertRoutingConfig } from "./alert-routing-config"
import { IncidentTimeline } from "./incident-timeline"
import { AlertCorrelation } from "./alert-correlation"
import type { AnomalyDetail } from "@/types/anomaly"

// Mock anomaly data
const generateMockAnomalies = (): AnomalyDetail[] => {
  const anomalies: AnomalyDetail[] = []
  const now = new Date()

  const types = ["Temperature Spike", "Pressure Drop", "Flow Irregularity", "Energy Anomaly", "Quality Deviation"]
  const severities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"]
  const statuses: Array<"new" | "acknowledged" | "investigating" | "resolved"> = [
    "new",
    "acknowledged",
    "investigating",
    "resolved",
  ]

  for (let i = 0; i < 150; i++) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000) // Every 5 minutes
    const type = types[Math.floor(Math.random() * types.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    anomalies.push({
      id: `anomaly-${i + 1}`,
      timestamp: timestamp.toISOString(),
      type,
      severity,
      confidence: 0.6 + Math.random() * 0.4,
      status,
      affected_sensors: [
        {
          sensor: `Sensor-${Math.floor(Math.random() * 10) + 1}`,
          current_value: 1450 + Math.random() * 100,
          expected_range: [1400, 1500],
          deviation_percent: 5 + Math.random() * 15,
        },
      ],
      potential_causes: [
        "Equipment malfunction",
        "Process parameter drift",
        "Material quality variation",
        "Environmental factors",
      ],
      recommended_actions: [
        "Check equipment calibration",
        "Adjust process parameters",
        "Inspect material quality",
        "Monitor environmental conditions",
      ],
      description: `${type} detected in system monitoring with ${((0.6 + Math.random() * 0.4) * 100).toFixed(
        1,
      )}% confidence`,
      assignee: Math.random() > 0.5 ? "J. Smith" : null,
    })
  }

  return anomalies
}

export function AnomalyAlertsCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyDetail | null>(null)
  const [anomalies] = useState(generateMockAnomalies())
  const [selectedAnomalies, setSelectedAnomalies] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showRoutingConfig, setShowRoutingConfig] = useState(false)
  const [showIncidentTimeline, setShowIncidentTimeline] = useState(false)
  const [showCorrelation, setShowCorrelation] = useState(false)
  const [activeTab, setActiveTab] = useState<"alerts" | "routing" | "timeline" | "correlation">("alerts")

  const filteredAnomalies = anomalies.filter((anomaly) => {
    const matchesSearch =
      searchTerm === "" ||
      anomaly.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || anomaly.severity === severityFilter
    const matchesStatus = statusFilter === "all" || anomaly.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const severityCounts = {
    critical: anomalies.filter((a) => a.severity === "critical" && a.status !== "resolved").length,
    high: anomalies.filter((a) => a.severity === "high" && a.status !== "resolved").length,
    medium: anomalies.filter((a) => a.severity === "medium" && a.status !== "resolved").length,
    low: anomalies.filter((a) => a.severity === "low" && a.status !== "resolved").length,
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAnomalies(filteredAnomalies.map((a) => a.id))
    } else {
      setSelectedAnomalies([])
    }
  }

  const handleSelectAnomaly = (anomalyId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnomalies((prev) => [...prev, anomalyId])
    } else {
      setSelectedAnomalies((prev) => prev.filter((id) => id !== anomalyId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Anomaly & Alerts Center</h2>
          <p className="text-muted-foreground">Monitor and manage system anomalies and alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowCorrelation(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Correlation
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowRoutingConfig(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Routing
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "alerts" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("alerts")}
          className="flex-1"
        >
          Alerts
        </Button>
        <Button
          variant={activeTab === "timeline" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("timeline")}
          className="flex-1"
        >
          Timeline
        </Button>
        <Button
          variant={activeTab === "correlation" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("correlation")}
          className="flex-1"
        >
          Correlation
        </Button>
        <Button
          variant={activeTab === "routing" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("routing")}
          className="flex-1"
        >
          Routing
        </Button>
      </div>

      {activeTab === "alerts" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-red-600">{severityCounts.critical}</p>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High</p>
                    <p className="text-2xl font-bold text-orange-600">{severityCounts.high}</p>
                  </div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medium</p>
                    <p className="text-2xl font-bold text-amber-600">{severityCounts.medium}</p>
                  </div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low</p>
                    <p className="text-2xl font-bold text-blue-600">{severityCounts.low}</p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedAnomalies.length > 0 && (
            <BulkActionsPanel
              selectedCount={selectedAnomalies.length}
              selectedAnomalies={selectedAnomalies}
              onClearSelection={() => setSelectedAnomalies([])}
              onBulkAction={(action) => {
                console.log(`Bulk ${action} for`, selectedAnomalies)
                setSelectedAnomalies([])
              }}
            />
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Filters & Search</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedAnomalies.length === filteredAnomalies.length && filteredAnomalies.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search anomalies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAnomalies.length} of {anomalies.length} anomalies
            </p>
            <Badge variant="outline">{filteredAnomalies.filter((a) => a.status === "new").length} New Alerts</Badge>
          </div>

          <AlertsTable
            data={filteredAnomalies}
            onRowClick={setSelectedAnomaly}
            selectedAnomalies={selectedAnomalies}
            onSelectAnomaly={handleSelectAnomaly}
          />
        </>
      )}

      {activeTab === "timeline" && <IncidentTimeline anomalies={anomalies} />}

      {activeTab === "correlation" && <AlertCorrelation anomalies={anomalies} />}

      {activeTab === "routing" && <AlertRoutingConfig />}

      {selectedAnomaly && <AnomalyModal anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} />}

      <LiveEventToast />
    </div>
  )
}
