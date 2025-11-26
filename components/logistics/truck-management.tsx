"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  User,
  Fuel,
  Settings,
  Search,
  Plus,
  Wrench,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Battery,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Gauge,
  Eye,
  ArrowRight,
  Check,
} from "lucide-react";
import type { TruckSchedule } from "@/types/logistics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TruckManagementProps {
  trucks: TruckSchedule[];
  onTruckUpdate: (trucks: TruckSchedule[]) => void;
}

export function TruckManagement({
  trucks,
  onTruckUpdate,
}: TruckManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddTruckDialog, setShowAddTruckDialog] = useState(false);
  const [showTruckDetails, setShowTruckDetails] = useState<{
    open: boolean;
    truck: TruckSchedule | null;
  }>({ open: false, truck: null });
  const [newTruck, setNewTruck] = useState({
    truck_number: "",
    driver: "",
    status: "idle" as TruckSchedule["status"],
    load_capacity: 20000,
    current_load: 0,
    fuel_level: 100,
    route_distance: 0,
    eta: "N/A",
  });

  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch =
      truck.truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || truck.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate maintenance indicators
  const maintenanceIndicators = trucks.map((truck) => {
    // Simple maintenance prediction based on fuel level and status
    const needsMaintenanceSoon =
      truck.fuel_level < 30 || truck.status === "maintenance";
    const criticalMaintenance = truck.fuel_level < 15;

    return {
      truckId: truck.id,
      needsMaintenanceSoon,
      criticalMaintenance,
      recommendation: criticalMaintenance
        ? "Immediate maintenance required"
        : needsMaintenanceSoon
        ? "Schedule maintenance soon"
        : "No immediate maintenance needed",
    };
  });

  const statusColors = {
    loading: "text-blue-700 bg-blue-100",
    transit: "text-green-700 bg-green-100",
    unloading: "text-amber-700 bg-amber-100",
    idle: "text-gray-700 bg-gray-100",
    maintenance: "text-red-700 bg-red-100",
  };

  const handleStatusChange = (
    truckId: string,
    newStatus: TruckSchedule["status"]
  ) => {
    const updatedTrucks = trucks.map((truck) =>
      truck.id === truckId ? { ...truck, status: newStatus } : truck
    );
    onTruckUpdate(updatedTrucks);
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trucks.length}</div>
            <p className="text-xs text-muted-foreground">Active vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (trucks.filter(
                  (t) => t.status !== "idle" && t.status !== "maintenance"
                ).length /
                  trucks.length) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Fleet in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Fuel Level
            </CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                trucks.reduce((sum, t) => sum + t.fuel_level, 0) / trucks.length
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across fleet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maintenance Due
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                trucks.filter(
                  (t) => t.fuel_level < 20 || t.status === "maintenance"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span>Fleet Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Load Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (trucks.reduce(
                    (sum, t) => sum + t.current_load / t.load_capacity,
                    0
                  ) /
                    trucks.length) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Average load capacity utilization
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">On-Time Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (trucks.filter((t) => t.status !== "maintenance").length /
                    trucks.length) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Deliveries on schedule
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Fuel Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {Math.round(
                  (trucks.reduce((sum, t) => sum + t.fuel_level / 100, 0) /
                    trucks.length) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Average fuel economy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            <span>Maintenance Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">
                  Critical Issues
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {
                  maintenanceIndicators.filter((m) => m.criticalMaintenance)
                    .length
                }
              </div>
              <p className="text-xs text-red-700">
                Require immediate attention
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">
                  Scheduled Soon
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {
                  maintenanceIndicators.filter(
                    (m) => m.needsMaintenanceSoon && !m.criticalMaintenance
                  ).length
                }
              </div>
              <p className="text-xs text-amber-700">
                Maintenance due within 7 days
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Good Condition
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {
                  maintenanceIndicators.filter((m) => !m.needsMaintenanceSoon)
                    .length
                }
              </div>
              <p className="text-xs text-green-700">
                No immediate maintenance needed
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Predictive Maintenance Insights
            </h4>
            <p className="text-sm text-blue-700">
              Our system monitors fuel levels, engine hours, and operational
              data to predict maintenance needs. Schedule preventive maintenance
              to reduce downtime and extend vehicle lifespan.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            <span>Fuel Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Total Fuel Consumption</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {(
                  trucks.reduce((sum, t) => sum + (100 - t.fuel_level), 0) * 50
                ).toLocaleString()}
                L
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated daily consumption
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Fuel Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (trucks.reduce((sum, t) => sum + t.fuel_level / 100, 0) /
                    trucks.length) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Average fuel economy
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Low Fuel Alerts</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {trucks.filter((t) => t.fuel_level < 25).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Vehicles needing refueling
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Fuel Optimization Tips
            </h4>
            <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
              <li>Plan routes to minimize backtracking and idle time</li>
              <li>Maintain optimal tire pressure to reduce fuel consumption</li>
              <li>Train drivers on fuel-efficient driving techniques</li>
              <li>
                Schedule regular maintenance to keep engines running efficiently
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Fleet Management</span>
            </div>
            <Button onClick={() => setShowAddTruckDialog(true)}>
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
                    <Badge
                      variant="outline"
                      className={`${statusColors[truck.status]} capitalize`}
                    >
                      {truck.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">
                          {truck.current_location.address}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {truck.destination.site_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {(
                          (truck.current_load / truck.load_capacity) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                      <div className="text-muted-foreground">
                        {truck.current_load.toLocaleString()}kg
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={
                          truck.fuel_level < 25
                            ? "text-red-600 font-medium"
                            : truck.fuel_level < 50
                            ? "text-amber-600"
                            : "text-green-600"
                        }
                      >
                        {truck.fuel_level}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge variant="outline">{truck.eta}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {truck.route_distance} km
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowTruckDetails({ open: true, truck })
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            alert(
                              `Opening settings for truck ${truck.truck_number}`
                            )
                          }
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      {maintenanceIndicators.find((m) => m.truckId === truck.id)
                        ?.needsMaintenanceSoon && (
                        <Badge
                          variant="outline"
                          className={
                            maintenanceIndicators.find(
                              (m) => m.truckId === truck.id
                            )?.criticalMaintenance
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }
                        >
                          <Wrench className="h-3 w-3 mr-1" />
                          {maintenanceIndicators.find(
                            (m) => m.truckId === truck.id
                          )?.criticalMaintenance
                            ? "Critical"
                            : "Maintenance"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Truck Dialog */}
      <Dialog open={showAddTruckDialog} onOpenChange={setShowAddTruckDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add New Truck</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Truck Number</label>
              <Input
                placeholder="e.g., T-001"
                value={newTruck.truck_number}
                onChange={(e) =>
                  setNewTruck({ ...newTruck, truck_number: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Driver Name</label>
              <Input
                placeholder="Driver name"
                value={newTruck.driver}
                onChange={(e) =>
                  setNewTruck({ ...newTruck, driver: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Load Capacity (kg)</label>
              <Input
                type="number"
                placeholder="20000"
                value={newTruck.load_capacity}
                onChange={(e) =>
                  setNewTruck({
                    ...newTruck,
                    load_capacity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Status</label>
              <Select
                value={newTruck.status}
                onValueChange={(value) =>
                  setNewTruck({
                    ...newTruck,
                    status: value as TruckSchedule["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="transit">In Transit</SelectItem>
                  <SelectItem value="unloading">Unloading</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTruckDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In a real app, this would add the truck to the system
                  alert(`Truck ${newTruck.truck_number} added successfully!`);
                  setShowAddTruckDialog(false);
                  setNewTruck({
                    truck_number: "",
                    driver: "",
                    status: "idle",
                    load_capacity: 20000,
                    current_load: 0,
                    fuel_level: 100,
                    route_distance: 0,
                    eta: "N/A",
                  });
                }}
              >
                Add Truck
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Truck Details Dialog */}
      <Dialog
        open={showTruckDetails.open}
        onOpenChange={(open) => setShowTruckDetails({ open, truck: null })}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Truck Details</span>
            </DialogTitle>
          </DialogHeader>

          {showTruckDetails.truck && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Vehicle Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Truck Number:
                        </span>
                        <span className="font-medium">
                          {showTruckDetails.truck.truck_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-medium">
                          {showTruckDetails.truck.driver}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant="outline"
                          className={`${
                            statusColors[showTruckDetails.truck.status]
                          } capitalize`}
                        >
                          {showTruckDetails.truck.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Updated:
                        </span>
                        <span className="font-medium">
                          {showTruckDetails.truck.last_updated}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Performance Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Load Efficiency:
                        </span>
                        <span className="font-medium">
                          {Math.round(
                            (showTruckDetails.truck.current_load /
                              showTruckDetails.truck.load_capacity) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Fuel Level:
                        </span>
                        <span
                          className={`font-medium ${
                            showTruckDetails.truck.fuel_level < 25
                              ? "text-red-600"
                              : showTruckDetails.truck.fuel_level < 50
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {showTruckDetails.truck.fuel_level}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Route Distance:
                        </span>
                        <span className="font-medium">
                          {showTruckDetails.truck.route_distance} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="font-medium">
                          {showTruckDetails.truck.eta}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location Information</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Current Location:
                      </div>
                      <div className="font-medium">
                        {showTruckDetails.truck.current_location.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Lat:{" "}
                        {showTruckDetails.truck.current_location.lat.toFixed(6)}
                        , Lng:{" "}
                        {showTruckDetails.truck.current_location.lng.toFixed(6)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Destination:
                      </div>
                      <div className="font-medium">
                        {showTruckDetails.truck.destination.site_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {showTruckDetails.truck.destination.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Lat: {showTruckDetails.truck.destination.lat.toFixed(6)}
                        , Lng:{" "}
                        {showTruckDetails.truck.destination.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Maintenance Status</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Level:</span>
                      <span
                        className={`font-medium ${
                          showTruckDetails.truck.fuel_level < 25
                            ? "text-red-600"
                            : showTruckDetails.truck.fuel_level < 50
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {showTruckDetails.truck.fuel_level}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Maintenance Status:
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          showTruckDetails.truck.status === "maintenance"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {showTruckDetails.truck.status === "maintenance"
                          ? "In Maintenance"
                          : "Operational"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Service:
                      </span>
                      <span className="font-medium">15 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Next Service Due:
                      </span>
                      <span className="font-medium">in 15 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would open maintenance logs
                    if (showTruckDetails.truck) {
                      alert(
                        `Opening maintenance logs for ${showTruckDetails.truck.truck_number}`
                      );
                    }
                  }}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance Logs
                </Button>
                <Button
                  onClick={() => {
                    // In a real app, this would assign new task
                    if (showTruckDetails.truck) {
                      alert(
                        `Assigning new task to ${showTruckDetails.truck.truck_number}`
                      );
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
