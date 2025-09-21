"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Award, Clock, AlertTriangle } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"

interface DriverMetrics {
  id: string
  name: string
  truckNumber: string
  hoursWorked: number
  deliveriesCompleted: number
  fuelEfficiency: number
  safetyScore: number
  onTimeDeliveries: number
  totalDeliveries: number
  averageSpeed: number
  incidents: number
  rating: number
}

const mockDriverMetrics: DriverMetrics[] = [
  {
    id: "1",
    name: "Virat",
    truckNumber: "T-001",
    hoursWorked: 42,
    deliveriesCompleted: 28,
    fuelEfficiency: 8.2,
    safetyScore: 95,
    onTimeDeliveries: 26,
    totalDeliveries: 28,
    averageSpeed: 45,
    incidents: 0,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Yuvaraj",
    truckNumber: "T-002",
    hoursWorked: 38,
    deliveriesCompleted: 24,
    fuelEfficiency: 7.8,
    safetyScore: 92,
    onTimeDeliveries: 22,
    totalDeliveries: 24,
    averageSpeed: 42,
    incidents: 1,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Rishab",
    truckNumber: "T-003",
    hoursWorked: 45,
    deliveriesCompleted: 31,
    fuelEfficiency: 8.5,
    safetyScore: 98,
    onTimeDeliveries: 30,
    totalDeliveries: 31,
    averageSpeed: 44,
    incidents: 0,
    rating: 4.9,
  },
]

interface DriverPerformanceProps {
  trucks: TruckSchedule[]
}

export function DriverPerformance({ trucks }: DriverPerformanceProps) {
  const [selectedDriver, setSelectedDriver] = useState<DriverMetrics | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 95)
      return { label: "Excellent", variant: "default" as const, className: "bg-green-100 text-green-800" }
    if (score >= 90) return { label: "Good", variant: "secondary" as const, className: "bg-blue-100 text-blue-800" }
    if (score >= 80)
      return { label: "Average", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" }
    return { label: "Needs Improvement", variant: "destructive" as const }
  }

  const topPerformer = mockDriverMetrics.reduce((prev, current) => (prev.rating > current.rating ? prev : current))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Driver Performance</h3>
          <p className="text-muted-foreground">Monitor and analyze driver metrics and safety</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Award className="w-4 h-4 mr-2" />
          Performance Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold text-foreground">{mockDriverMetrics.length}</p>
              </div>
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Safety Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    mockDriverMetrics.reduce((sum, driver) => sum + driver.safetyScore, 0) / mockDriverMetrics.length,
                  )}
                  %
                </p>
              </div>
              <Award className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (mockDriverMetrics.reduce((sum, driver) => sum + driver.onTimeDeliveries, 0) /
                      mockDriverMetrics.reduce((sum, driver) => sum + driver.totalDeliveries, 0)) *
                      100,
                  )}
                  %
                </p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockDriverMetrics.reduce((sum, driver) => sum + driver.incidents, 0)}
                </p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Driver Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mockDriverMetrics.map((driver) => (
              <Card
                key={driver.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedDriver(driver)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {driver.name}
                      </CardTitle>
                      <CardDescription>Truck {driver.truckNumber}</CardDescription>
                    </div>
                    <Badge {...getPerformanceBadge(driver.safetyScore)}>
                      {getPerformanceBadge(driver.safetyScore).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Hours Worked</p>
                      <p className="font-semibold">{driver.hoursWorked}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deliveries</p>
                      <p className="font-semibold">{driver.deliveriesCompleted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Safety Score</p>
                      <p className={`font-semibold ${getPerformanceColor(driver.safetyScore)}`}>
                        {driver.safetyScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-semibold">⭐ {driver.rating}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-Time Deliveries</span>
                      <span>{Math.round((driver.onTimeDeliveries / driver.totalDeliveries) * 100)}%</span>
                    </div>
                    <Progress value={(driver.onTimeDeliveries / driver.totalDeliveries) * 100} className="w-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent w-full">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full">
                      Send Message
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🏆 Top Performer of the Week</CardTitle>
              <CardDescription>Highest overall performance rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{topPerformer.name}</h3>
                  <p className="text-muted-foreground">Truck {topPerformer.truckNumber}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">⭐ {topPerformer.rating} Rating</span>
                    <span className="text-sm">🛡️ {topPerformer.safetyScore}% Safety</span>
                    <span className="text-sm">
                      ⏰ {Math.round((topPerformer.onTimeDeliveries / topPerformer.totalDeliveries) * 100)}% On-Time
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Rankings</CardTitle>
              <CardDescription>Drivers ranked by overall performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDriverMetrics
                  .sort((a, b) => b.rating - a.rating)
                  .map((driver, index) => (
                    <div key={driver.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{driver.name}</h4>
                        <p className="text-sm text-muted-foreground">Truck {driver.truckNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">⭐ {driver.rating}</p>
                        <p className="text-sm text-muted-foreground">{driver.deliveriesCompleted} deliveries</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Weekly performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Performance trend chart would be displayed here
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Safety Metrics</CardTitle>
                <CardDescription>Safety incidents and scores by driver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDriverMetrics.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">{driver.incidents} incidents this month</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getPerformanceColor(driver.safetyScore)}`}>{driver.safetyScore}%</p>
                        <Progress value={driver.safetyScore} className="w-20" />
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
