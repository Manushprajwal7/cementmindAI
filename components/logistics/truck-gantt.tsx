"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Truck,
  Zap,
  MapPin,
  Fuel,
  Weight,
  Navigation,
  Wrench,
} from "lucide-react";
import type { TruckSchedule } from "@/types/logistics";
import { cn } from "@/lib/utils";

interface TruckGanttProps {
  trucks: TruckSchedule[];
  detailed?: boolean;
}

interface TruckScheduleWithActivity extends TruckSchedule {
  activity: string;
  load_percentage: number;
}

interface ScheduleSlot {
  hour: number;
  time: string;
  date: string;
  trucks: TruckScheduleWithActivity[];
}

// Generate mock schedule data for next 48 hours
const generateScheduleData = (trucks: TruckSchedule[]) => {
  const schedule: ScheduleSlot[] = [];
  const now = new Date();

  for (let hour = 0; hour < 48; hour++) {
    const timestamp = new Date(now.getTime() + hour * 60 * 60 * 1000);
    const hourData: ScheduleSlot = {
      hour,
      time: timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: timestamp.toLocaleDateString(),
      trucks: trucks.map((truck) => ({
        ...truck,
        activity: getActivityForHour(truck, hour),
        load_percentage: Math.min(
          100,
          (truck.current_load / truck.load_capacity) * 100 + Math.random() * 20
        ),
      })),
    };
    schedule.push(hourData);
  }

  return schedule;
};

const getActivityForHour = (truck: TruckSchedule, hour: number) => {
  const activities = ["loading", "transit", "unloading", "idle", "maintenance"];
  const cyclePosition = (hour + Number.parseInt(truck.id.slice(-1))) % 10;

  if (cyclePosition < 2) return "loading";
  if (cyclePosition < 5) return "transit";
  if (cyclePosition < 7) return "unloading";
  if (cyclePosition < 9) return "idle";
  return "maintenance";
};

// Function to simulate real-time changes in truck data
const simulateRealTimeChanges = (trucks: TruckSchedule[]): TruckSchedule[] => {
  return trucks.map((truck) => {
    // Randomly change status with 30% probability
    const statusOptions: Array<
      "loading" | "transit" | "unloading" | "idle" | "maintenance"
    > = ["loading", "transit", "unloading", "idle", "maintenance"];

    let newStatus = truck.status;
    if (Math.random() < 0.3) {
      const currentIndex = statusOptions.indexOf(truck.status);
      const nextIndex = (currentIndex + 1) % statusOptions.length;
      newStatus = statusOptions[nextIndex];
    }

    // Randomly adjust fuel level (-2 to +2)
    const fuelChange = (Math.random() - 0.5) * 4;
    const newFuelLevel = Math.max(
      0,
      Math.min(100, truck.fuel_level + fuelChange)
    );

    // Randomly adjust load (-500 to +500)
    const loadChange = (Math.random() - 0.5) * 1000;
    const newLoad = Math.max(
      0,
      Math.min(truck.load_capacity, truck.current_load + loadChange)
    );

    return {
      ...truck,
      status: newStatus,
      fuel_level: newFuelLevel,
      current_load: newLoad,
      last_updated: new Date().toISOString(),
    };
  });
};

