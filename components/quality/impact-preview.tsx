"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";
import type { EstimatedImpact } from "@/types/quality";

interface ImpactPreviewProps {
  impact: EstimatedImpact;
  selectedCorrections: string[];
  previewMode: boolean;
}

export function ImpactPreview({
  impact,
  selectedCorrections,
  previewMode,
}: ImpactPreviewProps) {
  const riskColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const riskLevels = {
    low: { level: 1, color: "bg-green-500" },
    medium: { level: 2, color: "bg-amber-500" },
    high: { level: 3, color: "bg-red-500" },
  };

  // Calculate confidence score based on various factors
  const calculateConfidenceScore = () => {
    // This would typically be calculated based on actual data
    // For now, we'll simulate based on risk level and improvement
    const baseScore = 100 - riskLevels[impact.risk_level].level * 20;
    const improvementBonus = Math.min(impact.quality_improvement * 5, 20);
    return Math.min(baseScore + improvementBonus, 100);
  };

  const confidenceScore = calculateConfidenceScore();

  return (
    <div className="space-y-6">
      {selectedCorrections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Corrections Selected
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Select corrections from the suggestions tab to preview their
                impact
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Confidence Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Confidence Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Confidence</span>
                <span className="text-sm font-bold">
                  {confidenceScore.toFixed(0)}%
                </span>
              </div>
              <Progress value={confidenceScore} className="h-3" />
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {impact.quality_improvement.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quality Gain
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {impact.cost_impact > 0 ? "+" : ""}$
                    {Math.abs(impact.cost_impact).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cost Impact
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">
                    {impact.time_to_effect}min
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Time to Effect
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Quality Improvement
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      +{impact.quality_improvement.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cost Impact
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {impact.cost_impact > 0 ? "+" : ""}$
                      {Math.abs(impact.cost_impact).toLocaleString()}
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Time to Effect
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {impact.time_to_effect}min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Risk Level
                    </p>
                    <Badge
                      variant="outline"
                      className={riskColors[impact.risk_level]}
                    >
                      {impact.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Detailed Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Process Stability Risk</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Low
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Deviation Risk</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Low
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Production Impact Risk</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800"
                  >
                    Medium
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipment Stress Risk</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Low
                  </Badge>
                </div>

                {/* Risk Visualization */}
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Risk Level</span>
                    <span className="font-medium">
                      {impact.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                    <div
                      className={`${riskLevels.low.color} ${
                        riskLevels[impact.risk_level].level >= 1
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                      style={{ width: "33.33%" }}
                    />
                    <div
                      className={`${riskLevels.medium.color} ${
                        riskLevels[impact.risk_level].level >= 2
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                      style={{ width: "33.33%" }}
                    />
                    <div
                      className={`${riskLevels.high.color} ${
                        riskLevels[impact.risk_level].level >= 3
                          ? "opacity-100"
                          : "opacity-30"
                      }`}
                      style={{ width: "33.33%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expected Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Expected Outcomes
              </CardTitle>
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
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Implementation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Preparation Phase</span>
                  <span className="text-sm text-muted-foreground">0-5 min</span>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Parameter Adjustment
                  </span>
                  <span className="text-sm text-muted-foreground">
                    5-15 min
                  </span>
                </div>
                <Progress value={previewMode ? 60 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    System Stabilization
                  </span>
                  <span className="text-sm text-muted-foreground">
                    15-45 min
                  </span>
                </div>
                <Progress value={previewMode ? 20 : 0} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Quality Verification
                  </span>
                  <span className="text-sm text-muted-foreground">
                    45-60 min
                  </span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Impact Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-teal-500" />
                Impact Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Quality Metrics Impact</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fineness</span>
                        <span className="font-medium text-green-600">
                          +2.1%
                        </span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Setting Time</span>
                        <span className="font-medium text-green-600">
                          -1.5%
                        </span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Strength</span>
                        <span className="font-medium text-green-600">
                          +1.8%
                        </span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Resource Impact</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Energy Consumption</span>
                        <span className="font-medium text-blue-600">-3.2%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Material Waste</span>
                        <span className="font-medium text-blue-600">-2.8%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Production Efficiency</span>
                        <span className="font-medium text-blue-600">+1.9%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
