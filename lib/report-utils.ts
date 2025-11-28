// Utility functions for report generation and PDF export

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

/**
 * Generate a formatted text version of the shift report
 */
export function generateReportText(
  report: ShiftReport,
  data: ShiftReportData
): string {
  let text = `AI PLANT MANAGER - SHIFT REPORT
==============================

`;

  // Executive Summary
  text += `EXECUTIVE SUMMARY
-----------------
`;
  report.executiveSummary.forEach((item, index) => {
    text += `${index + 1}. ${item}\n`;
  });
  text += `\n`;

  // Production Performance
  text += `PRODUCTION PERFORMANCE & EFFICIENCY
----------------------------------
Efficiency: ${report.productionPerformance.efficiency}%
${report.productionPerformance.summary}

Key Deviations:
`;
  report.productionPerformance.deviations.forEach((deviation, index) => {
    text += `  • ${deviation}\n`;
  });
  text += `\n`;

  // Raw Material Analysis
  text += `RAW MATERIAL CONSUMPTION ANALYSIS
-------------------------------
${report.rawMaterialAnalysis.summary}

Consumption:
`;
  Object.entries(report.rawMaterialAnalysis.consumption).forEach(
    ([material, amount]) => {
      text += `  • ${
        material.charAt(0).toUpperCase() + material.slice(1)
      }: ${amount} tons\n`;
    }
  );

  text += `\nIssues Identified:\n`;
  report.rawMaterialAnalysis.issues.forEach((issue, index) => {
    text += `  • ${issue}\n`;
  });
  text += `\n`;

  // Logistics Report
  text += `LOGISTICS MOVEMENT REPORT
------------------------
${report.logisticsReport.summary}

Metrics:
  • Trucks Dispatched: ${report.logisticsReport.dispatchCount}
  • Trucks Delayed: ${report.logisticsReport.delays}
  • Trucks Breakdown: ${data.logistics.trucksBreakdown}
  • Average ETA: ${data.logistics.avgETA}

Issues Identified:
`;
  report.logisticsReport.issues.forEach((issue, index) => {
    text += `  • ${issue}\n`;
  });
  text += `\n`;

  // Quality Performance
  text += `CEMENT QUALITY PERFORMANCE & DEVIATIONS
-------------------------------------
Quality Score: ${report.qualityPerformance.score}%
${report.qualityPerformance.summary}

Key Deviations:
`;
  report.qualityPerformance.deviations.forEach((deviation, index) => {
    text += `  • ${deviation}\n`;
  });
  text += `\n`;

  // Recommendations
  text += `RECOMMENDED IMPROVEMENTS FOR NEXT SHIFT
--------------------------------------
`;
  report.recommendations.forEach((recommendation, index) => {
    text += `${index + 1}. ${recommendation}\n`;
  });

  return text;
}

/**
 * Generate a simple HTML version of the shift report for PDF export
 */
export function generateReportHTML(
  report: ShiftReport,
  data: ShiftReportData
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>AI Plant Manager - Shift Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        h3 { color: #666; }
        .section { margin-bottom: 20px; }
        .metrics { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
        .metric-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; min-width: 150px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #333; }
        .metric-label { font-size: 14px; color: #666; }
        .efficiency-badge { 
          display: inline-block; 
          padding: 5px 10px; 
          border-radius: 20px; 
          font-weight: bold; 
          background-color: #4CAF50; 
          color: white; 
        }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .recommendation { margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <h1>AI Plant Manager - Shift Report</h1>
      
      <div class="section">
        <h2>Executive Summary</h2>
        <ul>
          ${report.executiveSummary.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      
      <div class="section">
        <h2>Production Performance & Efficiency</h2>
        <p><span class="efficiency-badge">${
          report.productionPerformance.efficiency
        }%</span></p>
        <p>${report.productionPerformance.summary}</p>
        <h3>Key Deviations:</h3>
        <ul>
          ${report.productionPerformance.deviations
            .map((deviation) => `<li>${deviation}</li>`)
            .join("")}
        </ul>
      </div>
      
      <div class="section">
        <h2>Raw Material Consumption Analysis</h2>
        <p>${report.rawMaterialAnalysis.summary}</p>
        
        <div class="metrics">
          ${Object.entries(report.rawMaterialAnalysis.consumption)
            .map(
              ([material, amount]) => `
            <div class="metric-card">
              <div class="metric-value">${amount}</div>
              <div class="metric-label">${
                material.charAt(0).toUpperCase() + material.slice(1)
              } (tons)</div>
            </div>
          `
            )
            .join("")}
        </div>
        
        <h3>Issues Identified:</h3>
        <ul>
          ${report.rawMaterialAnalysis.issues
            .map((issue) => `<li>${issue}</li>`)
            .join("")}
        </ul>
      </div>
      
      <div class="section">
        <h2>Logistics Movement Report</h2>
        <p>${report.logisticsReport.summary}</p>
        
        <div class="metrics">
          <div class="metric-card">
            <div class="metric-value">${
              report.logisticsReport.dispatchCount
            }</div>
            <div class="metric-label">Trucks Dispatched</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${report.logisticsReport.delays}</div>
            <div class="metric-label">Trucks Delayed</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.logistics.trucksBreakdown}</div>
            <div class="metric-label">Trucks Breakdown</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${data.logistics.avgETA}</div>
            <div class="metric-label">Average ETA</div>
          </div>
        </div>
        
        <h3>Issues Identified:</h3>
        <ul>
          ${report.logisticsReport.issues
            .map((issue) => `<li>${issue}</li>`)
            .join("")}
        </ul>
      </div>
      
      <div class="section">
        <h2>Cement Quality Performance & Deviations</h2>
        <p><span class="efficiency-badge">${
          report.qualityPerformance.score
        }%</span></p>
        <p>${report.qualityPerformance.summary}</p>
        <h3>Key Deviations:</h3>
        <ul>
          ${report.qualityPerformance.deviations
            .map((deviation) => `<li>${deviation}</li>`)
            .join("")}
        </ul>
      </div>
      
      <div class="section">
        <h2>Recommended Improvements for Next Shift</h2>
        <ol>
          ${report.recommendations
            .map(
              (recommendation, index) => `
            <li class="recommendation">${recommendation}</li>
          `
            )
            .join("")}
        </ol>
      </div>
    </body>
    </html>
  `;
}