export function TruckGantt({ trucks, detailed = false }: TruckGanttProps) {
  const [dynamicTrucks, setDynamicTrucks] = useState<TruckSchedule[]>(trucks);
  const [scheduleData, setScheduleData] = useState<ScheduleSlot[]>([]);
  const displayHours = detailed ? 48 : 24;

  // Initialize schedule data
  useEffect(() => {
    setScheduleData(generateScheduleData(dynamicTrucks));
  }, [dynamicTrucks]);

  // Update trucks dynamically every 3 seconds
  useEffect(() => {
    setDynamicTrucks(trucks); // Initialize with props

    const interval = setInterval(() => {
      setDynamicTrucks((prevTrucks) => simulateRealTimeChanges(prevTrucks));
    }, 3000); // Update every 3 seconds as requested

    return () => clearInterval(interval);
  }, [trucks]);

  const activityColors = {
    loading: "bg-blue-500",
    transit: "bg-green-500",
    unloading: "bg-amber-500",
    idle: "bg-gray-300",
    maintenance: "bg-red-500",
  };

  // Calculate fleet metrics
  const totalTrucks = dynamicTrucks.length;
  const activeTrucks = dynamicTrucks.filter(
    (truck) => truck.status !== "idle" && truck.status !== "maintenance"
  ).length;
  const maintenanceTrucks = dynamicTrucks.filter(
    (truck) => truck.status === "maintenance"
  ).length;
  const avgFuelLevel =
    dynamicTrucks.reduce((sum, truck) => sum + truck.fuel_level, 0) /
    dynamicTrucks.length;

  // Calculate additional metrics
  const totalLoad = dynamicTrucks.reduce(
    (sum, truck) => sum + truck.current_load,
    0
  );
  const totalCapacity = dynamicTrucks.reduce(
    (sum, truck) => sum + truck.load_capacity,
    0
  );
  const utilizationRate =
    totalCapacity > 0 ? (totalLoad / totalCapacity) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">
            Truck Schedule ({displayHours}h Horizon)
          </span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 transition-colors"
          >
            <Zap className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Optimize Schedule</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Fleet Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-700">
              {totalTrucks}
            </div>
            <div className="text-xs font-medium text-blue-600">
              Total Trucks
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-700">
              {activeTrucks}
            </div>
            <div className="text-xs font-medium text-green-600">Active</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
            <div className="text-2xl font-bold text-amber-700">
              {maintenanceTrucks}
            </div>
            <div className="text-xs font-medium text-amber-600">
              Maintenance
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-700">
              {avgFuelLevel.toFixed(0)}%
            </div>
            <div className="text-xs font-medium text-purple-600">Avg Fuel</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200 shadow-sm">
            <div className="text-xl font-bold text-cyan-700">
              {utilizationRate.toFixed(1)}%
            </div>
            <div className="text-xs font-medium text-cyan-600">
              Fleet Utilization
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
            <div className="text-xl font-bold text-emerald-700">
              {totalLoad.toLocaleString()}kg
            </div>
            <div className="text-xs font-medium text-emerald-600">
              Total Load
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Time Header */}
          <div className="flex items-center space-x-2 sticky top-0 bg-white z-10 py-2 border-b border-gray-200">
            <div className="w-32 text-sm font-bold text-gray-700 pl-2">
              Truck Details
            </div>
            <div className="flex-1 grid grid-cols-24 gap-0.5">
              {scheduleData.slice(0, displayHours).map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-xs text-center font-medium",
                    index % 4 === 0
                      ? "text-gray-700 font-bold"
                      : "text-gray-500"
                  )}
                >
                  {index % 4 === 0 ? slot.time.split(":")[0] : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Truck Rows */}
          {dynamicTrucks.map((truck) => (
            <div
              key={truck.id}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-32">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Truck className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {truck.truck_number}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-medium px-1.5 py-0.5", {
                      "bg-blue-100 text-blue-800 border-blue-200":
                        truck.status === "loading",
                      "bg-green-100 text-green-800 border-green-200":
                        truck.status === "transit",
                      "bg-amber-100 text-amber-800 border-amber-200":
                        truck.status === "unloading",
                      "bg-gray-100 text-gray-800 border-gray-200":
                        truck.status === "idle",
                      "bg-red-100 text-red-800 border-red-200":
                        truck.status === "maintenance",
                    })}
                  >
                    {truck.status}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1 ml-7">
                  <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="truncate max-w-[100px]">
                    {truck.destination.site_name}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1 ml-7">
                  <Fuel className="h-3 w-3 mr-1 text-gray-500" />
                  <div className="flex items-center w-full">
                    <div className="w-12">{truck.fuel_level.toFixed(0)}%</div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full", {
                          "bg-red-500": truck.fuel_level < 20,
                          "bg-yellow-500":
                            truck.fuel_level >= 20 && truck.fuel_level < 50,
                          "bg-green-500": truck.fuel_level >= 50,
                        })}
                        style={{ width: `${truck.fuel_level}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1 ml-7">
                  <Weight className="h-3 w-3 mr-1 text-gray-500" />
                  <div className="flex items-center w-full">
                    <div className="w-12">
                      {(truck.current_load / 1000).toFixed(1)}t
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full", {
                          "bg-green-500":
                            truck.current_load / truck.load_capacity < 0.8,
                          "bg-yellow-500":
                            truck.current_load / truck.load_capacity >= 0.8 &&
                            truck.current_load / truck.load_capacity < 0.95,
                          "bg-red-500":
                            truck.current_load / truck.load_capacity >= 0.95,
                        })}
                        style={{
                          width: `${Math.min(
                            100,
                            (truck.current_load / truck.load_capacity) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-24 gap-0.5">
                {scheduleData.slice(0, displayHours).map((slot, index) => {
                  const truckActivity = slot.trucks.find(
                    (t: TruckScheduleWithActivity) => t.id === truck.id
                  );
                  const activity = truckActivity?.activity || "idle";
                  const loadPercentage = truckActivity?.load_percentage || 0;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-8 rounded-md cursor-pointer transition-all hover:scale-105 relative overflow-hidden shadow-sm",
                        activityColors[activity as keyof typeof activityColors],
                        {
                          "ring-2 ring-primary ring-offset-1": index === 0,
                        }
                      )}
                      title={`${
                        slot.time
                      } - ${activity} (${loadPercentage.toFixed(0)}% load)`}
                    >
                      {/* Load indicator overlay */}
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30"
                        style={{ width: `${loadPercentage}%` }}
                      />
                      {index === 0 && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary bg-white px-1 rounded shadow">
                          Now
                        </div>
                      )}
                      {/* Show load percentage for active statuses */}
                      {(activity === "loading" ||
                        activity === "transit" ||
                        activity === "unloading") && (
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.5)]">
                          {loadPercentage.toFixed(0)}%
                        </div>
                      )}
                      {/* Activity icon for special statuses */}
                      {activity === "maintenance" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Wrench className="h-3 w-3 text-white opacity-80" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-3">
            <div className="flex flex-wrap items-center gap-3 mb-2 sm:mb-0">
              {Object.entries(activityColors).map(([activity, color]) => (
                <div key={activity} className="flex items-center space-x-1.5">
                  <div className={cn("w-3 h-3 rounded-sm", color)} />
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {activity}
                  </span>
                </div>
              ))}
            </div>
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-white border-gray-300"
            >
              Next {displayHours} hours
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
