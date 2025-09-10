"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Truck } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"
import { cn } from "@/lib/utils"

interface TruckGanttProps {
  trucks: TruckSchedule[]
  detailed?: boolean
}

// Generate mock schedule data for next 48 hours
const generateScheduleData = (trucks: TruckSchedule[]) => {
  const schedule = []
  const now = new Date()

  for (let hour = 0; hour < 48; hour++) {
    const timestamp = new Date(now.getTime() + hour * 60 * 60 * 1000)
    const hourData = {
      hour,
      time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: timestamp.toLocaleDateString(),
      trucks: trucks.map((truck) => ({
        ...truck,
        activity: getActivityForHour(truck, hour),
        load_percentage: Math.min(100, (truck.current_load / truck.load_capacity) * 100 + Math.random() * 20),
      })),
    }
    schedule.push(hourData)
  }

  return schedule
}

const getActivityForHour = (truck: TruckSchedule, hour: number) => {
  const activities = ["loading", "transit", "unloading", "idle"]
  const cyclePosition = (hour + Number.parseInt(truck.id.slice(-1))) % 8

  if (cyclePosition < 2) return "loading"
  if (cyclePosition < 5) return "transit"
  if (cyclePosition < 7) return "unloading"
  return "idle"
}

export function TruckGantt({ trucks, detailed = false }: TruckGanttProps) {
  const scheduleData = generateScheduleData(trucks)
  const displayHours = detailed ? 48 : 24

  const activityColors = {
    loading: "bg-blue-500",
    transit: "bg-green-500",
    unloading: "bg-amber-500",
    idle: "bg-gray-300",
    maintenance: "bg-red-500",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Truck Schedule ({displayHours}h Horizon)</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Optimize Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Time Header */}
          <div className="flex items-center space-x-2">
            <div className="w-24 text-sm font-medium">Truck</div>
            <div className="flex-1 grid grid-cols-24 gap-1">
              {scheduleData.slice(0, displayHours).map((slot, index) => (
                <div key={index} className="text-xs text-center text-muted-foreground">
                  {index % 4 === 0 ? slot.time.split(":")[0] : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Truck Rows */}
          {trucks.map((truck) => (
            <div key={truck.id} className="flex items-center space-x-2">
              <div className="w-24">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{truck.truck_number}</span>
                </div>
                <div className="text-xs text-muted-foreground">{truck.driver}</div>
              </div>

              <div className="flex-1 grid grid-cols-24 gap-1">
                {scheduleData.slice(0, displayHours).map((slot, index) => {
                  const truckActivity = slot.trucks.find((t) => t.id === truck.id)
                  const activity = truckActivity?.activity || "idle"

                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-6 rounded-sm cursor-pointer transition-all hover:opacity-80",
                        activityColors[activity as keyof typeof activityColors],
                      )}
                      title={`${slot.time} - ${activity} (${truckActivity?.load_percentage.toFixed(0)}% load)`}
                    />
                  )
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
  )
}
