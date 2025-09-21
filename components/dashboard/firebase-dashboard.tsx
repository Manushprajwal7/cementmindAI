"use client";

import { useState, useEffect } from "react";
import { KPICard } from "./kpi-card";
import { MetricLineChart } from "./metric-line-chart";
import { AlertsStrip } from "./alerts-strip";
import { LogisticsWidget } from "./logistics-widget";
import { DrilldownPanel } from "./drilldown-panel";
import { useDashboardData, useFirebaseAuth } from "@/hooks/use-firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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

export function FirebaseDashboard() {
  const { user, loading: authLoading } = useFirebaseAuth();
  const {
    data: dashboardData,
    loading: dataLoading,
    error,
    refetch,
  } = useDashboardData();
  const [drilldownData, setDrilldownData] = useState<DrilldownData | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update last updated time when data changes
  useEffect(() => {
    if (dashboardData) {
      setLastUpdated(new Date());
    }
  }, [dashboardData]);

  const handleKPIClick = (kpiId: string) => {
    if (!dashboardData?.metrics) return;

    const kpi = dashboardData.metrics.find((m: any) => m.id === kpiId);
    if (!kpi) return;

    const mockDrilldownData: DrilldownData = {
      metricId: kpi.id,
      title: kpi.title || kpiId,
      currentValue: kpi.value || 0,
      unit: kpi.unit || "",
      status: kpi.status || "ok",
      timeWindow: "Last 1 hour",
      relatedMetrics: [
        {
          name: "Peak Value",
          value: (kpi.value || 0) * 1.1,
          unit: kpi.unit || "",
          trend: "up",
        },
        {
          name: "Average",
          value: (kpi.value || 0) * 0.95,
          unit: kpi.unit || "",
          trend: "stable",
        },
        {
          name: "Minimum",
          value: (kpi.value || 0) * 0.85,
          unit: kpi.unit || "",
          trend: "down",
        },
      ],
      events: [
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: "Threshold",
          message: `${kpi.title || kpiId} exceeded normal range`,
          severity: kpi.status === "critical" ? "error" : "warning",
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: "Calibration",
          message: "Sensor calibration completed",
          severity: "info",
        },
      ],
    };
    setDrilldownData(mockDrilldownData);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Show loading state
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error Loading Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default KPI data if Firebase data is not available
  const defaultKpiData = [
    {
      id: "energy-efficiency",
      title: "Energy Efficiency",
      value: 87.3,
      delta: 2.1,
      unit: "%",
      sparkline: [85, 86, 84, 87, 88, 87, 87.3],
      status: "ok" as const,
    },
    {
      id: "material-flow",
      title: "Material Flow Rate",
      value: 245.8,
      delta: -1.2,
      unit: "t/h",
      sparkline: [250, 248, 246, 245, 244, 246, 245.8],
      status: "warn" as const,
    },
    {
      id: "system-pressure",
      title: "System Pressure",
      value: 4.2,
      delta: 0.3,
      unit: "bar",
      sparkline: [4.1, 4.0, 4.1, 4.2, 4.3, 4.2, 4.2],
      status: "ok" as const,
    },
    {
      id: "quality-score",
      title: "Quality Score",
      value: 92.1,
      delta: -0.8,
      unit: "%",
      sparkline: [93, 92.5, 92.8, 92.2, 91.9, 92.0, 92.1],
      status: "critical" as const,
    },
  ];

  // Use Firebase data if available, otherwise use default data
  const kpiData =
    dashboardData?.metrics && dashboardData.metrics.length > 0
      ? dashboardData.metrics
      : defaultKpiData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Plant Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.displayName || user?.email || "User"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Live Data Stream
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Firebase Data Status */}
      {dashboardData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Firebase Backend Connected</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.recentAlerts?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Alerts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.qualityMetrics?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quality Tests
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardData.metrics?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">KPI Metrics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData.telemetryData ? "Live" : "Offline"}
                </div>
                <div className="text-sm text-muted-foreground">Telemetry</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertsStrip />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi: any) => (
          <div
            key={kpi.id}
            onClick={() => handleKPIClick(kpi.id)}
            className="cursor-pointer"
          >
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricLineChart
          title="Kiln Temperature"
          metricKey="kiln_temperature"
          unit="°C"
        />
        <MetricLineChart
          title="Material Flow vs Energy"
          metricKey="material_flow_energy"
          unit="Mixed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricLineChart
            title="System Performance Trends"
            metricKey="system_performance"
            unit="Various"
          />
        </div>
        <LogisticsWidget />
      </div>

      <DrilldownPanel
        data={drilldownData}
        onClose={() => setDrilldownData(null)}
      />
    </div>
  );
}
