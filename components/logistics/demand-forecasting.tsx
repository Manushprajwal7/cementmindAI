"use client";

import { useState } from "react";
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
import { TrendingUp, Calendar, Truck, AlertTriangle } from "lucide-react";

interface DemandDataPoint {
  date: string;
  actual: number;
  forecast: number;
  variance: number;
}

interface PeakHourData {
  hour: string;
  demand: number;
}

const generateDemandData = (): DemandDataPoint[] => [
  { date: "Mon", actual: 12, forecast: 10, variance: 2 },
  { date: "Tue", actual: 15, forecast: 14, variance: 1 },
  { date: "Wed", actual: 18, forecast: 16, variance: 2 },
  { date: "Thu", actual: 22, forecast: 20, variance: 2 },
  { date: "Fri", actual: 25, forecast: 24, variance: 1 },
  { date: "Sat", actual: 28, forecast: 26, variance: 2 },
  { date: "Sun", actual: 24, forecast: 25, variance: -1 },
];

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

export function DemandForecasting() {
  const [demandData] = useState<DemandDataPoint[]>(generateDemandData());
  const [peakHourData] = useState<PeakHourData[]>(generatePeakHourData());
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const totalForecast = demandData.reduce(
    (sum, point) => sum + point.forecast,
    0
  );
  const totalActual = demandData.reduce((sum, point) => sum + point.actual, 0);
  const accuracy = Math.round(
    (1 - Math.abs(totalActual - totalForecast) / totalActual) * 100
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Demand Forecasting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Forecast
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalForecast} trucks
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Actual Demand
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalActual} trucks
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Variance
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalActual - totalForecast > 0 ? "+" : ""}
                      {totalActual - totalForecast}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={demandData}
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
                <Tooltip />
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
        </CardContent>
      </Card>

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
            {Math.max(...peakHourData.map((d) => d.demand))} trucks)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
