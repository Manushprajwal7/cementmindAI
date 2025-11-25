"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Truck, Fuel, Wrench } from "lucide-react";

interface Alert {
  id: string;
  type: "delay" | "maintenance" | "fuel" | "route" | "load";
  severity: "low" | "medium" | "high" | "critical";
  truck: string;
  message: string;
  time: string;
  location?: string;
}

const generateMockAlerts = (): Alert[] => [
  {
    id: "alert-001",
    type: "delay",
    severity: "high",
    truck: "T-002",
    message: "Delivery delayed by 45 minutes due to traffic",
    time: "10:30 AM",
    location: "NH45 Highway",
  },
  {
    id: "alert-002",
    type: "maintenance",
    severity: "critical",
    truck: "T-003",
    message: "Engine temperature above normal range",
    time: "10:15 AM",
    location: "Site B",
  },
  {
    id: "alert-003",
    type: "fuel",
    severity: "medium",
    truck: "T-001",
    message: "Fuel level below 20%",
    time: "9:45 AM",
  },
  {
    id: "alert-004",
    type: "route",
    severity: "low",
    truck: "T-004",
    message: "Alternative route suggested due to road closure",
    time: "9:30 AM",
    location: "Industrial Area",
  },
];

export function RealTimeAlerts() {
  const alerts = generateMockAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      case "route":
        return <Truck className="h-4 w-4" />;
      case "load":
        return <Truck className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "delay":
        return "bg-blue-500";
      case "maintenance":
        return "bg-red-500";
      case "fuel":
        return "bg-amber-500";
      case "route":
        return "bg-green-500";
      case "load":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Real-time Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getSeverityColor(
                alert.severity
              )} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${getTypeColor(alert.type)}`}
                  >
                    <div className="text-white">{getAlertIcon(alert.type)}</div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{alert.truck}</h4>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{alert.message}</p>
                    {alert.location && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {alert.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
