"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine,
  Legend,
  Area,
} from "recharts";
// import { useRealtimeChartData } from "@/hooks/use-real-time-data";
import { useState, useEffect } from "react";

// Add JSX namespace for React
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Color mapping for different metrics
const metricColors: Record<string, { line: string; gradientStart: string; gradientEnd: string }> = {
  // Temperature metrics
  kiln_temperature: { line: '#FF6B6B', gradientStart: 'rgba(255, 107, 107, 0.2)', gradientEnd: 'rgba(255, 107, 107, 0.05)' },
  kiln_temperature_live: { line: '#FF6B6B', gradientStart: 'rgba(255, 107, 107, 0.2)', gradientEnd: 'rgba(255, 107, 107, 0.05)' },
  kiln_temperature_simulated: { line: '#FF6B6B', gradientStart: 'rgba(255, 107, 107, 0.2)', gradientEnd: 'rgba(255, 107, 107, 0.05)' },
  
  // Material flow metrics
  material_flow: { line: '#4ECDC4', gradientStart: 'rgba(78, 205, 196, 0.2)', gradientEnd: 'rgba(78, 205, 196, 0.05)' },
  material_flow_energy: { line: '#4ECDC4', gradientStart: 'rgba(78, 205, 196, 0.2)', gradientEnd: 'rgba(78, 205, 196, 0.05)' },
  
  // Pressure metrics
  system_pressure: { line: '#45B7D1', gradientStart: 'rgba(69, 183, 209, 0.2)', gradientEnd: 'rgba(69, 183, 209, 0.05)' },
  system_pressure_live: { line: '#45B7D1', gradientStart: 'rgba(69, 183, 209, 0.2)', gradientEnd: 'rgba(69, 183, 209, 0.05)' },
  system_pressure_simulated: { line: '#45B7D1', gradientStart: 'rgba(69, 183, 209, 0.2)', gradientEnd: 'rgba(69, 183, 209, 0.05)' },
  
  // Quality metrics
  quality_score: { line: '#96CEB4', gradientStart: 'rgba(150, 206, 180, 0.2)', gradientEnd: 'rgba(150, 206, 180, 0.05)' },
  
  // Energy metrics
  energy_consumption: { line: '#FFEEAD', gradientStart: 'rgba(255, 238, 173, 0.2)', gradientEnd: 'rgba(255, 238, 173, 0.05)' },
  
  // Performance metrics
  system_performance: { line: '#FFD166', gradientStart: 'rgba(255, 209, 102, 0.2)', gradientEnd: 'rgba(255, 209, 102, 0.05)' },
  
  // Vibration metrics
  vibration: { line: '#6A4C93', gradientStart: 'rgba(106, 76, 147, 0.2)', gradientEnd: 'rgba(106, 76, 147, 0.05)' },
  vibration_simulated: { line: '#6A4C93', gradientStart: 'rgba(106, 76, 147, 0.2)', gradientEnd: 'rgba(106, 76, 147, 0.05)' },
  
  // Humidity metrics
  humidity: { line: '#118AB2', gradientStart: 'rgba(17, 138, 178, 0.2)', gradientEnd: 'rgba(17, 138, 178, 0.05)' },
  humidity_simulated: { line: '#118AB2', gradientStart: 'rgba(17, 138, 178, 0.2)', gradientEnd: 'rgba(17, 138, 178, 0.05)' },
  
  // Default
  default: { line: '#8884d8', gradientStart: 'rgba(136, 132, 216, 0.2)', gradientEnd: 'rgba(136, 132, 216, 0.05)' },
};

interface MetricLineChartProps {
  title: string;
  metricKey: string;
  unit: string;
}

// Define types for the chart data
interface ChartDataPoint {
  timestamp: number;
  time: string;
  value: number;
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  unit,
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    const formattedValue = Number.isInteger(value) ? value : value.toFixed(2);
    
