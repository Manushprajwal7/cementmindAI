"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Route, Zap, DollarSign, Clock, AlertTriangle } from "lucide-react"
import type { TruckSchedule, RouteOptimization } from "@/types/logistics"

interface RouteOptimizerProps {
  trucks: TruckSchedule[]
}

// Generate mock route optimization data
const generateRouteOptimizations = (): RouteOptimization[] => [
  {
    route_id: "route-001",
    origin: "Cement Plant",
    destination: "Site A",
    distance: 8.5,
    estimated_time: 25,
    traffic_level: "medium",
    fuel_cost: 12.5,
    priority: "high",
    assigned_trucks: ["T-001", "T-003"],
  },
  {
    route_id: "route-002",
    origin: "Cement Plant",
    destination: "Site B",
    distance: 12.3,
    estimated_time: 35,
    traffic_level: "high",
    fuel_cost: 18.75,
    priority: "critical",
    assigned_trucks: ["T-002"],
  },
  {
    route_id: "route-003",
    origin: "Site A",
    destination: "Site C",
    distance: 15.7,
    estimated_time: 42,
    traffic_level: "low",
    fuel_cost: 22.1,
    priority: "medium",
    assigned_trucks: ["T-001"],
  },
]

export function RouteOptimizer({ trucks }: RouteOptimizerProps) {
  const [routes] = useState(generateRouteOptimizations())
  const [optimizationMode, setOptimizationMode] = useState("fuel")

  const trafficColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Route Optimization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Optimization Goal</label>
                <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Minimize Fuel Cost</SelectItem>
                    <SelectItem value="time">Minimize Travel Time</SelectItem>
                    <SelectItem value="distance">Minimize Distance</SelectItem>
                    <SelectItem value="balanced">Balanced Optimization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Optimize Routes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Route Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.route_id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{route.route_id.toUpperCase()}</CardTitle>
                <Badge variant="outline" className={priorityColors[route.priority]}>
                  {route.priority}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {route.origin} → {route.destination}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Route className="h-3 w-3" />
                    <span>Distance</span>
                  </div>
                  <p className="font-medium">{route.distance} km</p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Est. Time</span>
                  </div>
                  <p className="font-medium">{route.estimated_time} min</p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>Fuel Cost</span>
                  </div>
                  <p className="font-medium">${route.fuel_cost}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Traffic</span>
                  </div>
                  <Badge variant="outline" className={trafficColors[route.traffic_level]}>
                    {route.traffic_level}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Assigned Trucks</div>
                <div className="flex flex-wrap gap-1">
                  {route.assigned_trucks.map((truckId) => (
                    <Badge key={truckId} variant="secondary" className="text-xs">
                      {truckId}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Route Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optimization Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">-15%</div>
              <div className="text-sm text-green-700">Fuel Savings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">-8min</div>
              <div className="text-sm text-blue-700">Avg Time Saved</div>
            </div>
            <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">$127</div>
              <div className="text-sm text-amber-700">Daily Savings</div>
            </div>
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-purple-700">Route Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
