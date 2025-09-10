export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: "production" | "quality" | "logistics" | "maintenance"
  lastGenerated?: Date
  frequency: "daily" | "weekly" | "monthly" | "custom"
  format: "pdf" | "excel" | "csv"
}

export interface ExportOptions {
  format: "pdf" | "excel" | "csv"
  dateRange: {
    start: Date
    end: Date
  }
  includeCharts: boolean
  includeRawData: boolean
  sections: string[]
}

export interface GeneratedReport {
  id: string
  templateId: string
  name: string
  generatedAt: Date
  size: string
  downloadUrl: string
  status: "generating" | "ready" | "failed"
}
