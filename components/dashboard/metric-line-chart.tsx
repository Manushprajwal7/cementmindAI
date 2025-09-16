"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRealTimeData } from "@/hooks/use-real-time-data";

interface MetricLineChartProps {
  title: string;
  metricKey: string;
  unit: string;
}

// Mock data generator
const generateMockData = (metricKey: string) => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    let value: number;

    switch (metricKey) {
      case "kiln_temperature":
        value = 1450 + Math.sin(i * 0.3) * 50 + Math.random() * 20;
        break;
      case "material_flow_energy":
        value = 245 + Math.sin(i * 0.2) * 15 + Math.random() * 10;
        break;
      case "system_performance":
        value = 85 + Math.sin(i * 0.4) * 10 + Math.random() * 5;
        break;
      default:
        value = 100 + Math.random() * 50;
    }

    data.push({
      time: timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Number(value.toFixed(1)),
      timestamp: timestamp.getTime(),
    });
  }

  return data;
};

export function MetricLineChart({
  title,
  metricKey,
  unit,
}: MetricLineChartProps) {
  const isLive = metricKey.endsWith("_live");
  const { dataHistory } = useRealTimeData(isLive);

  let data = generateMockData(metricKey);
  if (isLive && dataHistory && dataHistory.length > 0) {
    const mapKey = metricKey.replace("_live", "");
    data = dataHistory.map((item) => {
      const t = new Date(item.timestamp);
      let value: number = 0;
      switch (mapKey) {
        case "kiln_temperature":
          value = item.performance_metrics.kiln_temperature;
          break;
        case "system_pressure":
          value = item.performance_metrics.system_pressure;
          break;
        case "material_flow_rate":
          value = item.performance_metrics.material_flow_rate;
          break;
        default:
          value = item.performance_metrics.quality_score;
      }
      return {
        time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: Number(value.toFixed(1)),
        timestamp: t.getTime(),
      };
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: number) => [`${value} ${unit}`, title]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
