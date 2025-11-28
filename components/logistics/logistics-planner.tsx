"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { LogisticsMap } from "./logistics-map";
import { TruckGantt } from "./truck-gantt";
import { PerformanceMetrics } from "./performance-metrics";
import { RouteOptimizer } from "./route-optimizer";
import { TruckManagement } from "./truck-management";
import { PredictiveMaintenance } from "./predictive-maintenance";
import { DriverPerformance } from "./driver-performance";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryScheduler } from "./delivery-scheduler";
import { DemandForecasting } from "./demand-forecasting";
import { MaintenanceTracking } from "./maintenance-tracking";
import { CostAnalytics } from "./cost-analytics";
import { ShiftReportGenerator } from "./shift-report-generator";
import type { TruckSchedule, LogisticsRecommendation } from "@/types/logistics";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Mock logistics data
const generateMockLogisticsData = (): {
  trucks: TruckSchedule[];
  recommendations: LogisticsRecommendation;
} => {
  const trucks: TruckSchedule[] = [
    {
      id: "truck-001",
      truck_number: "T-001",
      driver: "John Smith",
      status: "transit" as const,
      current_location: {
        lat: 40.7128,
        lng: -74.006,
        address: "Manhattan, NY",
      },
      destination: {
        lat: 40.7589,
        lng: -73.9851,
        address: "Central Park, NY",
        site_name: "Site A",
      },
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
      status: "loading" as const,
      current_location: { lat: 40.7282, lng: -73.7949, address: "Queens, NY" },
      destination: {
        lat: 40.6892,
        lng: -74.0445,
        address: "Brooklyn, NY",
        site_name: "Site B",
      },
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
      status: "unloading" as const,
      current_location: {
        lat: 40.6892,
        lng: -74.0445,
        address: "Brooklyn, NY",
      },
      destination: {
        lat: 40.7128,
        lng: -74.006,
        address: "Manhattan, NY",
        site_name: "Plant",
      },
      eta: "16:00",
      load_capacity: 25000,
      current_load: 24500,
      route_distance: 15.7,
      fuel_level: 60,
      last_updated: new Date().toISOString(),
    },
  ];

  const recommendations: LogisticsRecommendation = {
    truck_scheduling: {
      predicted_demand: [8, 12, 16, 22, 28, 32, 28, 24, 20, 16, 12, 10],
      optimal_schedule: {
        8: 2,
        9: 3,
        10: 4,
        11: 5,
        12: 6,
        13: 5,
        14: 4,
        15: 4,
        16: 3,
        17: 2,
        18: 2,
        19: 1,
      },
      total_trucks_needed: 15,
      peak_demand_hours: [11, 12, 13],
    },
    performance_metrics: {
      current_supply_efficiency: 62.5,
      inventory_turnover: 7.8,
      average_delay: 18.5,
      fuel_efficiency: 84.3,
    },
    improvement_opportunities: [
      "Optimize route planning to reduce fuel consumption by 12%",
      "Implement predictive maintenance to reduce downtime by 20%",
      "Adjust scheduling to better match demand patterns during peak hours",
      "Consider additional truck capacity during morning rush hours",
      "Improve driver training to reduce delivery delays by 15%",
    ],
  };

  return { trucks, recommendations };
};

