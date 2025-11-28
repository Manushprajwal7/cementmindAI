"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Settings,
  Download,
  AlertTriangle,
  Gauge,
  Database,
  History,
  AlertCircle,
  Loader2,
  BarChart,
} from "lucide-react";
import { MetricLineChart } from "@/components/dashboard/metric-line-chart";
import { HeatmapGrid } from "./heatmap-grid";
import { ScatterCorrelation } from "./scatter-correlation";
import { GaugeChart } from "./gauge-chart";
import { AnomalyTimeline } from "./anomaly-timeline";
import { MultiSeriesArea } from "./multi-series-area";
import { AlertThresholdConfig } from "./alert-threshold-config";
import { DataExportPanel } from "./data-export-panel";
import { StreamingControls } from "./streaming-controls";
import { SensorCalibration } from "./sensor-calibration";
import { PerformanceMetrics } from "./performance-metrics";
import { HistoricalReplay } from "./historical-replay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { analyzeTelemetryWithBigQuery } from "@/lib/google-cloud-service";

export function TelemetryConsole() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState("all");
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showStreamingControls, setShowStreamingControls] = useState(false);
  const [showSensorCalibration, setShowSensorCalibration] = useState(false);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  const [showHistoricalReplay, setShowHistoricalReplay] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  const [bigQueryData, setBigQueryData] = useState<any>(null);
  const [bigQueryLoading, setBigQueryLoading] = useState(false);
  const [bigQueryError, setBigQueryError] = useState<string | null>(null);

  // Mock data generation for demo purposes
  const [mockData, setMockData] = useState({
    temperature: 75 + Math.random() * 25, // 75-100°C
    pressure: 5 + Math.random() * 3, // 5-8 bar
    humidity: 40 + Math.random() * 40, // 40-80%
    vibration: 2 + Math.random() * 3, // 2-5 mm/s
    energyConsumption: 500 + Math.random() * 500, // 500-1000 kWh
  });

  // Update mock data at regular intervals
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setMockData({
          temperature: 75 + Math.random() * 25,
          pressure: 5 + Math.random() * 3,
          humidity: 40 + Math.random() * 40,
          vibration: 2 + Math.random() * 3,
          energyConsumption: 500 + Math.random() * 500,
        });
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isStreaming, refreshInterval]);

  // Mock data for charts
  const generateMockChartData = (count = 24) => {
    return Array.from({ length: count }, (_, i) => ({
      timestamp: Date.now() - (count - i) * 3600000, // Last 'count' hours
      time: new Date(Date.now() - (count - i) * 3600000).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      value: 50 + Math.sin(i / 2) * 30 + Math.random() * 10, // Oscillating with some randomness
    }));
  };

  const currentData = mockData;
  const dataHistory = generateMockChartData(24);
  const loading = false;
  const error = null;
  const connectionStatus = isStreaming ? "connected" : "disconnected";
  const lastUpdate = new Date().toISOString();

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  // Function to fetch BigQuery analyzed data
  const analyzeWithBigQuery = async () => {
    setBigQueryLoading(true);
    setBigQueryError(null);

    try {
      // Use the actual BigQuery analysis function
      const result = await analyzeTelemetryWithBigQuery();
      setBigQueryData(result);
    } catch (err: any) {
      console.error("Error analyzing with BigQuery:", err);
      setBigQueryError(err.message || "Failed to analyze data with BigQuery");
    } finally {
      setBigQueryLoading(false);
    }
  };

  // Function to close BigQuery results
  const closeBigQueryResults = () => {
    setBigQueryData(null);
    setBigQueryError(null);
  };

  return (
    <div className="space-y-6">
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while loading data
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex items-center justify-center p-4 mb-4 bg-muted rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
          <p>Loading telemetry data...</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Real-Time Telemetry Console
          </h2>
          <p className="text-muted-foreground">
            Live monitoring and analysis of plant operations
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* BigQuery Analysis Button */}
          <Button
            variant="default"
            onClick={analyzeWithBigQuery}
            disabled={bigQueryLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {bigQueryLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart className="h-4 w-4" />
                Analyze using BigQuery
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>

          <Select value={selectedMetrics} onValueChange={setSelectedMetrics}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="temperature">Temperature Only</SelectItem>
              <SelectItem value="pressure">Pressure Only</SelectItem>
              <SelectItem value="flow">Flow Rate Only</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleStreaming}>
            {isStreaming ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistoricalReplay(true)}
          >
            <History className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStreamingControls(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowThresholdConfig(true)}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSensorCalibration(true)}
          >
            <Gauge className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowExportPanel(true)}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPerformanceMetrics(true)}
          >
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* BigQuery Analysis Results */}
      {bigQueryError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>BigQuery Analysis Error</AlertTitle>
          <AlertDescription>{bigQueryError}</AlertDescription>
        </Alert>
      )}

      {bigQueryData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-600" />
                BigQuery Analysis Results
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeBigQueryResults}
                className="h-6 w-6 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">
                  Average Temperature
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {bigQueryData.summary.avgTemperature?.toFixed(1)}°C
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Max Pressure</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {bigQueryData.summary.maxPressure?.toFixed(1)} bar
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">
                  Anomalies Detected
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {bigQueryData.summary.anomalyCount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {bigQueryData.trends && bigQueryData.trends.length > 0 ? (
                    <ul className="space-y-2">
                      {bigQueryData.trends.map((trend: any, index: number) => (
                        <li
                          key={index}
                          className="flex justify-between items-center py-2 border-b"
                        >
                          <span className="font-medium capitalize">
                            {trend.metric}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              trend.trend === "increasing"
                                ? "bg-green-100 text-green-800"
                                : trend.trend === "decreasing"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {trend.change_percent
                              ? `${trend.trend} (${
                                  trend.change_percent > 0 ? "+" : ""
                                }${trend.change_percent}%)`
                              : trend.trend}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No trend data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Anomalies</CardTitle>
                </CardHeader>
                <CardContent>
                  {bigQueryData.anomalies &&
                  bigQueryData.anomalies.length > 0 ? (
                    <ul className="space-y-3">
                      {bigQueryData.anomalies
                        .slice(0, 5)
                        .map((anomaly: any, index: number) => (
                          <li
                            key={index}
                            className="p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">
                                {anomaly.metric}
                              </span>
                              <span className="text-sm text-gray-500">
                                {anomaly.timestamp
                                  ? new Date(
                                      anomaly.timestamp
                                    ).toLocaleTimeString()
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="mt-1 text-sm">
                              Value:{" "}
                              <span className="font-semibold">
                                {anomaly.value?.toFixed(1)}
                              </span>
                              {anomaly.threshold
                                ? ` (Threshold: ${anomaly.threshold})`
                                : ""}
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No anomalies detected
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                Analysis completed at{" "}
                {new Date(bigQueryData.metadata.timestamp).toLocaleString()}
              </p>
              <p>
                Processed {bigQueryData.metadata.rowCount} records in{" "}
                {bigQueryData.metadata.executionTimeMs}ms
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {lastUpdate && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <Badge variant="outline">
                {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {showHistoricalReplay && (
        <HistoricalReplay
          onTimeChange={() => {}}
          onPlayStateChange={() => {}}
        />
      )}

      {showPerformanceMetrics && (
        <PerformanceMetrics onClose={() => setShowPerformanceMetrics(false)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GaugeChart
          title="Temperature"
          value={currentData?.temperature || 0}
          max={100}
          unit="°C"
        />
        <GaugeChart
          title="Pressure"
          value={currentData?.pressure || 0}
          max={10}
          unit="bar"
        />
        <GaugeChart
          title="Humidity"
          value={currentData?.humidity || 0}
          max={100}
          unit="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 col-span-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Demo Mode:</span> Displaying
                simulated sensor data. To connect to real sensors, uncomment the
                real-time data fetching code.
              </p>
            </div>
          </div>
        </div>

        <MetricLineChart
          title="Kiln Temperature (Simulated)"
          metricKey="kiln_temperature_simulated"
          unit="°C"
        />
        <MetricLineChart
          title="System Pressure (Simulated)"
          metricKey="system_pressure_simulated"
          unit="bar"
        />
        <MetricLineChart
          title="Humidity (Simulated)"
          metricKey="humidity_simulated"
          unit="%"
        />
        <MetricLineChart
          title="Vibration (Simulated)"
          metricKey="vibration_simulated"
          unit="mm/s"
        />
      </div>

      <MultiSeriesArea />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScatterCorrelation />
        <HeatmapGrid />
      </div>

      <AnomalyTimeline />

      {showThresholdConfig && (
        <AlertThresholdConfig onClose={() => setShowThresholdConfig(false)} />
      )}

      {showExportPanel && (
        <DataExportPanel onClose={() => setShowExportPanel(false)} />
      )}

      {showStreamingControls && (
        <StreamingControls onClose={() => setShowStreamingControls(false)} />
      )}

      {showSensorCalibration && (
        <SensorCalibration onClose={() => setShowSensorCalibration(false)} />
      )}
    </div>
  );
}
