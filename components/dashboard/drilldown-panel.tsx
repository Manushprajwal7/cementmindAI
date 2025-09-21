"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { MetricLineChart } from "./metric-line-chart";

interface DrilldownData {
  metricId: string;
  title: string;
  currentValue: number;
  unit: string;
  status: "ok" | "warn" | "critical";
  timeWindow: string;
  relatedMetrics: Array<{
    name: string;
    value: number;
    unit: string;
    trend: "up" | "down" | "stable";
  }>;
  events: Array<{
    timestamp: string;
    type: string;
    message: string;
    severity: "info" | "warning" | "error";
  }>;
}

interface DrilldownPanelProps {
  data: DrilldownData | null;
  onClose: () => void;
}

export function DrilldownPanel({ data, onClose }: DrilldownPanelProps) {
  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-500";
      case "warn":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-background border-l border-border shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`}
          />
          <h3 className="font-semibold text-lg">{data.title}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Value */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.currentValue} {data.unit}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Time window: {data.timeWindow}
            </p>
          </CardContent>
        </Card>

        {/* Related Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Related Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.relatedMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{metric.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {metric.value} {metric.unit}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Historical Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Historical Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <MetricLineChart
                title=""
                metricKey={data.metricId}
                unit={data.unit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.events.length > 0 ? (
              data.events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50"
                >
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge
                        variant={getSeverityColor(event.severity)}
                        className="text-xs"
                      >
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{event.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
