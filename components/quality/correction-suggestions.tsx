"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, Beaker, TrendingUp, TrendingDown } from "lucide-react"
import type { QualityPrediction } from "@/types/quality"

interface CorrectionSuggestionsProps {
  corrections: QualityPrediction["corrections"]
  selectedCorrections: string[]
  onSelectionChange: (selected: string[]) => void
}

export function CorrectionSuggestions({
  corrections,
  selectedCorrections,
  onSelectionChange,
}: CorrectionSuggestionsProps) {
  const handleCorrectionToggle = (correctionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCorrections, correctionId])
    } else {
      onSelectionChange(selectedCorrections.filter((id) => id !== correctionId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Process Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Process Parameter Adjustments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {corrections.process_adjustments.map((adjustment, index) => {
            const correctionId = `process-${index}`
            const isSelected = selectedCorrections.includes(correctionId)
            const AdjustmentIcon = adjustment.adjustment_type === "increase" ? TrendingUp : TrendingDown

            return (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleCorrectionToggle(correctionId, checked as boolean)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{adjustment.parameter}</h4>
                    <Badge variant="outline" className="text-xs">
                      {(adjustment.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{adjustment.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <p className="font-medium">{adjustment.current_value}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested:</span>
                      <p className="font-medium">{adjustment.suggested_value}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Change:</span>
                      <div className="flex items-center space-x-1">
                        <AdjustmentIcon className="h-4 w-4" />
                        <span className="font-medium">
                          {Math.abs(adjustment.suggested_value - adjustment.current_value).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Material Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Beaker className="h-5 w-5" />
            <span>Material Composition Adjustments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {corrections.material_adjustments.map((adjustment, index) => {
            const correctionId = `material-${index}`
            const isSelected = selectedCorrections.includes(correctionId)
            const AdjustmentIcon = adjustment.adjustment_type === "increase" ? TrendingUp : TrendingDown

            return (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleCorrectionToggle(correctionId, checked as boolean)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{adjustment.material}</h4>
                    <Badge variant="outline" className="text-xs">
                      {(adjustment.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{adjustment.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <p className="font-medium">{adjustment.current_percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested:</span>
                      <p className="font-medium">{adjustment.suggested_percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Change:</span>
                      <div className="flex items-center space-x-1">
                        <AdjustmentIcon className="h-4 w-4" />
                        <span className="font-medium">
                          {Math.abs(adjustment.suggested_percentage - adjustment.current_percentage).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
