export interface QualityPrediction {
  predicted_fineness: number;
  predicted_setting_time: number;
  predicted_strength: number;
  quality_scores: {
    fineness_score: number;
    setting_score: number;
    strength_score: number;
    overall_score: number;
  };
  quality_grade: "A" | "B" | "C" | "D";
  corrections: {
    process_adjustments: ProcessAdjustment[];
    material_adjustments: MaterialAdjustment[];
    estimated_impact: EstimatedImpact;
  };
}

export interface ProcessAdjustment {
  parameter: string;
  current_value: number;
  suggested_value: number;
  adjustment_type: "increase" | "decrease" | "maintain";
  confidence: number;
  description: string;
}

export interface MaterialAdjustment {
  material: string;
  current_percentage: number;
  suggested_percentage: number;
  adjustment_type: "increase" | "decrease" | "maintain";
  confidence: number;
  description: string;
}

export interface EstimatedImpact {
  quality_improvement: number;
  cost_impact: number;
  time_to_effect: number;
  risk_level: "low" | "medium" | "high";
  expected_outcomes: string[];
}

// Shift Report Interfaces
export interface ShiftReportData {
  // Raw material intake values
  rawMaterials: {
    limestone: number;
    flyAsh: number;
    gypsum: number;
    coal: number;
    [key: string]: number;
  };

  // Cement production metrics
  productionMetrics: {
    blaineFineness: number;
    qualityScore: number;
    composition: {
      limestone: number;
      clay: number;
      gypsum: number;
      additives: number;
    };
  };

  // Logistics data
  logistics: {
    trucksDispatched: number;
    trucksDelayed: number;
    trucksBreakdown: number;
    unloadingIssues: number;
    avgETA: string;
  };

  // Energy consumption
  energy: {
    kWhPerTon: number;
    fuelInput: number;
    efficiency: number;
  };

  // Incidents and alerts
  incidents: {
    total: number;
    critical: number;
    downtime: number; // in minutes
    alerts: string[];
  };
}

export interface ShiftReport {
  executiveSummary: string[];
  productionPerformance: {
    summary: string;
    efficiency: number;
    deviations: string[];
  };
  rawMaterialAnalysis: {
    summary: string;
    consumption: Record<string, number>;
    issues: string[];
  };
  logisticsReport: {
    summary: string;
    dispatchCount: number;
    delays: number;
    issues: string[];
  };
  qualityPerformance: {
    summary: string;
    score: number;
    deviations: string[];
  };
  recommendations: string[];
}
