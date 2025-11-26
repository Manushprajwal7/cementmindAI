"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Truck,
  AlertTriangle,
  Download,
  Loader2,
} from "lucide-react";

interface DemandDataPoint {
  date: string;
  actual: number;
  forecast: number;
  variance: number;
}

interface DetailedDemandData extends DemandDataPoint {
  accuracy: number;
  deviation: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface PeakHourData {
  hour: string;
  demand: number;
}

interface CSVData {
  [key: string]: string;
}

export function DemandForecasting() {
  const [demandData, setDemandData] = useState<DemandDataPoint[]>(
    generateDemandData()
  );
  const [detailedDemandData, setDetailedDemandData] = useState<
    DetailedDemandData[]
  >(generateDetailedDemandData());
  const [peakHourData, setPeakHourData] = useState<PeakHourData[]>(
    generatePeakHourData()
  );
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [showRawData, setShowRawData] = useState(false);
  const [usingMockData, setUsingMockData] = useState(true);
  const [statistics, setStatistics] = useState({
    avgAccuracy: 91,
    totalVariance: 9,
    bestDay: "Fri",
    worstDay: "Mon",
  });

  // Parse CSV data into our format
  const parseCSVData = (csvText: string): CSVData[] => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    const data: CSVData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((value) => value.trim());
      const row: CSVData = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }

