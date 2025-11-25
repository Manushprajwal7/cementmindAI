"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Truck, Zap, MapPin, Fuel } from "lucide-react";
import type { TruckSchedule } from "@/types/logistics";
import { cn } from "@/lib/utils";

interface TruckGanttProps {
  trucks: TruckSchedule[];
  detailed?: boolean;
}

// Generate mock schedule data for next 48 hours
const generateScheduleData = (trucks: TruckSchedule[]) => {
  const schedule = [];
  const now = new Date();

  for (let hour = 0; hour < 48; hour++) {
    const timestamp = new Date(now.getTime() + hour * 60 * 60 * 1000);
    const hourData = {
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
  const activities = ["loading", "transit", "unloading", "idle"];
  const cyclePosition = (hour + Number.parseInt(truck.id.slice(-1))) % 8;

  if (cyclePosition < 2) return "loading";
  if (cyclePosition < 5) return "transit";
  if (cyclePosition < 7) return "unloading";
  return "idle";
};

export function TruckGantt({ trucks, detailed = false }: TruckGanttProps) {
  const scheduleData = generateScheduleData(trucks);
  const displayHours = detailed ? 48 : 24;

  const activityColors = {
    loading: "bg-blue-500",
    transit: "bg-green-500",
    unloading: "bg-amber-500",
    idle: "bg-gray-300",
    maintenance: "bg-red-500",
  };

  // Calculate fleet metrics
  const totalTrucks = trucks.length;
  const activeTrucks = trucks.filter(
    (truck) => truck.status !== "idle" && truck.status !== "maintenance"
  ).length;
  const maintenanceTrucks = trucks.filter(
    (truck) => truck.status === "maintenance"
  ).length;
  const avgFuelLevel =
    trucks.reduce((sum, truck) => sum + truck.fuel_level, 0) / trucks.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Truck Schedule ({displayHours}h Horizon)</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            Optimize Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fleet Overview Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {totalTrucks}
            </div>
            <div className="text-xs text-blue-700">Total Trucks</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {activeTrucks}
            </div>
            <div className="text-xs text-green-700">Active</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">
              {maintenanceTrucks}
            </div>
            <div className="text-xs text-amber-700">Maintenance</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {avgFuelLevel.toFixed(0)}%
            </div>
            <div className="text-xs text-purple-700">Avg Fuel</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Time Header */}
          <div className="flex items-center space-x-2">
            <div className="w-32 text-sm font-medium">Truck</div>
            <div className="flex-1 grid grid-cols-24 gap-1">
              {scheduleData.slice(0, displayHours).map((slot, index) => (
                <div
                  key={index}
                  className="text-xs text-center text-muted-foreground"
                >
                  {index % 4 === 0 ? slot.time.split(":")[0] : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Truck Rows */}
          {trucks.map((truck) => (
            <div key={truck.id} className="flex items-center space-x-2">
              <div className="w-32">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {truck.truck_number}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {truck.status}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {truck.destination.site_name}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Fuel className="h-3 w-3 mr-1" />
                  {truck.fuel_level}%
                </div>
              </div>

              <div className="flex-1 grid grid-cols-24 gap-1">
                {scheduleData.slice(0, displayHours).map((slot, index) => {
                  const truckActivity = slot.trucks.find(
                    (t) => t.id === truck.id
                  );
                  const activity = truckActivity?.activity || "idle";

                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-8 rounded-sm cursor-pointer transition-all hover:opacity-80 relative",
                        activityColors[activity as keyof typeof activityColors]
                      )}
                      title={`${
                        slot.time
                      } - ${activity} (${truckActivity?.load_percentage.toFixed(
                        0
                      )}% load)`}
                    >
                      {index === 0 && (
                        <div className="absolute -top-6 left-0 text-xs font-medium text-primary">
                          Now
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm">
              {Object.entries(activityColors).map(([activity, color]) => (
                <div key={activity} className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-sm", color)} />
                  <span className="capitalize">{activity}</span>
                </div>
              ))}
            </div>
            <Badge variant="outline" className="text-xs">
              Next {displayHours} hours
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
