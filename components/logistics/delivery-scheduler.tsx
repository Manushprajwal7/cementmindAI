"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  User,
  Plus,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  ClockIcon,
  XCircle,
  X,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  isSameMonth,
  isSameDay,
  subDays,
  addWeeks,
  subWeeks,
} from "date-fns";

interface ScheduledDelivery {
  id: string;
  date: Date;
  time: string;
  truck: string;
  driver: string;
  destination: string;
  status: "scheduled" | "in-progress" | "completed" | "delayed";
  priority: "low" | "medium" | "high" | "critical";
  materials: string;
  quantity: number;
  contact: string;
}

const generateMockDeliveries = (): ScheduledDelivery[] => [
  {
    id: "del-001",
    date: new Date(),
    time: "09:00 AM",
    truck: "T-001",
    driver: "John Smith",
    destination: "Site A - Construction Project",
    status: "scheduled",
    priority: "high",
    materials: "Portland Cement",
    quantity: 25,
    contact: "Alice Johnson (9876543210)",
  },
  {
    id: "del-002",
    date: new Date(),
    time: "11:30 AM",
    truck: "T-002",
    driver: "Maria Garcia",
    destination: "Site B - Infrastructure",
    status: "in-progress",
    priority: "medium",
    materials: "Slag Cement",
    quantity: 30,
    contact: "Bob Wilson (9876543211)",
  },
  {
    id: "del-003",
    date: addDays(new Date(), 1),
    time: "02:00 PM",
    truck: "T-003",
    driver: "Robert Johnson",
    destination: "Site C - Residential Complex",
    status: "scheduled",
    priority: "low",
    materials: "White Cement",
    quantity: 15,
    contact: "Carol Davis (9876543212)",
  },
  {
    id: "del-004",
    date: addDays(new Date(), 2),
    time: "10:00 AM",
    truck: "T-001",
    driver: "John Smith",
    destination: "Site D - Commercial Building",
    status: "scheduled",
    priority: "critical",
    materials: "Rapid Hardening Cement",
    quantity: 40,
    contact: "David Brown (9876543213)",
  },
  {
    id: "del-005",
    date: subDays(new Date(), 1),
    time: "03:00 PM",
    truck: "T-004",
    driver: "Sarah Williams",
    destination: "Site E - Industrial Facility",
    status: "completed",
    priority: "medium",
    materials: "Sulfate Resisting Cement",
    quantity: 20,
    contact: "Eva Miller (9876543214)",
  },
  {
    id: "del-006",
    date: new Date(),
    time: "01:00 PM",
    truck: "T-005",
    driver: "Michael Chen",
    destination: "Site F - Road Construction",
    status: "delayed",
    priority: "high",
    materials: "Ordinary Portland Cement",
    quantity: 35,
    contact: "Frank Taylor (9876543215)",
  },
];