    return data;
  };

  // Convert CSV data to our demand data format
  const convertToDemandData = (csvData: CSVData[]): DemandDataPoint[] => {
    return csvData
      .map((row) => {
        // Try to find date, actual, and forecast columns
        const dateKey =
          Object.keys(row).find(
            (key) =>
              key.toLowerCase().includes("date") ||
              key.toLowerCase().includes("time")
          ) || "date";

        const actualKey =
          Object.keys(row).find(
            (key) =>
              key.toLowerCase().includes("actual") ||
              key.toLowerCase().includes("real")
          ) || "actual";

        const forecastKey =
          Object.keys(row).find(
            (key) =>
              key.toLowerCase().includes("forecast") ||
              key.toLowerCase().includes("predicted")
          ) || "forecast";

        const actual = parseFloat(row[actualKey]) || 0;
        const forecast = parseFloat(row[forecastKey]) || 0;

        return {
          date: row[dateKey] || "",
          actual,
          forecast,
          variance: actual - forecast,
        };
      })
      .filter(
        (point) => point.date && !isNaN(point.actual) && !isNaN(point.forecast)
      );
  };

  // Convert CSV data to peak hour data format
  const convertToPeakHourData = (csvData: CSVData[]): PeakHourData[] => {
    // For simplicity, we'll create some sample data based on the CSV
    // In a real implementation, this would depend on the actual CSV structure
    const hours = [
      "6AM",
      "7AM",
      "8AM",
      "9AM",
      "10AM",
      "11AM",
      "12PM",
      "1PM",
      "2PM",
      "3PM",
      "4PM",
      "5PM",
      "6PM",
    ];
    return hours.map((hour, index) => ({
      hour,
      demand: Math.floor(Math.random() * 20) + 5, // Random data for now
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from our API route first
      const response = await fetch("/api/get-forecast");

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const jsonData = await response.json();

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error("No data received from API");
      }

      // Convert JSON data to our format
      const convertedData = jsonData
        .map((row: any) => {
          const dateKey =
            Object.keys(row).find(
              (key) =>
                key.toLowerCase().includes("date") ||
                key.toLowerCase().includes("time") ||
                key.toLowerCase().includes("day")
            ) || "date";

          const actualKey =
            Object.keys(row).find(
              (key) =>
                key.toLowerCase().includes("actual") ||
                key.toLowerCase().includes("real") ||
                key.toLowerCase().includes("observed")
            ) || "actual";

          const forecastKey =
            Object.keys(row).find(
              (key) =>
                key.toLowerCase().includes("forecast") ||
                key.toLowerCase().includes("predicted") ||
                key.toLowerCase().includes("expected")
            ) || "forecast";

          const actual = parseFloat(row[actualKey]) || 0;
          const forecast = parseFloat(row[forecastKey]) || 0;
          const variance = actual - forecast;

          // Calculate accuracy percentage
          const accuracy =
            forecast !== 0
              ? Math.abs(1 - Math.abs(variance) / forecast) * 100
              : 0;

          // Determine trend
          let trend: "increasing" | "decreasing" | "stable" = "stable";
          if (variance > 0) {
            trend = "increasing";
          } else if (variance < 0) {
            trend = "decreasing";
          }

          return {
            date: row[dateKey] || "",
            actual,
            forecast,
            variance,
            accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal place
            deviation: Math.abs(variance),
            trend,
          };
        })
        .filter(
          (point: any) =>
            point.date && !isNaN(point.actual) && !isNaN(point.forecast)
        );

      if (convertedData.length === 0) {
        throw new Error("No valid data found in the response");
      }

      setDemandData(convertedData);
      setDetailedDemandData(convertedData);
      setCsvData(jsonData);

      // Generate peak hour data based on actual demand
      const peakData = [
        {
          hour: "6AM",
          demand: Math.floor(convertedData[0]?.actual * 0.25) || 3,
        },
        {
          hour: "7AM",
          demand: Math.floor(convertedData[0]?.actual * 0.67) || 8,
        },
        { hour: "8AM", demand: convertedData[0]?.actual || 15 },
        {
          hour: "9AM",
          demand: Math.floor(convertedData[1]?.actual * 0.8) || 12,
        },
        {
          hour: "10AM",
          demand: Math.floor(convertedData[1]?.actual * 0.67) || 10,
        },
        {
          hour: "11AM",
          demand: Math.floor(convertedData[2]?.actual * 0.56) || 8,
        },
        {
          hour: "12PM",
          demand: Math.floor(convertedData[2]?.actual * 0.33) || 6,
        },
        {
          hour: "1PM",
          demand: Math.floor(convertedData[3]?.actual * 0.23) || 5,
        },
        {
          hour: "2PM",
          demand: Math.floor(convertedData[3]?.actual * 0.32) || 7,
        },
        {
          hour: "3PM",
          demand: Math.floor(convertedData[4]?.actual * 0.41) || 9,
        },
        {
          hour: "4PM",
          demand: Math.floor(convertedData[5]?.actual * 0.56) || 14,
        },
        { hour: "5PM", demand: convertedData[5]?.actual || 18 },
        {
          hour: "6PM",
          demand: Math.floor(convertedData[6]?.actual * 0.5) || 12,
        },
      ];

      setPeakHourData(peakData);

      // Calculate statistics
      const totalForecast = convertedData.reduce(
        (sum, point) => sum + point.forecast,
        0
      );
      const totalActual = convertedData.reduce(
        (sum, point) => sum + point.actual,
        0
      );
      const totalVariance = convertedData.reduce(
        (sum, point) => sum + point.variance,
        0
      );
      const avgAccuracy =
        convertedData.reduce((sum, point) => sum + point.accuracy, 0) /
        convertedData.length;

      // Find best and worst days based on accuracy
      const sortedByAccuracy = [...convertedData].sort(
        (a, b) => b.accuracy - a.accuracy
      );
      const bestDay = sortedByAccuracy[0]?.date || "";
      const worstDay =
        sortedByAccuracy[sortedByAccuracy.length - 1]?.date || "";

      setStatistics({
        avgAccuracy: Math.round(avgAccuracy),
        totalVariance: Math.round(totalVariance),
        bestDay,
        worstDay,
      });

      setUsingMockData(false); // Successfully loaded real data
    } catch (err) {
      console.error("Error fetching data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);

      // Ensure mock data is set
      setDemandData(generateDemandData());
      setDetailedDemandData(generateDetailedDemandData());
      setPeakHourData(generatePeakHourData());
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const totalForecast = demandData.reduce(
    (sum, point) => sum + point.forecast,
    0
  );
  const totalActual = demandData.reduce((sum, point) => sum + point.actual, 0);
  const accuracy =
    demandData.length > 0
      ? Math.round(
          (1 - Math.abs(totalActual - totalForecast) / totalActual) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Demand Forecasting</span>
              {usingMockData && (
                <Badge
                  variant="outline"
                  className="ml-2 text-amber-600 border-amber-300"
                >
                  Using Mock Data
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Refresh Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRawData(!showRawData)}
                disabled={csvData.length === 0 && !usingMockData}
              >
                {showRawData ? "Hide Raw Data" : "Show Raw Data"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              Error: {error}
            </div>
          )}

          {usingMockData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
              <strong>Note:</strong> Currently displaying mock data because the
              API could not fetch data from Google Cloud Storage. When properly
              configured with GCP credentials, this page will show real demand
              forecasting data.
              <code className="block mt-1 text-xs bg-muted p-1 rounded">
                API Endpoint: /api/get-forecast
              </code>
            </div>
          )}

          {/* Enhanced Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Forecast
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {totalForecast} trucks
                    </p>
                  </div>
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Actual Demand
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {totalActual} trucks
                    </p>
                  </div>
                  <Truck className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Forecast Accuracy
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {statistics.avgAccuracy || accuracy}%
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Variance
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {statistics.totalVariance ||
                        (totalActual - totalForecast > 0 ? "+" : "")}
                      {statistics.totalVariance || totalActual - totalForecast}
                    </p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best and Worst Days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Best Forecast Day
                    </p>
                    <p className="font-bold text-foreground">
                      {statistics.bestDay || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-red-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Worst Forecast Day
                    </p>
                    <p className="font-bold text-foreground">
                      {statistics.worstDay || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button
                variant={timeframe === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("week")}
              >
                Weekly
              </Button>
              <Button
                variant={timeframe === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("month")}
              >
                Monthly
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Accuracy:{" "}
              <span className="font-medium text-green-600">{accuracy}%</span>
            </div>
          </div>

          {/* Enhanced Demand Chart with Trend Indicators */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={detailedDemandData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 border border-gray-200 rounded shadow">
                          <p className="font-bold">{label}</p>
                          <p className="text-blue-600">
                            Actual: {data.actual} trucks
                          </p>
                          <p className="text-green-600">
                            Forecast: {data.forecast} trucks
                          </p>
                          <p
                            className={
                              data.variance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Variance: {data.variance >= 0 ? "+" : ""}
                            {data.variance}
                          </p>
                          <p className="text-purple-600">
                            Accuracy: {data.accuracy.toFixed(1)}%
                          </p>
                          <p className="text-gray-600">
                            Trend:{" "}
                            {data.trend === "increasing"
                              ? "↑ Increasing"
                              : data.trend === "decreasing"
                              ? "↓ Decreasing"
                              : "→ Stable"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Actual Demand"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Data Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Detailed Forecast Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forecast
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedDemandData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {row.actual}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {row.forecast}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                          row.variance > 0
                            ? "text-green-600"
                            : row.variance < 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {row.variance > 0 ? "+" : ""}
                        {row.variance}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span>{row.accuracy.toFixed(1)}%</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                row.accuracy >= 90
                                  ? "bg-green-500"
                                  : row.accuracy >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(row.accuracy, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {row.trend === "increasing" ? (
                          <span className="inline-flex items-center text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" /> Increasing
                          </span>
                        ) : row.trend === "decreasing" ? (
                          <span className="inline-flex items-center text-red-600">
                            <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />{" "}
                            Decreasing
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-gray-500">
                            <span className="h-4 w-4 mr-1">→</span> Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data Display */}
      {showRawData && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Data</CardTitle>
          </CardHeader>
          <CardContent>
            {usingMockData ? (
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Displaying mock data structure:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  {`date,actual,forecast
Mon,12,10
Tue,15,14
Wed,18,16
Thu,22,20
Fri,25,24
Sat,28,26
Sun,24,25`}
                </pre>
                <p className="mt-2">
                  In a production environment with proper GCP credentials, this
                  would show real data fetched from Google Cloud Storage via the
                  API:
                  <code className="block mt-1 text-xs bg-muted p-1 rounded">
                    /api/get-forecast
                  </code>
                </p>
              </div>
            ) : csvData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(csvData[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td
                            key={i}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 10 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Showing first 10 rows of {csvData.length} total rows
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No data available to display.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Peak Hour Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={peakHourData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="demand"
                  fill="#8b5cf6"
                  name="Truck Demand"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Peak demand occurs between 4PM-6PM with highest at 5PM (
            {peakHourData.length > 0
              ? Math.max(...peakHourData.map((d) => d.demand))
              : 0}{" "}
            trucks)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Generate mock demand data
const generateDemandData = (): DemandDataPoint[] => [
  { date: "Mon", actual: 12, forecast: 10, variance: 2 },
  { date: "Tue", actual: 15, forecast: 14, variance: 1 },
  { date: "Wed", actual: 18, forecast: 16, variance: 2 },
  { date: "Thu", actual: 22, forecast: 20, variance: 2 },
  { date: "Fri", actual: 25, forecast: 24, variance: 1 },
  { date: "Sat", actual: 28, forecast: 26, variance: 2 },
  { date: "Sun", actual: 24, forecast: 25, variance: -1 },
];

// Generate detailed demand data with additional metrics
const generateDetailedDemandData = (): DetailedDemandData[] => [
  {
    date: "Mon",
    actual: 12,
    forecast: 10,
    variance: 2,
    accuracy: 83.3,
    deviation: 2,
    trend: "increasing",
  },
  {
    date: "Tue",
    actual: 15,
    forecast: 14,
    variance: 1,
    accuracy: 93.3,
    deviation: 1,
    trend: "increasing",
  },
  {
    date: "Wed",
    actual: 18,
    forecast: 16,
    variance: 2,
    accuracy: 88.9,
    deviation: 2,
    trend: "increasing",
  },
  {
    date: "Thu",
    actual: 22,
    forecast: 20,
    variance: 2,
    accuracy: 90.9,
    deviation: 2,
    trend: "increasing",
  },
  {
    date: "Fri",
    actual: 25,
    forecast: 24,
    variance: 1,
    accuracy: 96.0,
    deviation: 1,
    trend: "increasing",
  },
  {
    date: "Sat",
    actual: 28,
    forecast: 26,
    variance: 2,
    accuracy: 92.9,
    deviation: 2,
    trend: "increasing",
  },
  {
    date: "Sun",
    actual: 24,
    forecast: 25,
    variance: -1,
    accuracy: 96.0,
    deviation: 1,
    trend: "decreasing",
  },
];

// Generate mock peak hour data
const generatePeakHourData = (): PeakHourData[] => [
  { hour: "6AM", demand: 3 },
  { hour: "7AM", demand: 8 },
  { hour: "8AM", demand: 15 },
  { hour: "9AM", demand: 12 },
  { hour: "10AM", demand: 10 },
  { hour: "11AM", demand: 8 },
  { hour: "12PM", demand: 6 },
  { hour: "1PM", demand: 5 },
  { hour: "2PM", demand: 7 },
  { hour: "3PM", demand: 9 },
  { hour: "4PM", demand: 14 },
  { hour: "5PM", demand: 18 },
  { hour: "6PM", demand: 12 },
];
