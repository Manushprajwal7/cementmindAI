"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Route,
  Zap,
  IndianRupee,
  Clock,
  AlertTriangle,
  MapPin,
  Fuel,
  Truck,
  TrendingDown,
  Calendar,
  Navigation,
  CheckCircle,
} from "lucide-react";
import type { TruckSchedule, RouteOptimization } from "@/types/logistics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RouteOptimizerProps {
  trucks: TruckSchedule[];
}

// Generate mock route optimization data
const generateRouteOptimizations = (): RouteOptimization[] => [
  {
    route_id: "route-001",
    origin: "Cement Plant",
    destination: "Site A - High Rise Construction",
    distance: 8.5,
    estimated_time: 25,
    traffic_level: "medium",
    fuel_cost: 1030,
    priority: "high",
    assigned_trucks: ["T-001", "T-003"],
  },
  {
    route_id: "route-002",
    origin: "Cement Plant",
    destination: "Site B - Infrastructure Project",
    distance: 12.3,
    estimated_time: 35,
    traffic_level: "high",
    fuel_cost: 1570,
    priority: "critical",
    assigned_trucks: ["T-002"],
  },
  {
    route_id: "route-003",
    origin: "Site A - High Rise Construction",
    destination: "Site C - Residential Complex",
    distance: 15.7,
    estimated_time: 42,
    traffic_level: "low",
    fuel_cost: 1840,
    priority: "medium",
    assigned_trucks: ["T-001"],
  },
  {
    route_id: "route-004",
    origin: "Cement Plant",
    destination: "Site D - Commercial Building",
    distance: 22.1,
    estimated_time: 55,
    traffic_level: "medium",
    fuel_cost: 2450,
    priority: "low",
    assigned_trucks: ["T-004"],
  },
  {
    route_id: "route-005",
    origin: "Site B - Infrastructure Project",
    destination: "Site E - Industrial Facility",
    distance: 18.4,
    estimated_time: 48,
    traffic_level: "high",
    fuel_cost: 2120,
    priority: "high",
    assigned_trucks: ["T-005", "T-002"],
  },
];