    return (
      <div className="bg-popover border border-border rounded-md p-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].stroke }} />
          <p className="text-sm font-semibold text-foreground">
            {formattedValue} <span className="text-muted-foreground font-normal">{unit}</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
  }
  return null;
};

// Fallback data generator in case real-time data is not available
const generateFallbackData = (metricKey: string): ChartDataPoint[] => {
  const now = Date.now();
  const data: ChartDataPoint[] = [];
  const points = 24; // Number of data points (last 24 hours)

  // Base values for different metrics with realistic ranges
  const baseValues: Record<string, { base: number; amplitude: number }> = {
    // Temperature in °C
    kiln_temperature: { base: 1450, amplitude: 50 },
    kiln_temperature_live: { base: 1450, amplitude: 50 },
    kiln_temperature_simulated: { base: 1450, amplitude: 50 },
    
    // Material flow in t/h (tons per hour)
    material_flow: { base: 245, amplitude: 35 },
    material_flow_energy: { base: 245, amplitude: 35 },
    
    // Pressure in bar
    system_pressure: { base: 4.2, amplitude: 0.8 },
    system_pressure_live: { base: 4.2, amplitude: 0.8 },
    system_pressure_simulated: { base: 4.2, amplitude: 0.8 },
    
    // Quality metrics in %
    quality_score: { base: 92, amplitude: 8 },
    
    // Energy consumption in kW
    energy_consumption: { base: 85, amplitude: 15 },
    
    // System performance in %
    system_performance: { base: 88, amplitude: 12 },
    
    // Vibration in mm/s
    vibration: { base: 3.5, amplitude: 2 },
    vibration_simulated: { base: 3.5, amplitude: 2 },
    
    // Humidity in %
    humidity: { base: 60, amplitude: 20 },
    humidity_simulated: { base: 60, amplitude: 20 },
  };

  // Default configuration if metric key not found
  const config = baseValues[metricKey] || { 
    base: 100, 
    amplitude: 20 
  };

  // Generate realistic time series data with daily patterns
  for (let i = 0; i < points; i++) {
    // Create timestamps for the last 24 hours
    const timestamp = now - (points - i - 1) * 60 * 60 * 1000; // 1-hour intervals
    
    // Time of day factor (0-1) for daily patterns
    const hour = new Date(timestamp).getHours();
    const timeOfDay = Math.sin((hour / 24) * Math.PI * 2);
    
    // Base pattern with daily cycle
    const dailyPattern = timeOfDay * config.amplitude * 0.5;
    
    // Add some medium-term trend (over 6-12 hours)
    const trend = Math.sin(i * 0.3) * config.amplitude * 0.3;
    
    // Add some short-term randomness
    const noise = (Math.random() - 0.5) * config.amplitude * 0.4;
    
    // Add occasional spikes (10% chance)
    const spike = Math.random() > 0.9 ? config.amplitude * 0.8 : 0;
    
    // Combine all factors
    let value = config.base + dailyPattern + trend + noise + spike;
    value = Math.max(0, value); // Ensure no negative values

    data.push({
      timestamp,
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Number(value.toFixed(2)),
    });
  }

  return data;
};

