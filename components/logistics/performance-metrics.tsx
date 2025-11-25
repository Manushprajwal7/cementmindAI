"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, CheckCircle, Fuel, Truck, Zap } from "lucide-react";
import type { LogisticsRecommendation } from "@/types/logistics";

interface PerformanceMetricsProps {
  recommendations: LogisticsRecommendation;
}

export function PerformanceMetrics({
  recommendations,
}: PerformanceMetricsProps) {
  const { performance_metrics, improvement_opportunities } = recommendations;

  // Calculate additional metrics
  const onTimeDeliveryRate = 92.5; // Mock data
  const fleetUtilization = 87.3; // Mock data
  const costPerDelivery = 1250; // Mock data in INR

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Performance Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
              <Zap className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {performance_metrics.current_supply_efficiency}%
              </span>
            </div>
            <div className="text-sm text-blue-700 font-medium">
              Supply Efficiency
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
              <Fuel className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {performance_metrics.fuel_efficiency}%
              </span>
            </div>
            <div className="text-sm text-green-700 font-medium">
              Fuel Efficiency
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <div className="flex items-center justify-center space-x-2 text-amber-600 mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {performance_metrics.average_delay}
              </span>
            </div>
            <div className="text-sm text-amber-700 font-medium">
              Avg Delay (min)
            </div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center space-x-2 text-purple-600 mb-2">
              <Truck className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {performance_metrics.inventory_turnover}
              </span>
            </div>
            <div className="text-sm text-purple-700 font-medium">
              Inventory Turnover
            </div>
          </div>
        </div>

        {/* Detailed Progress Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Supply Chain Efficiency
                </span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {performance_metrics.current_supply_efficiency}%
              </span>
            </div>
            <Progress
              value={performance_metrics.current_supply_efficiency}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Fuel className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Fuel Optimization</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {performance_metrics.fuel_efficiency}%
              </span>
            </div>
            <Progress
              value={performance_metrics.fuel_efficiency}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">
                  On-Time Delivery Rate
                </span>
              </div>
              <span className="text-sm font-bold text-amber-600">
                {onTimeDeliveryRate}%
              </span>
            </div>
            <Progress value={onTimeDeliveryRate} className="h-2" />
          </div>
        </div>

        {/* Improvement Opportunities */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>AI Recommendations</span>
          </h4>
          <div className="space-y-2">
            {improvement_opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg"
              >
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">{opportunity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Forecast Visualization */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Truck Demand Forecast (Next 12h)</span>
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {recommendations.truck_scheduling.predicted_demand
              .slice(0, 12)
              .map((demand, index) => {
                const hour = new Date().getHours() + index;
                const displayHour = hour % 24;
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {displayHour}:00
                    </div>
                    <div className="h-16 bg-gradient-to-t from-blue-100 to-blue-50 border border-blue-200 rounded flex items-end justify-center p-1">
                      <div
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full transition-all"
                        style={{ height: `${(demand / 30) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium mt-1">{demand}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
