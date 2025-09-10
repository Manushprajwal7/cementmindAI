"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Clock, Shield, CheckCircle } from "lucide-react"
import type { EstimatedImpact } from "@/types/quality"

interface ImpactPreviewProps {
  impact: EstimatedImpact
  selectedCorrections: string[]
  previewMode: boolean
}

export function ImpactPreview({ impact, selectedCorrections, previewMode }: ImpactPreviewProps) {
  const riskColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-6">
      {selectedCorrections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No Corrections Selected</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Select corrections from the suggestions tab to preview their impact
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quality Improvement</p>
                    <p className="text-2xl font-bold text-green-600">+{impact.quality_improvement.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Impact</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {impact.cost_impact > 0 ? "+" : ""}${Math.abs(impact.cost_impact).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time to Effect</p>
                    <p className="text-2xl font-bold text-amber-600">{impact.time_to_effect}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                    <Badge variant="outline" className={riskColors[impact.risk_level]}>
                      {impact.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expected Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {impact.expected_outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{outcome}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Preparation Phase</span>
                  <span className="text-sm text-muted-foreground">0-5 min</span>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Parameter Adjustment</span>
                  <span className="text-sm text-muted-foreground">5-15 min</span>
                </div>
                <Progress value={previewMode ? 60 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Stabilization</span>
                  <span className="text-sm text-muted-foreground">15-45 min</span>
                </div>
                <Progress value={previewMode ? 20 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality Verification</span>
                  <span className="text-sm text-muted-foreground">45-60 min</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Process Stability Risk</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Low
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Deviation Risk</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Low
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Production Impact Risk</span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Medium
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipment Stress Risk</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Low
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
