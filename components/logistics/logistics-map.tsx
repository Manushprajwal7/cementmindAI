"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Fuel } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"
import { cn } from "@/lib/utils"

interface LogisticsMapProps {
  trucks: TruckSchedule[]
  fullSize?: boolean
}

export function LogisticsMap({ trucks, fullSize = false }: LogisticsMapProps) {
  const statusColors = {
    loading: "bg-blue-500",
    transit: "bg-green-500",
    unloading: "bg-amber-500",
    idle: "bg-gray-500",
    maintenance: "bg-red-500",
  }

  const statusTextColors = {
    loading: "text-blue-700 bg-blue-100",
    transit: "text-green-700 bg-green-100",
    unloading: "text-amber-700 bg-amber-100",
    idle: "text-gray-700 bg-gray-100",
    maintenance: "text-red-700 bg-red-100",
  }

  return (
    <Card className={cn(fullSize && "col-span-full")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Live Fleet Tracking</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          <Navigation className="mr-2 h-4 w-4" />
          Center Map
        </Button>
      </CardHeader>
      <CardContent>
        <div className={cn("relative bg-muted rounded-lg overflow-hidden", fullSize ? "h-96" : "h-64")}>
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Mock road network */}
                <path d="M0,150 Q100,100 200,150 T400,150" stroke="#666" strokeWidth="3" fill="none" />
                <path d="M200,0 Q150,100 200,150 Q250,200 200,300" stroke="#666" strokeWidth="3" fill="none" />
                <path d="M0,100 L400,100" stroke="#999" strokeWidth="2" fill="none" />
                <path d="M0,200 L400,200" stroke="#999" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          {/* Plant Location */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
            <div className="w-3 h-3 bg-primary-foreground rounded-full" />
            <span className="text-sm font-medium">Cement Plant</span>
          </div>

          {/* Truck Markers */}
          {trucks.map((truck, index) => (
            <div
              key={truck.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${20 + ((index * 25) % 60)}%`,
                top: `${30 + ((index * 20) % 40)}%`,
              }}
            >
              <div className={cn("w-4 h-4 rounded-full shadow-lg", statusColors[truck.status])}>
                <div className="absolute inset-0 rounded-full animate-ping opacity-75" />
              </div>

              {/* Truck Info Tooltip */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{truck.truck_number}</span>
                    <Badge variant="outline" className={statusTextColors[truck.status]}>
                      {truck.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Driver: {truck.driver}</p>
                    <p>ETA: {truck.eta}</p>
                    <p>Load: {((truck.current_load / truck.load_capacity) * 100).toFixed(0)}%</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Fuel className="h-3 w-3" />
                    <span>{truck.fuel_level}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Destination Markers */}
          <div className="absolute top-16 right-8 flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg shadow-lg">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Site A</span>
          </div>
          <div className="absolute bottom-16 left-16 flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg shadow-lg">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Site B</span>
          </div>
          <div className="absolute bottom-8 right-16 flex items-center space-x-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-lg shadow-lg">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Site C</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <span className="capitalize">{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
