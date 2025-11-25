"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Truck, User } from "lucide-react";
import { format, addDays, startOfWeek, isSameMonth, isSameDay } from "date-fns";

interface ScheduledDelivery {
  id: string;
  date: Date;
  time: string;
  truck: string;
  driver: string;
  destination: string;
  status: "scheduled" | "in-progress" | "completed" | "delayed";
}

const generateMockDeliveries = (): ScheduledDelivery[] => [
  {
    id: "del-001",
    date: new Date(),
    time: "09:00 AM",
    truck: "T-001",
    driver: "John Smith",
    destination: "Site A",
    status: "scheduled",
  },
  {
    id: "del-002",
    date: new Date(),
    time: "11:30 AM",
    truck: "T-002",
    driver: "Maria Garcia",
    destination: "Site B",
    status: "in-progress",
  },
  {
    id: "del-003",
    date: addDays(new Date(), 1),
    time: "02:00 PM",
    truck: "T-003",
    driver: "Robert Johnson",
    destination: "Site C",
    status: "scheduled",
  },
  {
    id: "del-004",
    date: addDays(new Date(), 2),
    time: "10:00 AM",
    truck: "T-001",
    driver: "John Smith",
    destination: "Site D",
    status: "scheduled",
  },
];

export function DeliveryScheduler() {
  const [deliveries] = useState<ScheduledDelivery[]>(generateMockDeliveries());
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate calendar days
  const startOfCalendar = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfCalendar, i)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Delivery Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
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
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center text-sm ${
                  !isSameMonth(day, currentDate) ? "text-gray-400" : ""
                }`}
              >
                <div className="font-medium">{format(day, "EEE")}</div>
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                    isSameDay(day, new Date()) ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Today&apos;s Deliveries</h4>
            {deliveries
              .filter((delivery) => isSameDay(delivery.date, currentDate))
              .map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{delivery.destination}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{delivery.time}</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>{delivery.truck}</span>
                        <User className="h-3 w-3 ml-2" />
                        <span>{delivery.driver}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>
              ))}

            {deliveries.filter((delivery) =>
              isSameDay(delivery.date, currentDate)
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No deliveries scheduled for today
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
