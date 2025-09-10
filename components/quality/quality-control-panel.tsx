"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { QualityMetricsCard } from "./quality-metrics-card"
import { CorrectionSuggestions } from "./correction-suggestions"
import { ManualAdjustments } from "./manual-adjustments"
import { ImpactPreview } from "./impact-preview"
import { QualityTrends } from "./quality-trends"
import type { QualityPrediction } from "@/types/quality"

// Mock quality prediction data
const generateMockQualityData = (): QualityPrediction => ({
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
        description: "Increase mill speed for better particle size distribution",
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
})

export function QualityControlPanel() {
  const [qualityData, setQualityData] = useState<QualityPrediction>(generateMockQualityData())
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const refreshData = () => {
    setQualityData(generateMockQualityData())
    setLastUpdate(new Date())
  }

  const handleApplyCorrections = () => {
    // Implementation for applying corrections
    console.log("Applying corrections:", selectedCorrections)
    setPreviewMode(false)
    setSelectedCorrections([])
    refreshData()
  }

  const handlePreviewCorrections = () => {
    setPreviewMode(true)
  }

  const gradeColors = {
    A: "bg-green-100 text-green-800 border-green-200",
    B: "bg-blue-100 text-blue-800 border-blue-200",
    C: "bg-amber-100 text-amber-800 border-amber-200",
    D: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Quality Control Panel</h2>
          <p className="text-muted-foreground">Monitor and optimize cement quality parameters</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Predictions</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quality Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">Overall Quality Score</span>
              </div>
              <Badge variant="outline" className={gradeColors[qualityData.quality_grade]}>
                Grade {qualityData.quality_grade}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{qualityData.quality_scores.overall_score}%</div>
              <div className="text-sm text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
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
          score={qualityData.quality_scores.fineness_score}
          target={3500}
          trend="stable"
        />
        <QualityMetricsCard
          title="Setting Time"
          value={qualityData.predicted_setting_time}
          unit="min"
          score={qualityData.quality_scores.setting_score}
          target={180}
          trend="improving"
        />
        <QualityMetricsCard
          title="Compressive Strength"
          value={qualityData.predicted_strength}
          unit="MPa"
          score={qualityData.quality_scores.strength_score}
          target={42.5}
          trend="declining"
        />
      </div>

      <Tabs defaultValue="corrections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="corrections">Correction Suggestions</TabsTrigger>
          <TabsTrigger value="manual">Manual Adjustments</TabsTrigger>
          <TabsTrigger value="preview">Impact Preview</TabsTrigger>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="corrections" className="space-y-6">
          <CorrectionSuggestions
            corrections={qualityData.corrections}
            selectedCorrections={selectedCorrections}
            onSelectionChange={setSelectedCorrections}
          />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <ManualAdjustments qualityData={qualityData} onDataChange={setQualityData} />
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
                    {selectedCorrections.length} correction{selectedCorrections.length > 1 ? "s" : ""} selected
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
  )
}
