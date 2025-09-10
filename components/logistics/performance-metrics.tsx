"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, CheckCircle } from "lucide-react"
import type { LogisticsRecommendation } from "@/types/logistics"

interface PerformanceMetricsProps {
  recommendations: LogisticsRecommendation
}

export function PerformanceMetrics({ recommendations }: PerformanceMetricsProps) {
  const { performance_metrics, improvement_opportunities } = recommendations

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Performance Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supply Efficiency</span>
              <span className="text-sm font-bold text-green-600">{performance_metrics.current_supply_efficiency}%</span>
            </div>
            <Progress value={performance_metrics.current_supply_efficiency} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fuel Efficiency</span>
              <span className="text-sm font-bold text-blue-600">{performance_metrics.fuel_efficiency}%</span>
            </div>
            <Progress value={performance_metrics.fuel_efficiency} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-amber-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-bold">{performance_metrics.average_delay}</span>
              </div>
              <div className="text-xs text-muted-foreground">Avg Delay (min)</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-primary mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-lg font-bold">{performance_metrics.inventory_turnover}</span>
              </div>
              <div className="text-xs text-muted-foreground">Inventory Turnover</div>
            </div>
          </div>
        </div>

        {/* Improvement Opportunities */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Improvement Opportunities</h4>
          <div className="space-y-2">
            {improvement_opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">{opportunity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Prediction */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Demand Forecast (Next 12h)</h4>
          <div className="grid grid-cols-6 gap-2">
            {recommendations.truck_scheduling.predicted_demand.map((demand, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{index + 8}:00</div>
                <div className="h-12 bg-muted rounded flex items-end justify-center">
                  <div
                    className="bg-primary rounded-t w-full transition-all"
                    style={{ height: `${(demand / 30) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-medium mt-1">{demand}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