export function MetricLineChart({
  title,
  metricKey,
  unit,
}: MetricLineChartProps) {
  // Comment out real-time data fetching code
  /*
  // Use the real-time data hook to get data
  const { data, loading, error } = useRealtimeChartData(metricKey);
  */
  
  // For demo purposes, use fallback data
  const [chartData, setChartData] = useState<ChartDataPoint[]>(
    generateFallbackData(metricKey)
  );
  
  // Simulate real-time updates with random data
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a new set of data points
      const currentData = [...chartData];
      
      // Update the most recent data point with random variations
      if (currentData.length > 0) {
        const lastIndex = currentData.length - 1;
        const baseValues = {
          kiln_temperature: { base: 1450, amplitude: 50 },
          material_flow_energy: { base: 245, amplitude: 35 },
          system_performance: { base: 88, amplitude: 12 },
        };
        
        const config = baseValues[metricKey as keyof typeof baseValues] || 
                      { base: 100, amplitude: 20 };
        
        // Add random variation
        const randomChange = (Math.random() * 2 - 1) * (config.amplitude * 0.2);
        
        currentData[lastIndex] = {
          ...currentData[lastIndex],
          value: Math.max(0, currentData[lastIndex].value + randomChange),
        };
        
        // Occasionally add a new data point
        if (Math.random() > 0.7) {
          const lastTime = new Date(currentData[lastIndex].timestamp);
          const newTime = new Date(lastTime.getTime() + 15 * 60 * 1000);
          
          currentData.push({
            timestamp: newTime.getTime(),
            time: newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: currentData[lastIndex].value + (Math.random() * 2 - 1) * (config.amplitude * 0.3),
          });
          
          // Remove oldest data point if we have more than 24
          if (currentData.length > 24) {
            currentData.shift();
          }
        }
      }
      
      setChartData(currentData);
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, [chartData, metricKey]);
  
  // Comment out real-time data fetching code
  /*
  // Original real-time data fetching code
  const { data: realtimeData } = useRealtimeChartData(metricKey);
  
  React.useEffect(() => {
    if (realtimeData && realtimeData.length > 0) {
      setChartData(realtimeData);
    }
  }, [realtimeData]);
  */
  
  // Format the time for the x-axis
  const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Determine the domain for the Y-axis based on the data
  const yAxisDomain = React.useMemo((): [number, number] => {
    if (!chartData || chartData.length === 0) return [0, 100];

    const values = chartData
      .map((item) => item.value)
      .filter((v): v is number => typeof v === "number");
    if (values.length === 0) return [0, 100];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2; // 20% padding

    return [Math.max(0, min - padding), Math.ceil(max + padding)];
  }, [chartData]);

  // Custom tick formatter for Y-axis
  const formatYAxisTick = (value: number) => {
    return `${value}${unit}`;
  };

  // Format the tooltip with better readability
  const formatTooltip = (value: number, name: string, props: any) => {
    const date = new Date(props.payload.timestamp);
    const formattedDate = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    
    return (
      <div className="bg-background border border-border rounded-md p-3 shadow-lg">
        <p className="text-sm font-medium">
          {value.toFixed(2)} {unit}
        </p>
        <p className="text-xs text-muted-foreground">
          {formattedDate}
        </p>
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  // Get the appropriate colors for this metric
  const colors = metricColors[metricKey] || metricColors.default;

  return (
    <Card className="h-full flex flex-col bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span className="text-foreground">{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Real-time Data <span className="text-green-500 ml-1">(Live)</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id={`colorValue-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.gradientStart} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors.gradientEnd} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="time"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                  fontWeight: 500,
                }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
                interval={Math.floor(chartData.length / 5)}
                minTickGap={20}
              />
              <YAxis
                domain={yAxisDomain}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                  fontWeight: 500,
                }}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                content={<CustomTooltip unit={unit} />}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "0.8rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                itemStyle={{
                  color: colors.line,
                  fontWeight: 600,
                }}
                labelStyle={{
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: 500,
                }}
              />
              {/* Area fill */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="transparent"
                fillOpacity={1}
                fill={`url(#colorValue-${metricKey})`}
              />
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="value"
                name={title}
                stroke={colors.line}
                strokeWidth={2.5}
                dot={{
                  r: 2,
                  fill: colors.line,
                  stroke: 'transparent',
                  strokeWidth: 0,
                }}
                isAnimationActive={true}
                animationDuration={1500}
                activeDot={{
                  r: 5,
                  stroke: colors.line,
                  strokeWidth: 2,
                  fill: "hsl(var(--card))",
                  style: {
                    filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.2))',
                  },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
