"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, User, Fuel, Settings, Search, Plus } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"

interface TruckManagementProps {
  trucks: TruckSchedule[]
  onTruckUpdate: (trucks: TruckSchedule[]) => void
}

export function TruckManagement({ trucks, onTruckUpdate }: TruckManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch =
      truck.truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    loading: "text-blue-700 bg-blue-100",
    transit: "text-green-700 bg-green-100",
    unloading: "text-amber-700 bg-amber-100",
    idle: "text-gray-700 bg-gray-100",
    maintenance: "text-red-700 bg-red-100",
  }

  const handleStatusChange = (truckId: string, newStatus: TruckSchedule["status"]) => {
    const updatedTrucks = trucks.map((truck) => (truck.id === truckId ? { ...truck, status: newStatus } : truck))
    onTruckUpdate(updatedTrucks)
  }

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(statusColors).map(([status, colorClass]) => {
          const count = trucks.filter((truck) => truck.status === status).length
          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{status}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Fleet Management</span>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Truck
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trucks or drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
                <SelectItem value="transit">In Transit</SelectItem>
                <SelectItem value="unloading">Unloading</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Truck Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Truck</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Load</TableHead>
                <TableHead>Fuel</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{truck.truck_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{truck.driver}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={truck.status}
                      onValueChange={(value) => handleStatusChange(truck.id, value as TruckSchedule["status"])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loading">Loading</SelectItem>
                        <SelectItem value="transit">Transit</SelectItem>
                        <SelectItem value="unloading">Unloading</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{truck.current_location.address}</div>
                      <div className="text-muted-foreground">→ {truck.destination.site_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {((truck.current_load / truck.load_capacity) * 100).toFixed(0)}%
                      </div>
                      <div className="text-muted-foreground">{truck.current_load.toLocaleString()}kg</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className={truck.fuel_level < 25 ? "text-red-600 font-medium" : ""}>
                        {truck.fuel_level}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{truck.eta}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
