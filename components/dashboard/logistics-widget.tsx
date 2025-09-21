"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
interface TruckSchedule {
  id: string
  truckNumber: string
  status: "loading" | "transit" | "unloading" | "idle"
  eta: string
  destination: string
  load: number
}

const mockTruckData: TruckSchedule[] = [
  {
    id: "1",
    truckNumber: "T-001",
    status: "loading",
    eta: "14:30",
    destination: "Site A",
    load: 85,
  },
  {
    id: "2",
    truckNumber: "T-003",
    status: "transit",
    eta: "15:15",
    destination: "Site B",
    load: 92,
  },
  {
    id: "3",
    truckNumber: "T-007",
    status: "unloading",
    eta: "14:45",
    destination: "Site C",
    load: 78,
  },
]

export function LogisticsWidget() {
  const statusColors = {
    loading: "bg-blue-100 text-blue-800",
    transit: "bg-amber-100 text-amber-800",
    unloading: "bg-green-100 text-green-800",
    idle: "bg-gray-100 text-gray-800",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Logistics Overview</CardTitle>
        <Button variant="outline" size="sm">
          <Link href="/logistics">
          View Full Schedule
          </Link>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Active Trucks</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">2.4h</div>
            <div className="text-sm text-muted-foreground">Avg Delivery</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Next Deliveries</h4>
          {mockTruckData.map((truck) => (
            <div key={truck.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">{truck.truckNumber}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {truck.destination}
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <Badge variant="outline" className={statusColors[truck.status]}>
                  {truck.status}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  ETA {truck.eta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Supply Efficiency</span>
            <span className="font-medium text-green-600">94.2%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