export function RouteOptimizer({ trucks }: RouteOptimizerProps) {
  const [routes] = useState(generateRouteOptimizations());
  const [optimizationMode, setOptimizationMode] = useState("fuel");
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<string | null>(
    null
  );
  const [showRouteDetails, setShowRouteDetails] = useState<{
    open: boolean;
    route: RouteOptimization | null;
  }>({ open: false, route: null });

  const trafficColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const handleOptimizeRoutes = async () => {
    setShowOptimizationDialog(true);
    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      // Prepare route data for Gemini
      const routeData = routes.map((route) => ({
        route_id: route.route_id,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance,
        estimated_time: route.estimated_time,
        traffic_level: route.traffic_level,
        fuel_cost: route.fuel_cost,
        priority: route.priority,
        assigned_trucks: route.assigned_trucks,
      }));

      const prompt = `Optimize the following delivery routes for a cement plant logistics operation in India:
      
Current Routes:
${JSON.stringify(routeData, null, 2)}

Optimization Goal: ${optimizationMode}

Please provide:
1. Route efficiency improvements with specific metrics
2. Truck allocation optimization suggestions
3. Traffic pattern analysis and recommendations
4. Cost savings projections
5. Environmental impact reduction estimates

Format your response in clear sections with bullet points and specific numbers. Avoid using markdown formatting like asterisks or hyphens.`;

      const systemPrompt = `You are Gemini, an AI assistant specialized for CementMind AI - an AI Operating Workbench For Raw Material and Logistics Automation with Autonomous Real-Time Cement Quality Detection and Correction.

Your role is to help engineers and operators working with cement manufacturing plants to optimize logistics operations, particularly route planning and delivery scheduling.

For route optimization, consider factors like:
- Distance minimization
- Fuel cost reduction
- Time efficiency
- Traffic patterns
- Truck capacity utilization
- Delivery priority levels
- Maintenance scheduling
- Weather conditions impact
- Regulatory compliance for heavy vehicle transport in India

Provide actionable, specific recommendations that can be implemented immediately.`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          system: systemPrompt,
          model: "gemini-2.5-flash",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(
          `Failed to get response from Gemini: ${response.status}`
        );
      }

      const data = await response.json();
      setOptimizationResult(
        data.text || "Sorry, I couldn't process your request."
      );
    } catch (error) {
      console.error("Error optimizing routes:", error);
      setOptimizationResult("Failed to optimize routes. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const closeOptimizationDialog = () => {
    setShowOptimizationDialog(false);
    setIsOptimizing(false);
    setOptimizationResult(null);
  };

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
                <label className="text-sm font-medium text-muted-foreground">
                  Optimization Goal
                </label>
                <Select
                  value={optimizationMode}
                  onValueChange={setOptimizationMode}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Minimize Fuel Cost</SelectItem>
                    <SelectItem value="time">Minimize Travel Time</SelectItem>
                    <SelectItem value="distance">Minimize Distance</SelectItem>
                    <SelectItem value="balanced">
                      Balanced Optimization
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleOptimizeRoutes}>
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
                <CardTitle className="text-lg">
                  {route.route_id.toUpperCase()}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={priorityColors[route.priority]}
                >
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
                    <IndianRupee className="h-3 w-3" />
                    <span>Fuel Cost</span>
                  </div>
                  <p className="font-medium">₹{route.fuel_cost}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Traffic</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={trafficColors[route.traffic_level]}
                  >
                    {route.traffic_level}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Origin</span>
                  </div>
                  <p className="font-medium truncate">{route.origin}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Navigation className="h-3 w-3" />
                    <span>Destination</span>
                  </div>
                  <p className="font-medium truncate">{route.destination}</p>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Assigned Trucks
                </div>
                <div className="flex flex-wrap gap-1">
                  {route.assigned_trucks.map((truckId) => (
                    <Badge
                      key={truckId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {truckId}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => setShowRouteDetails({ open: true, route })}
                >
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
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            <span>Optimization Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Fuel className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">-15%</span>
              </div>
              <div className="text-sm text-green-700">Fuel Savings</div>
              <div className="text-xs text-green-600 mt-1">₹2,450/day</div>
            </div>
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">-8min</span>
              </div>
              <div className="text-sm text-blue-700">Avg Time Saved</div>
              <div className="text-xs text-blue-600 mt-1">Per delivery</div>
            </div>
            <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-bold text-amber-600">
                  ₹{Math.round(127)}
                </span>
              </div>
              <div className="text-sm text-amber-700">Daily Savings</div>
              <div className="text-xs text-amber-600 mt-1">Across fleet</div>
            </div>
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">94%</span>
              </div>
              <div className="text-sm text-purple-700">Route Efficiency</div>
              <div className="text-xs text-purple-600 mt-1">
                Optimization rate
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              AI-Powered Insights
            </h4>
            <p className="text-sm text-blue-700">
              Gemini AI continuously analyzes traffic patterns, weather
              conditions, and delivery priorities to provide real-time route
              optimization recommendations. Click "Optimize Routes" to get
              personalized suggestions for your fleet.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Route Optimization Dialog */}
      <Dialog
        open={showOptimizationDialog}
        onOpenChange={setShowOptimizationDialog}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Route Optimization with Gemini AI</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <h3 className="font-medium">Optimization Mode</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {optimizationMode} optimization
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {optimizationMode}
              </Badge>
            </div>

            {isOptimizing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-lg font-medium">
                  Analyzing routes with Gemini AI...
                </p>
                <p className="text-muted-foreground text-center">
                  Gemini is optimizing your delivery routes based on traffic
                  patterns, fuel efficiency, and delivery priorities
                </p>
              </div>
            ) : optimizationResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800">
                      Optimization Complete
                    </h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Gemini AI has analyzed your routes and provided optimization
                    recommendations
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Optimization Results
                  </h4>
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    {optimizationResult}
                  </pre>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closeOptimizationDialog}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, this would apply the optimizations
                      alert("Optimizations applied successfully!");
                      closeOptimizationDialog();
                    }}
                  >
                    Apply Optimizations
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Route Details Dialog */}
      <Dialog
        open={showRouteDetails.open}
        onOpenChange={(open) => setShowRouteDetails({ open, route: null })}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-500" />
              <span>Route Details</span>
            </DialogTitle>
          </DialogHeader>

          {showRouteDetails.route && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <h3 className="font-medium">Origin</h3>
                    </div>
                    <p className="text-lg font-semibold">
                      {showRouteDetails.route.origin}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="h-4 w-4 text-green-500" />
                      <h3 className="font-medium">Destination</h3>
                    </div>
                    <p className="text-lg font-semibold">
                      {showRouteDetails.route.destination}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-purple-500" />
                      <h3 className="font-medium">Distance</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {showRouteDetails.route.distance} km
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium">Est. Time</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {showRouteDetails.route.estimated_time} min
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="h-4 w-4 text-green-500" />
                      <h3 className="font-medium">Fuel Cost</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      ₹{showRouteDetails.route.fuel_cost}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Assigned Trucks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {showRouteDetails.route.assigned_trucks.map((truckId) => (
                      <Badge key={truckId} variant="secondary">
                        {truckId}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Traffic Level
                  </h3>
                  <Badge
                    variant="outline"
                    className={
                      trafficColors[showRouteDetails.route.traffic_level]
                    }
                  >
                    {showRouteDetails.route.traffic_level}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Priority
                </h3>
                <Badge
                  variant="outline"
                  className={priorityColors[showRouteDetails.route.priority]}
                >
                  {showRouteDetails.route.priority}
                </Badge>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    // In a real app, this would trigger route navigation
                    alert(
                      `Navigating to route ${showRouteDetails.route?.route_id}`
                    );
                  }}
                >
                  Start Navigation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
