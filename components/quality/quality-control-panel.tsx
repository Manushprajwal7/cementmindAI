"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { QualityMetricsCard } from "./quality-metrics-card";
import { CorrectionSuggestions } from "./correction-suggestions";
import { ManualAdjustments } from "./manual-adjustments";
import { ImpactPreview } from "./impact-preview";
import { QualityTrends } from "./quality-trends";
import { AIQualityEngineer } from "./ai-quality-engineer";
import type { QualityPrediction } from "@/types/quality";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import { useFirebaseData } from "@/hooks/use-firebase";

// Fallback quality prediction data if Firebase data is not available
const generateFallbackQualityData = (): QualityPrediction => ({
  predicted_fineness: 3420,
  predicted_setting_time: 185,
  predicted_strength: 42.8,
  quality_scores: {
    fineness_score: 87.3,
    setting_score: 91.2,
    strength_score: 85.6,
    overall_score: 88.0,
  },
  quality_grade: "A",
  corrections: {
    process_adjustments: [
      {
        parameter: "Kiln Temperature",
        current_value: 1480,
        suggested_value: 1465,
        adjustment_type: "decrease",
        confidence: 0.89,
        description: "Reduce temperature to improve fineness control",
      },
      {
        parameter: "Mill Speed",
        current_value: 16.2,
        suggested_value: 16.8,
        adjustment_type: "increase",
        confidence: 0.76,
        description:
          "Increase mill speed for better particle size distribution",
      },
    ],
    material_adjustments: [
      {
        material: "Limestone",
        current_percentage: 78.5,
        suggested_percentage: 79.2,
        adjustment_type: "increase",
        confidence: 0.82,
        description: "Increase limestone content to improve strength",
      },
      {
        material: "Gypsum",
        current_percentage: 4.2,
        suggested_percentage: 3.8,
        adjustment_type: "decrease",
        confidence: 0.71,
        description: "Reduce gypsum to optimize setting time",
      },
    ],
    estimated_impact: {
      quality_improvement: 3.2,
      cost_impact: -1250,
      time_to_effect: 45,
      risk_level: "low",
      expected_outcomes: [
        "Improved fineness by 2-4%",
        "Reduced setting time variation",
        "Enhanced strength consistency",
        "Lower energy consumption",
      ],
    },
  },
});