export function DeliveryScheduler() {
  const [deliveries] = useState<ScheduledDelivery[]>(generateMockDeliveries());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    time: "09:00 AM",
    truck: "",
    driver: "",
    destination: "",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    materials: "",
    quantity: 0,
    contact: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <ClockIcon className="h-4 w-4" />;
      case "in-progress":
        return <ClockIcon className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "delayed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleFormChange = (field: string, value: string | number | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the delivery data here
    console.log("New delivery:", formData);
    setShowForm(false);
    // Reset form
    setFormData({
      date: new Date(),
      time: "09:00 AM",
      truck: "",
      driver: "",
      destination: "",
      priority: "medium",
      materials: "",
      quantity: 0,
      contact: "",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    // Reset form
    setFormData({
      date: new Date(),
      time: "09:00 AM",
      truck: "",
      driver: "",
      destination: "",
      priority: "medium",
      materials: "",
      quantity: 0,
      contact: "",
    });
  };

  // Generate calendar days
  const startOfCalendar = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfCalendar, i)
  );

  // Filter deliveries based on current view, filters, and search
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Date filter
    const matchesDate =
      viewMode === "day"
        ? isSameDay(delivery.date, currentDate)
        : delivery.date >= startOfCalendar &&
          delivery.date <= addDays(startOfCalendar, 6);

    // Status filter
    const matchesStatus =
      filterStatus === "all" || delivery.status === filterStatus;

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.materials.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesStatus && matchesSearch;
  });

  // Group deliveries by date for week view
  const groupedDeliveries = filteredDeliveries.reduce((acc, delivery) => {
    const dateKey = format(delivery.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(delivery);
    return acc;
  }, {} as Record<string, ScheduledDelivery[]>);

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>New Delivery</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={closeForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={format(formData.date, "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleFormChange("date", new Date(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={formData.time}
                    onChange={(e) => handleFormChange("time", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Truck</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.truck}
                    onChange={(e) => handleFormChange("truck", e.target.value)}
                    placeholder="Enter truck ID"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Driver</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.driver}
                    onChange={(e) => handleFormChange("driver", e.target.value)}
                    placeholder="Enter driver name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Destination</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.destination}
                    onChange={(e) =>
                      handleFormChange("destination", e.target.value)
                    }
                    placeholder="Enter destination"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Materials</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.materials}
                    onChange={(e) =>
                      handleFormChange("materials", e.target.value)
                    }
                    placeholder="Enter materials type"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity (tons)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleFormChange("quantity", Number(e.target.value))
                    }
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.priority}
                    onChange={(e) =>
                      handleFormChange("priority", e.target.value)
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.contact}
                    onChange={(e) =>
                      handleFormChange("contact", e.target.value)
                    }
                    placeholder="Enter contact information"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit">Create Delivery</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Delivery Schedule</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search deliveries..."
                      className="pl-8 pr-4 py-2 border rounded-md text-sm w-full md:w-48"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    New Delivery
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        viewMode === "day"
                          ? subDays(currentDate, 1)
                          : subWeeks(currentDate, 1)
                      )
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentDate(
                        viewMode === "day"
                          ? addDays(currentDate, 1)
                          : addWeeks(currentDate, 1)
                      )
                    }
                  >
                    Next
                  </Button>
                  <h3 className="text-lg font-semibold ml-2">
                    {viewMode === "day"
                      ? format(currentDate, "EEEE, MMMM d, yyyy")
                      : `Week of ${format(startOfCalendar, "MMM d")} - ${format(
                          addDays(startOfCalendar, 6),
                          "MMM d, yyyy"
                        )}`}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex rounded-md overflow-hidden border">
                    <Button
                      variant={viewMode === "day" ? "default" : "outline"}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setViewMode("day")}
                    >
                      Day
                    </Button>
                    <Button
                      variant={viewMode === "week" ? "default" : "outline"}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setViewMode("week")}
                    >
                      Week
                    </Button>
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <select
                      className="pl-8 pr-4 py-2 border rounded-md text-sm appearance-none bg-background"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>
                </div>
              </div>

              {viewMode === "day" ? (
                // Day View
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`p-2 text-center text-sm cursor-pointer hover:bg-gray-100 rounded ${
                          !isSameMonth(day, currentDate) ? "text-gray-400" : ""
                        } ${isSameDay(day, currentDate) ? "bg-blue-100" : ""}`}
                        onClick={() => setCurrentDate(day)}
                      >
                        <div className="font-medium">{format(day, "EEE")}</div>
                        <div
                          className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                            isSameDay(day, new Date())
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Deliveries for{" "}
                        {format(currentDate, "EEEE, MMMM d, yyyy")}
                      </h4>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          {
                            filteredDeliveries.filter(
                              (d) => d.status === "scheduled"
                            ).length
                          }{" "}
                          Scheduled
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          {
                            filteredDeliveries.filter(
                              (d) => d.status === "in-progress"
                            ).length
                          }{" "}
                          In Progress
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          {
                            filteredDeliveries.filter(
                              (d) => d.status === "completed"
                            ).length
                          }{" "}
                          Completed
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          {
                            filteredDeliveries.filter(
                              (d) => d.status === "delayed"
                            ).length
                          }{" "}
                          Delayed
                        </Badge>
                      </div>
                    </div>

                    {filteredDeliveries.length > 0 ? (
                      <div className="grid gap-3">
                        {filteredDeliveries
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((delivery) => (
                            <div
                              key={delivery.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Truck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="font-medium truncate">
                                      {delivery.destination}
                                    </div>
                                    <Badge
                                      className={`${getPriorityColor(
                                        delivery.priority
                                      )} text-xs`}
                                    >
                                      {delivery.priority}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {delivery.materials} ({delivery.quantity}{" "}
                                    tons)
                                  </div>
                                  <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3 mt-2">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{delivery.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{delivery.truck}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{delivery.driver}</span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Contact: {delivery.contact}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                                <Badge
                                  className={`flex items-center gap-1 ${getStatusColor(
                                    delivery.status
                                  )}`}
                                >
                                  {getStatusIcon(delivery.status)}
                                  <span className="capitalize">
                                    {delivery.status.replace("-", " ")}
                                  </span>
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    alert(
                                      `Viewing details for delivery ${delivery.id}`
                                    )
                                  }
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Truck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No deliveries scheduled for this day</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Week View
                <div className="space-y-6">
                  <div className="grid grid-cols-8 gap-1">
                    <div className="p-2"></div>
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`p-2 text-center text-sm cursor-pointer hover:bg-gray-100 rounded ${
                          !isSameMonth(day, currentDate) ? "text-gray-400" : ""
                        } ${isSameDay(day, currentDate) ? "bg-blue-100" : ""}`}
                        onClick={() => {
                          setCurrentDate(day);
                          setViewMode("day");
                        }}
                      >
                        <div className="font-medium">{format(day, "EEE")}</div>
                        <div
                          className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                            isSameDay(day, new Date())
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {Object.keys(groupedDeliveries).length > 0 ? (
                    Object.entries(groupedDeliveries)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([dateKey, deliveriesForDate]) => {
                        const date = new Date(dateKey);
                        return (
                          <div key={dateKey} className="border rounded-lg">
                            <div className="bg-gray-50 p-3 border-b">
                              <h4 className="font-medium">
                                {format(date, "EEEE, MMMM d, yyyy")}
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({deliveriesForDate.length} deliveries)
                                </span>
                              </h4>
                            </div>
                            <div className="p-3 grid gap-3">
                              {deliveriesForDate
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((delivery) => (
                                  <div
                                    key={delivery.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded hover:bg-gray-50"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <div className="font-medium truncate">
                                            {delivery.destination}
                                          </div>
                                          <Badge
                                            className={`${getPriorityColor(
                                              delivery.priority
                                            )} text-xs`}
                                          >
                                            {delivery.priority}
                                          </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                          {delivery.materials} (
                                          {delivery.quantity} tons)
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                      <div className="text-sm text-muted-foreground">
                                        {delivery.time}
                                      </div>
                                      <Badge
                                        className={`flex items-center gap-1 ${getStatusColor(
                                          delivery.status
                                        )} text-xs`}
                                      >
                                        {getStatusIcon(delivery.status)}
                                        <span className="capitalize">
                                          {delivery.status.replace("-", " ")}
                                        </span>
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No deliveries scheduled for this week</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Cards - only show when not in form mode */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Today's Deliveries
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        deliveries.filter((d) => isSameDay(d.date, new Date()))
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        deliveries.filter((d) => d.status === "scheduled")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        deliveries.filter((d) => d.status === "in-progress")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        deliveries.filter((d) => d.status === "completed")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
