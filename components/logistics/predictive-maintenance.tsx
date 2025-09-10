"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Calendar, Settings, Wrench, TrendingDown, Clock } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"

interface MaintenanceAlert {
  id: string
  truckId: string
  truckNumber: string
  type: "engine" | "brakes" | "tires" | "transmission" | "hydraulics"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  predictedFailureDate: Date
  daysUntilMaintenance: number
  estimatedCost: number
  recommendedAction: string
}

interface MaintenanceSchedule {
  id: string
  truckId: string
  truckNumber: string
  type: string
  scheduledDate: Date
  estimatedDuration: number
  status: "scheduled" | "in-progress" | "completed" | "overdue"
  technician?: string
}

const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: "1",
    truckId: "truck-001",
    truckNumber: "T-001",
    type: "engine",
    severity: "high",
    description: "Engine oil pressure dropping, potential pump failure",
    predictedFailureDate: new Date("2024-01-15"),
    daysUntilMaintenance: 6,
    estimatedCost: 2500,
    recommendedAction: "Schedule oil pump replacement within 7 days",
  },
  {
    id: "2",
    truckId: "truck-002",
    truckNumber: "T-002",
    type: "brakes",
    severity: "medium",
    description: "Brake pad wear exceeding threshold",
    predictedFailureDate: new Date("2024-01-20"),
    daysUntilMaintenance: 11,
    estimatedCost: 800,
    recommendedAction: "Replace brake pads during next scheduled maintenance",
  },
  {
    id: "3",
    truckId: "truck-003",
    truckNumber: "T-003",
    type: "tires",
    severity: "critical",
    description: "Tire tread depth below safety threshold",
    predictedFailureDate: new Date("2024-01-12"),
    daysUntilMaintenance: 3,
    estimatedCost: 1200,
    recommendedAction: "Immediate tire replacement required",
  },
]

const mockMaintenanceSchedule: MaintenanceSchedule[] = [
  {
    id: "1",
    truckId: "truck-001",
    truckNumber: "T-001",
    type: "Routine Service",
    scheduledDate: new Date("2024-01-15T09:00:00"),
    estimatedDuration: 4,
    status: "scheduled",
    technician: "Mike Johnson",
  },
  {
    id: "2",
    truckId: "truck-002",
    truckNumber: "T-002",
    type: "Brake Inspection",
    scheduledDate: new Date("2024-01-12T14:00:00"),
    estimatedDuration: 2,
    status: "in-progress",
    technician: "Sarah Wilson",
  },
  {
    id: "3",
    truckId: "truck-004",
    truckNumber: "T-004",
    type: "Engine Overhaul",
    scheduledDate: new Date("2024-01-08T08:00:00"),
    estimatedDuration: 8,
    status: "overdue",
  },
]

interface PredictiveMaintenanceProps {
  trucks: TruckSchedule[]
}

export function PredictiveMaintenance({ trucks }: PredictiveMaintenanceProps) {
  const [activeTab, setActiveTab] = useState("alerts")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const criticalAlerts = mockMaintenanceAlerts.filter((alert) => alert.severity === "critical")
  const upcomingMaintenance = mockMaintenanceSchedule.filter(
    (item) =>
      item.status === "scheduled" && new Date(item.scheduledDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Predictive Maintenance</h3>
          <p className="text-muted-foreground">AI-powered maintenance scheduling and alerts</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Settings className="w-4 h-4 mr-2" />
          Configure Thresholds
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Maintenance</p>
                <p className="text-2xl font-bold text-amber-600">{upcomingMaintenance.length}</p>
              </div>
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fleet Availability</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Downtime</p>
                <p className="text-2xl font-bold text-blue-600">2.3h</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Maintenance Alerts</TabsTrigger>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {mockMaintenanceAlerts.map((alert) => (
            <Card
              key={alert.id}
              className="border-l-4"
              style={{ borderLeftColor: getSeverityColor(alert.severity).replace("bg-", "#") }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      {alert.truckNumber} - {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Issue
                    </CardTitle>
                    <CardDescription>{alert.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className={`${getSeverityColor(alert.severity)} text-white`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Days Until Maintenance</p>
                    <p className="font-semibold">{alert.daysUntilMaintenance} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="font-semibold">${alert.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Predicted Failure</p>
                    <p className="font-semibold">{alert.predictedFailureDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Level</p>
                    <Progress
                      value={
                        alert.severity === "critical"
                          ? 90
                          : alert.severity === "high"
                            ? 70
                            : alert.severity === "medium"
                              ? 50
                              : 30
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Recommended Action:</p>
                  <p className="text-sm">{alert.recommendedAction}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Schedule Maintenance
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Snooze Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {mockMaintenanceSchedule.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {item.truckNumber} - {item.type}
                      </h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p>Scheduled Date</p>
                        <p className="font-medium text-foreground">{item.scheduledDate.toLocaleString()}</p>
                      </div>
                      <div>
                        <p>Duration</p>
                        <p className="font-medium text-foreground">{item.estimatedDuration} hours</p>
                      </div>
                      {item.technician && (
                        <div>
                          <p>Technician</p>
                          <p className="font-medium text-foreground">{item.technician}</p>
                        </div>
                      )}
                      <div>
                        <p>Status</p>
                        <p className="font-medium text-foreground">{item.status.replace("-", " ")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Trends</CardTitle>
                <CardDescription>Monthly maintenance costs over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Maintenance cost trend chart would be displayed here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fleet Health Score</CardTitle>
                <CardDescription>Overall fleet condition and reliability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Health</span>
                    <span className="font-bold text-green-600">87%</span>
                  </div>
                  <Progress value={87} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Engine Health</p>
                      <p className="font-semibold">92%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Brake System</p>
                      <p className="font-semibold">85%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transmission</p>
                      <p className="font-semibold">89%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hydraulics</p>
                      <p className="font-semibold">91%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
