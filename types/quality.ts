export interface QualityPrediction {
  predicted_fineness: number
  predicted_setting_time: number
  predicted_strength: number
  quality_scores: {
    fineness_score: number
    setting_score: number
    strength_score: number
    overall_score: number
  }
  quality_grade: "A" | "B" | "C" | "D"
  corrections: {
    process_adjustments: ProcessAdjustment[]
    material_adjustments: MaterialAdjustment[]
    estimated_impact: EstimatedImpact
  }
}

export interface ProcessAdjustment {
  parameter: string
  current_value: number
  suggested_value: number
  adjustment_type: "increase" | "decrease" | "maintain"
  confidence: number
  description: string
}

export interface MaterialAdjustment {
  material: string
  current_percentage: number
  suggested_percentage: number
  adjustment_type: "increase" | "decrease" | "maintain"
  confidence: number
  description: string
}

export interface EstimatedImpact {
  quality_improvement: number
  cost_impact: number
  time_to_effect: number
  risk_level: "low" | "medium" | "high"
  expected_outcomes: string[]
}
