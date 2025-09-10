"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, TrendingUp } from "lucide-react"
import { LogisticsMap } from "./logistics-map"
import { TruckGantt } from "./truck-gantt"
import { PerformanceMetrics } from "./performance-metrics"
import { RouteOptimizer } from "./route-optimizer"
import { TruckManagement } from "./truck-management"
import { PredictiveMaintenance } from "./predictive-maintenance"
import { DriverPerformance } from "./driver-performance"
import { DeliveryConfirmation } from "./delivery-confirmation"
import type { TruckSchedule, LogisticsRecommendation } from "@/types/logistics"

// Mock logistics data
const generateMockLogisticsData = (): {
  trucks: TruckSchedule[]
  recommendations: LogisticsRecommendation
} => {
  const trucks: TruckSchedule[] = [
    {
      id: "truck-001",
      truck_number: "T-001",
      driver: "John Smith",
      status: "transit",
      current_location: { lat: 40.7128, lng: -74.006, address: "Manhattan, NY" },
      destination: { lat: 40.7589, lng: -73.9851, address: "Central Park, NY", site_name: "Site A" },
      eta: "14:30",
      load_capacity: 25000,
      current_load: 22000,
      route_distance: 8.5,
      fuel_level: 75,
      last_updated: new Date().toISOString(),
    },
    {
      id: "truck-002",
      truck_number: "T-002",
      driver: "Maria Garcia",
      status: "loading",
      current_location: { lat: 40.7282, lng: -73.7949, address: "Queens, NY" },
      destination: { lat: 40.6892, lng: -74.0445, address: "Brooklyn, NY", site_name: "Site B" },
      eta: "15:15",
      load_capacity: 25000,
      current_load: 0,
      route_distance: 12.3,
      fuel_level: 85,
      last_updated: new Date().toISOString(),
    },
    {
      id: "truck-003",
      truck_number: "T-003",
      driver: "Robert Johnson",
      status: "unloading",
      current_location: { lat: 40.6892, lng: -74.0445, address: "Brooklyn, NY" },
      destination: { lat: 40.7128, lng: -74.006, address: "Manhattan, NY", site_name: "Plant" },
      eta: "16:00",
      load_capacity: 25000,
      current_load: 24500,
      route_distance: 15.7,
      fuel_level: 60,
      last_updated: new Date().toISOString(),
    },
  ]

  const recommendations: LogisticsRecommendation = {
    truck_scheduling: {
      predicted_demand: [12, 15, 18, 22, 25, 28, 24, 20, 16, 14, 12, 10],
      optimal_schedule: { 8: 3, 9: 4, 10: 5, 11: 6, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2 },
      total_trucks_needed: 12,
      peak_demand_hours: [10, 11, 12],
    },
    performance_metrics: {
      current_supply_efficiency: 94.2,
      inventory_turnover: 8.5,
      average_delay: 12.3,
      fuel_efficiency: 87.6,
    },
    improvement_opportunities: [
      "Optimize route planning to reduce fuel consumption by 8%",
      "Implement predictive maintenance to reduce downtime by 15%",
      "Adjust scheduling to better match demand patterns",
      "Consider additional truck capacity during peak hours",
    ],
  }

  return { trucks, recommendations }
}

export function LogisticsPlanner() {
  const [activeTab, setActiveTab] = useState("overview")
  const [logisticsData, setLogisticsData] = useState(generateMockLogisticsData())
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const refreshData = () => {
    setLogisticsData(generateMockLogisticsData())
    setLastUpdate(new Date())
  }

  const activeTrucks = logisticsData.trucks.filter((truck) => truck.status !== "idle" && truck.status !== "maintenance")
  const criticalRoutes = logisticsData.trucks.filter(
    (truck) => truck.fuel_level < 25 || truck.current_load > truck.load_capacity * 0.9,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Logistics Planner</h2>
          <p className="text-muted-foreground">Optimize truck scheduling and route management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Tracking</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Trucks</p>
                <p className="text-2xl font-bold text-foreground">{activeTrucks.length}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supply Efficiency</p>
                <p className="text-2xl font-bold text-green-600">
                  {logisticsData.recommendations.performance_metrics.current_supply_efficiency}%
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Delay</p>
                <p className="text-2xl font-bold text-amber-600">
                  {logisticsData.recommendations.performance_metrics.average_delay}min
                </p>
              </div>
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Routes</p>
                <p className="text-2xl font-bold text-red-600">{criticalRoutes.length}</p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="routes">Route Optimizer</TabsTrigger>
          <TabsTrigger value="management">Fleet Management</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogisticsMap trucks={logisticsData.trucks} />
            <PerformanceMetrics recommendations={logisticsData.recommendations} />
          </div>
          <TruckGantt trucks={logisticsData.trucks} />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <LogisticsMap trucks={logisticsData.trucks} fullSize />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <TruckGantt trucks={logisticsData.trucks} detailed />
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <RouteOptimizer trucks={logisticsData.trucks} />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <TruckManagement
            trucks={logisticsData.trucks}
            onTruckUpdate={(trucks) => setLogisticsData((prev) => ({ ...prev, trucks }))}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <PredictiveMaintenance trucks={logisticsData.trucks} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DriverPerformance trucks={logisticsData.trucks} />
            <DeliveryConfirmation trucks={logisticsData.trucks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