export function QualityControlPanel() {
  // Get real-time data from Firebase Realtime Database
  const {
    currentData,
    error: rtError,
    loading: rtLoading,
    lastUpdate,
  } = useRealTimeData();

  // Get data from Firestore via API
  const {
    data: firestoreData,
    loading: fsLoading,
    error: fsError,
    refetch,
  } = useFirebaseData<any>("quality");

  const [qualityData, setQualityData] = useState<QualityPrediction>(
    generateFallbackQualityData()
  );
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cloudVisionData, setCloudVisionData] = useState<any>(null);
  const [cloudVisionLoading, setCloudVisionLoading] = useState(false);
  const [cloudVisionError, setCloudVisionError] = useState<string | null>(null);

  // Update quality data when Firebase Realtime Database data changes
  useEffect(() => {
    if (currentData?.recommendations?.quality_control) {
      const rtdbData = currentData.recommendations.quality_control;

      // Convert Firebase data to QualityPrediction format
      const newQualityData: QualityPrediction = {
        predicted_fineness:
          rtdbData.predicted_fineness || qualityData.predicted_fineness,
        predicted_setting_time:
          rtdbData.predicted_setting_time || qualityData.predicted_setting_time,
        predicted_strength:
          rtdbData.predicted_strength || qualityData.predicted_strength,
        quality_scores: {
          fineness_score: qualityData.quality_scores.fineness_score,
          setting_score: qualityData.quality_scores.setting_score,
          strength_score: qualityData.quality_scores.strength_score,
          overall_score:
            currentData.performance_metrics?.quality_score ||
            qualityData.quality_scores.overall_score,
        },
        quality_grade:
          currentData.performance_metrics?.quality_score > 90
            ? "A"
            : currentData.performance_metrics?.quality_score > 80
            ? "B"
            : currentData.performance_metrics?.quality_score > 70
            ? "C"
            : "D",
        corrections: qualityData.corrections,
      };

      setQualityData(newQualityData);
    }
  }, [currentData]);

  const refreshData = () => {
    // With real-time data, this just forces a UI refresh
    setQualityData({ ...qualityData });
  };

  const handleApplyCorrections = () => {
    // Implementation for applying corrections
    console.log("Applying corrections:", selectedCorrections);
    setPreviewMode(false);
    setSelectedCorrections([]);
    refreshData();
  };

  const handlePreviewCorrections = () => {
    setPreviewMode(true);
  };

  // Function to analyze quality using Cloud Vision
  const analyzeQualityWithCloudVision = async () => {
    setCloudVisionLoading(true);
    setCloudVisionError(null);

    try {
      // In a real implementation, this would connect to cameras on the conveyor belt
      // For now, we'll simulate the response with mock data
      const mockCloudVisionResponse = {
        metadata: {
          timestamp: new Date().toISOString(),
          cameraId: "conveyor-belt-01",
          processingTimeMs: 420,
        },
        findings: {
          colorInconsistencies: [
            {
              timestamp: "2023-05-15T14:30:15Z",
              location: "Zone 3",
              severity: "medium",
              description: "Detected slight color variation in material batch",
            },
            {
              timestamp: "2023-05-15T14:32:45Z",
              location: "Zone 5",
              severity: "low",
              description: "Minor discoloration detected",
            },
          ],
          oversizedGrains: [
            {
              timestamp: "2023-05-15T14:31:22Z",
              size: 12.5,
              threshold: 10.0,
              location: "Screening Unit 2",
            },
          ],
          impurities: [
            {
              timestamp: "2023-05-15T14:33:10Z",
              type: "organic matter",
              confidence: 0.87,
              location: "Zone 4",
            },
            {
              timestamp: "2023-05-15T14:34:55Z",
              type: "metal fragments",
              confidence: 0.92,
              location: "Zone 6",
            },
          ],
        },
        summary: {
          totalIssues: 5,
          criticalIssues: 1,
          warnings: 3,
          recommendations: [
            "Adjust screening parameters for Zone 5",
            "Review raw material source for organic contamination",
            "Inspect metal detectors in Zone 6",
          ],
        },
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCloudVisionData(mockCloudVisionResponse);
    } catch (err: any) {
      console.error("Error analyzing with Cloud Vision:", err);
      setCloudVisionError(
        err.message || "Failed to analyze quality with Cloud Vision"
      );
    } finally {
      setCloudVisionLoading(false);
    }
  };

  // Function to close Cloud Vision results
  const closeCloudVisionResults = () => {
    setCloudVisionData(null);
    setCloudVisionError(null);
  };

  const gradeColors = {
    A: "bg-green-100 text-green-800 border-green-200",
    B: "bg-blue-100 text-blue-800 border-blue-200",
    C: "bg-amber-100 text-amber-800 border-amber-200",
    D: "bg-red-100 text-red-800 border-red-200",
  };

  // Combine both error states for display
  const error = rtError || fsError;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Quality Control Panel
          </h2>
          <p className="text-muted-foreground">
            Monitor and optimize cement quality parameters
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Cloud Vision Analysis Button */}
          <Button
            variant="default"
            onClick={analyzeQualityWithCloudVision}
            disabled={cloudVisionLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            {cloudVisionLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Analyze quality using Cloud Vision
              </>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live Predictions
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Cloud Vision Analysis Results */}
      {cloudVisionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cloud Vision Analysis Error</AlertTitle>
          <AlertDescription>{cloudVisionError}</AlertDescription>
        </Alert>
      )}

      {cloudVisionData && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Cloud Vision Quality Analysis Results
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800"
                >
                  Live Feed
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCloudVisionResults}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-700">
                  Total Issues Detected
                </h4>
                <p className="text-2xl font-bold text-purple-600">
                  {cloudVisionData.summary.totalIssues}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-700">Critical Issues</h4>
                <p className="text-2xl font-bold text-red-600">
                  {cloudVisionData.summary.criticalIssues}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-700">Warnings</h4>
                <p className="text-2xl font-bold text-amber-600">
                  {cloudVisionData.summary.warnings}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Color Inconsistencies */}
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-3 text-purple-700">
                    Color Inconsistencies
                  </h4>
                  {cloudVisionData.findings.colorInconsistencies.length > 0 ? (
                    <ul className="space-y-2">
                      {cloudVisionData.findings.colorInconsistencies.map(
                        (issue: any, index: number) => (
                          <li
                            key={index}
                            className="p-2 bg-amber-50 rounded border border-amber-200"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">
                                {issue.location}
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  issue.severity === "high"
                                    ? "bg-red-100 text-red-800"
                                    : issue.severity === "medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {issue.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(issue.timestamp).toLocaleTimeString()}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No color inconsistencies detected
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Oversized Grains */}
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-3 text-purple-700">
                    Oversized Grains
                  </h4>
                  {cloudVisionData.findings.oversizedGrains.length > 0 ? (
                    <ul className="space-y-2">
                      {cloudVisionData.findings.oversizedGrains.map(
                        (issue: any, index: number) => (
                          <li
                            key={index}
                            className="p-2 bg-red-50 rounded border border-red-200"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">
                                {issue.location}
                              </span>
                              <span className="text-xs font-semibold text-red-700">
                                {issue.size}mm
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-600">
                                Threshold: {issue.threshold}mm
                              </span>
                              <span className="text-xs text-red-700">
                                +
                                {(
                                  ((issue.size - issue.threshold) /
                                    issue.threshold) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(issue.timestamp).toLocaleTimeString()}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No oversized grains detected
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Impurities */}
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-3 text-purple-700">
                    Impurities
                  </h4>
                  {cloudVisionData.findings.impurities.length > 0 ? (
                    <ul className="space-y-2">
                      {cloudVisionData.findings.impurities.map(
                        (issue: any, index: number) => (
                          <li
                            key={index}
                            className="p-2 bg-red-50 rounded border border-red-200"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-sm capitalize">
                                {issue.type}
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 text-xs"
                              >
                                {Math.round(issue.confidence * 100)}%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {issue.location}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(issue.timestamp).toLocaleTimeString()}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No impurities detected
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {cloudVisionData.summary.recommendations.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2 text-purple-700">
                  Recommendations
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {cloudVisionData.summary.recommendations.map(
                    (rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">
                        {rec}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <p>
                Analysis completed at{" "}
                {new Date(cloudVisionData.metadata.timestamp).toLocaleString()}
              </p>
              <p>
                Camera: {cloudVisionData.metadata.cameraId} | Processing time:{" "}
                {cloudVisionData.metadata.processingTimeMs}ms
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">
                  Overall Quality Score
                </span>
              </div>
              <Badge
                variant="outline"
                className={gradeColors[qualityData.quality_grade]}
              >
                Grade {qualityData.quality_grade}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                {qualityData.quality_scores.overall_score}%
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated:{" "}
                {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QualityMetricsCard
          title="Fineness"
          value={qualityData.predicted_fineness}
          unit="cm²/g"
          target={3500}
          trend="neutral"
        />
        <QualityMetricsCard
          title="Setting Time"
          value={qualityData.predicted_setting_time}
          unit="min"
          target={180}
          trend="up"
        />
        <QualityMetricsCard
          title="Compressive Strength"
          value={qualityData.predicted_strength}
          unit="MPa"
          target={42.5}
          trend="down"
        />
      </div>

      <Tabs defaultValue="corrections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="manual">Manual Adjustments</TabsTrigger>
          <TabsTrigger value="ai-engineer">AI Engineer</TabsTrigger>
          <TabsTrigger value="corrections">Correction Suggestions</TabsTrigger>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="preview">Impact Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="corrections" className="space-y-6">
          <CorrectionSuggestions
            corrections={qualityData.corrections}
            selectedCorrections={selectedCorrections}
            onSelectionChange={setSelectedCorrections}
          />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <ManualAdjustments
            qualityData={qualityData}
            onDataChange={setQualityData}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <ImpactPreview
            impact={qualityData.corrections.estimated_impact}
            selectedCorrections={selectedCorrections}
            previewMode={previewMode}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <QualityTrends />
        </TabsContent>

        <TabsContent value="ai-engineer" className="space-y-6">
          <AIQualityEngineer />
        </TabsContent>
      </Tabs>

      {/* Action Panel */}
      {selectedCorrections.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Ready to Apply Corrections</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCorrections.length} correction
                    {selectedCorrections.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handlePreviewCorrections}>
                  Preview Impact
                </Button>
                <Button onClick={handleApplyCorrections}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Apply Corrections
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
