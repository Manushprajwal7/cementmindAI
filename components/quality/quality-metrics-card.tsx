"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useQualityMetrics } from "@/lib/google-cloud-service";

interface QualityMetricsCardProps {
  title: string;
  value: number;
  unit: string;
  target?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  status?: "normal" | "warning" | "critical";
  description?: string;
  metricKey?: string;
}

export function QualityMetricsCard({
  title,
  value,
  metricKey,
  unit,
  target,
  status = "normal",
  description,
}: QualityMetricsCardProps) {
  // Fetch real-time quality metrics from Google Cloud
  const { data: qualityData, loading, error } = useQualityMetrics(30000, 10);

  // Get current and previous values to calculate trend
  const currentValue = value;
  const previousValue = value;

  // Calculate trend
  const trend =
    currentValue > previousValue
      ? "up"
      : currentValue < previousValue
      ? "down"
      : "neutral";

  // Calculate trend percentage
  const trendValue =
    previousValue !== 0
      ? Math.abs(((currentValue - previousValue) / previousValue) * 100)
      : 0;

  // Determine status based on target if available
  let calculatedStatus = status;
  if (target) {
    const deviation = Math.abs((currentValue - target) / target);
    calculatedStatus =
      deviation > 0.15 ? "critical" : deviation > 0.05 ? "warning" : "normal";
  }

  // Check if value is on target
  const isOnTarget = target
    ? Math.abs((currentValue - target) / target) <= 0.05
    : true;

  // Calculate quality score based on target deviation
  const score = target
    ? Math.max(0, 100 - Math.abs((currentValue - target) / target) * 100)
    : 85;

  // Trend colors
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  // Trend icon component
  const TrendIcon =
    trend === "up"
      ? ArrowUpIcon
      : trend === "down"
      ? ArrowDownIcon
      : () => null;

  // Calculate deviation from target
  const deviation = target ? ((currentValue - target) / target) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Badge
          variant={isOnTarget ? "default" : "destructive"}
          className="text-xs"
        >
          {isOnTarget ? "On Target" : "Off Target"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value.toFixed(title === "Fineness" ? 0 : 1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Target: {target} {unit}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quality Score</span>
              <span className="font-medium">{score.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  score >= 90
                    ? "bg-green-500"
                    : score >= 80
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center space-x-1 text-sm",
                trendColors[trend]
              )}
            >
              <TrendIcon className="h-4 w-4" />
              <span className="capitalize">{trend}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {deviation > 0 ? "+" : ""}
              {deviation.toFixed(1)}% vs target
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