export function LogisticsPlanner() {
  const { currentData, error, loading, lastUpdate } = useRealTimeData();
  const [activeTab, setActiveTab] = useState("overview");
  const [logisticsData, setLogisticsData] = useState(
    generateMockLogisticsData()
  );
  const [dynamicTrucks, setDynamicTrucks] = useState<TruckSchedule[]>(
    logisticsData.trucks
  );

  // Initialize and update dynamic trucks data every 3 seconds
  useEffect(() => {
    setDynamicTrucks(logisticsData.trucks);

    // Update trucks dynamically every 3 seconds to simulate real-time changes
    const interval = setInterval(() => {
      setDynamicTrucks((prevTrucks) => {
        return prevTrucks.map((truck) => {
          // Simulate real-time changes in truck data
          const statusOptions: Array<
            "loading" | "transit" | "unloading" | "idle" | "maintenance"
          > = ["loading", "transit", "unloading", "idle", "maintenance"];

          // Determine next status based on current status
          let nextStatus = truck.status;
          const randomChange = Math.random();

          // 30% chance to change status
          if (randomChange < 0.3) {
            const currentIndex = statusOptions.indexOf(truck.status);
            const nextIndex = (currentIndex + 1) % statusOptions.length;
            nextStatus = statusOptions[nextIndex];
          }

          // Update fuel level and load dynamically
          const fuelChange = (Math.random() - 0.5) * 2; // -1 to +1
          const loadChange = (Math.random() - 0.5) * 100; // -50 to +50

          return {
            ...truck,
            status: nextStatus,
            fuel_level: Math.max(
              0,
              Math.min(100, truck.fuel_level + fuelChange)
            ),
            current_load: Math.max(
              0,
              Math.min(truck.load_capacity, truck.current_load + loadChange)
            ),
            last_updated: new Date().toISOString(),
          };
        });
      });
    }, 3000); // Update every 3 seconds (3000 milliseconds)

    return () => clearInterval(interval);
  }, [logisticsData.trucks]);

  useEffect(() => {
    if (currentData && !loading) {
      const firebaseData = {
        trucks: logisticsData.trucks, // Keep existing trucks data
        recommendations: currentData.recommendations?.logistics
          ? {
              ...currentData.recommendations.logistics,
              performance_metrics: {
                ...currentData.recommendations.logistics.performance_metrics,
                fuel_efficiency: 0.85,
              },
            }
          : logisticsData.recommendations,
      };
      setLogisticsData(firebaseData);
    }
  }, [currentData, loading]);

  // Update logistics data when Firebase data changes
  useEffect(() => {
    if (currentData?.recommendations?.logistics) {
      const firebaseData = currentData.recommendations.logistics;

      // Generate truck schedules based on Firebase data
      const trucks = logisticsData.trucks.map((truck, index) => {
        // Use some Firebase data to influence the truck data
        const truckNeeded =
          firebaseData.truck_scheduling.optimal_schedule[
            new Date().getHours()
          ] || 0;
        const isPeakHour =
          firebaseData.truck_scheduling.peak_demand_hours.includes(
            new Date().getHours()
          );

        return {
          ...truck,
          status: (index < truckNeeded
            ? isPeakHour
              ? "transit"
              : "loading"
            : index < truckNeeded + 2
            ? "idle"
            : "maintenance") as
            | "loading"
            | "transit"
            | "unloading"
            | "idle"
            | "maintenance",
          eta: isPeakHour ? "30 minutes" : "1 hour",
          fuel_level: Math.min(100, truck.fuel_level + 10),
        };
      });

      setLogisticsData({
        trucks,
        recommendations: {
          truck_scheduling: firebaseData.truck_scheduling,
          performance_metrics: {
            ...firebaseData.performance_metrics,
            fuel_efficiency: 0.85,
          },
          improvement_opportunities: firebaseData.improvement_opportunities,
        },
      });
    }
  }, [currentData]);

  const refreshData = () => {
    // With real-time data, this just forces a UI refresh
    setLogisticsData({ ...logisticsData });
  };

  const activeTrucks = dynamicTrucks.filter(
    (truck) => truck.status !== "idle" && truck.status !== "maintenance"
  );
  const criticalRoutes = dynamicTrucks.filter(
    (truck) =>
      truck.fuel_level < 25 || truck.current_load > truck.load_capacity * 0.9
  );

  return (
    <div className="space-y-6">
      {error && !error.includes("permission_denied") && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="ml-2">Loading logistics data...</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Logistics Planner
          </h2>
          <p className="text-muted-foreground">
            Optimize truck scheduling and route management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live Tracking | Last updated:{" "}
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}
            </span>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Active Trucks
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {activeTrucks.length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Supply Efficiency
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    logisticsData.recommendations.performance_metrics
                      .current_supply_efficiency
                  }
                  %
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
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Delay
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {
                    logisticsData.recommendations.performance_metrics
                      .average_delay
                  }
                  min
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
                <p className="text-sm font-medium text-muted-foreground">
                  Critical Routes
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {criticalRoutes.length}
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Delivery Schedule</TabsTrigger>
          <TabsTrigger value="forecasting">Demand Forecasting</TabsTrigger>
          <TabsTrigger value="routes">Route Optimizer</TabsTrigger>
          <TabsTrigger value="management">Fleet Management</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="costs">Cost Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="shift-report">Shift Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogisticsMap />

            <PerformanceMetrics
              recommendations={logisticsData.recommendations}
            />
          </div>
          <TruckGantt trucks={dynamicTrucks} />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <DeliveryScheduler />
          <TruckGantt trucks={dynamicTrucks} detailed />
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <DemandForecasting />
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <RouteOptimizer trucks={dynamicTrucks} />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <TruckManagement
            trucks={dynamicTrucks}
            onTruckUpdate={(trucks) => setDynamicTrucks(trucks)}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <MaintenanceTracking />
          <PredictiveMaintenance trucks={dynamicTrucks} />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <CostAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DriverPerformance trucks={dynamicTrucks} />
            <DeliveryConfirmation trucks={dynamicTrucks} />
          </div>
        </TabsContent>

        <TabsContent value="shift-report" className="space-y-6">
          <ShiftReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
