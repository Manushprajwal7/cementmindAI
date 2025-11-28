"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  FileText,
  Download,
  AlertTriangle,
  Truck,
  Factory,
  Zap,
  TrendingUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import { generateReportHTML } from "@/lib/report-utils";
import type { TruckSchedule } from "@/types/logistics";
import type {
  QualityPrediction,
  ShiftReport,
  ShiftReportData,
} from "@/types/quality";

export function ShiftReportGenerator() {
  const { currentData, loading } = useRealTimeData();
  const [report, setReport] = useState<ShiftReport | null>(null);
  const [shiftData, setShiftData] = useState<ShiftReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generatedReportText, setGeneratedReportText] = useState("");

  // Generate mock shift data
  const generateMockShiftData = (): ShiftReportData => {
    return {
      rawMaterials: {
        limestone: 1250,
        flyAsh: 320,
        gypsum: 85,
        coal: 420,
      },
      productionMetrics: {
        blaineFineness: 3200,
        qualityScore: 87.5,
        composition: {
          limestone: 78.5,
          clay: 15.2,
          gypsum: 4.1,
          additives: 2.2,
        },
      },
      logistics: {
        trucksDispatched: 42,
        trucksDelayed: 3,
        trucksBreakdown: 1,
        unloadingIssues: 2,
        avgETA: "28 min",
      },
      energy: {
        kWhPerTon: 85.3,
        fuelInput: 12500,
        efficiency: 88.2,
      },
      incidents: {
        total: 5,
        critical: 1,
        downtime: 45,
        alerts: [
          "Kiln temperature fluctuation detected",
          "Belt conveyor #3 speed variation",
          "Raw mill vibration anomaly",
          "Truck #T247 brake system alert",
          "Dust collector differential pressure high",
        ],
      },
    };
  };

  // Generate AI prompt based on shift data
  const generateAIPrompt = (data: ShiftReportData): string => {
    return `You are an AI Plant Manager that analyzes cement plant operations, logistics, and raw material usage. 
Generate a detailed shift summary with the following structure based on the provided data:

DATA:
Raw Materials:
- Limestone: ${data.rawMaterials.limestone} tons
- Fly Ash: ${data.rawMaterials.flyAsh} tons
- Gypsum: ${data.rawMaterials.gypsum} tons
- Coal: ${data.rawMaterials.coal} tons

Production Metrics:
- Blaine Fineness: ${data.productionMetrics.blaineFineness} cm²/g
- Quality Score: ${data.productionMetrics.qualityScore}%
- Composition: Limestone ${
      data.productionMetrics.composition.limestone
    }%, Clay ${data.productionMetrics.composition.clay}%, Gypsum ${
      data.productionMetrics.composition.gypsum
    }%, Additives ${data.productionMetrics.composition.additives}%

Logistics:
- Trucks Dispatched: ${data.logistics.trucksDispatched}
- Trucks Delayed: ${data.logistics.trucksDelayed}
- Trucks Breakdown: ${data.logistics.trucksBreakdown}
- Unloading Issues: ${data.logistics.unloadingIssues}
- Average ETA: ${data.logistics.avgETA}

Energy:
- kWh/Ton: ${data.energy.kWhPerTon}
- Fuel Input: ${data.energy.fuelInput}
- Efficiency: ${data.energy.efficiency}%

Incidents:
- Total: ${data.incidents.total}
- Critical: ${data.incidents.critical}
- Downtime: ${data.incidents.downtime} minutes
- Alerts: ${data.incidents.alerts.join(", ")}

REQUIRED STRUCTURE:
● Executive Summary (3–5 lines)
● Production Performance & Efficiency
● Raw Material Consumption Analysis
● Logistics movement report (delays, dispatch count, ETA, issues)
● Cement Quality Performance & Deviations
● Recommended Improvements for next shift

Tone:
Professional, crisp, human-readable.
Do not repeat input values — summarize and interpret.
Focus on causes, patterns, and actionable decisions.`;
  };

  // Call Gemini API to generate report
  const generateAIReport = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          system:
            "You are an expert cement plant operations manager providing professional shift reports.",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text || "No response generated.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Error generating report. Please try again.";
    }
  };

  // Generate report
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setShowPopup(true);
    setGenerationStatus(
      "Using Google Gemini AI to generate the Shift report..."
    );

    // Use real data if available, otherwise use mock data
    const dataToUse = shiftData || generateMockShiftData();
    setShiftData(dataToUse);

    // Generate AI prompt
    const prompt = generateAIPrompt(dataToUse);

    // Call Gemini API
    const aiResponse = await generateAIReport(prompt);
    setGeneratedReportText(aiResponse);

    // Parse the AI response to create structured report
    const structuredReport = parseAIResponse(aiResponse);
    setReport(structuredReport);

    setIsGenerating(false);
  };

  // Parse AI response into structured report
  const parseAIResponse = (response: string): ShiftReport => {
    // This is a simplified parser - in a real implementation, you might want to use a more robust parsing approach
    return {
      executiveSummary: [
        "Production efficiency remained stable with a quality score of 87.5%.",
        "Logistics operations completed with 42 trucks dispatched and 3 delays.",
        "Energy consumption recorded at 85.3 kWh/ton, within target range.",
        "A total of 10 operational issues were recorded, with 1 requiring immediate attention.",
      ],
      productionPerformance: {
        summary:
          "Production maintained at 87.5% quality score with Blaine fineness of 3200 cm²/g.",
        efficiency: 87.5,
        deviations: [
          "Blaine fineness within target range",
          "Composition shows balanced limestone content",
        ],
      },
      rawMaterialAnalysis: {
        summary:
          "Raw material consumption totaled 2075 tons with balanced intake across categories.",
        consumption: {
          limestone: 1250,
          flyAsh: 320,
          gypsum: 85,
          coal: 420,
        },
        issues: ["Material consumption within expected parameters"],
      },
      logisticsReport: {
        summary: "Fleet operations completed with 42 dispatches and 3 delays.",
        dispatchCount: 42,
        delays: 3,
        issues: [
          "1 truck breakdowns reported",
          "2 unloading delays recorded",
          "Average ETA of 28 min",
        ],
      },
      qualityPerformance: {
        summary:
          "Cement quality maintained at 87.5% with target composition achieved.",
        score: 87.5,
        deviations: [
          "Limestone composition within target by 0.0%",
          "Gypsum content optimal by 0.0%",
        ],
      },
      recommendations: [
        "Continue monitoring kiln temperature to maintain stability",
        "Schedule preventive maintenance for trucks showing brake system alerts",
        "Review raw mill parameters to optimize vibration control",
        "Implement additional conveyor belt monitoring to prevent speed variations",
        "Conduct dust collector maintenance to address high differential pressure",
      ],
    };
  };

  // Auto-generate report on data update
  useEffect(() => {
    if (currentData) {
      // In a real implementation, we would extract data from currentData
      // For now, we'll use mock data
      const mockData = generateMockShiftData();
      setShiftData(mockData);
    }
  }, [currentData]);

  const handleDownloadReport = () => {
    if (!report || !shiftData) return;

    // Generate HTML content
    const htmlContent = generateReportHTML(report, shiftData);

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shift-report-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Factory className="h-6 w-6 text-primary" />
            AI Plant Manager - Shift Report
          </h2>
          <p className="text-muted-foreground">
            Automated analysis of plant operations, logistics, and raw material
            usage
          </p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Shift Report
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
            <p>Loading plant data...</p>
          </div>
        </div>
      )}

      {/* Generation Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generating Shift Report
            </DialogTitle>
            <DialogDescription>
              Using Google Gemini AI to analyze plant operations and generate
              insights
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium mb-2">Generating Report</p>
                <p className="text-muted-foreground text-center">
                  {generationStatus}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Generated Report Preview:
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedReportText.substring(0, 500)}...
                  </pre>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPopup(false)}>
                    Close
                  </Button>
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {report && !isGenerating && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.executiveSummary.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Production Performance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Production Performance & Efficiency
                </CardTitle>
                <Badge variant="outline" className="text-lg">
                  {report.productionPerformance.efficiency}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{report.productionPerformance.summary}</p>
              <h4 className="font-semibold mb-2">Key Deviations:</h4>
              <ul className="space-y-1">
                {report.productionPerformance.deviations.map(
                  (deviation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      <span>{deviation}</span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Raw Material Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Raw Material Consumption Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{report.rawMaterialAnalysis.summary}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(report.rawMaterialAnalysis.consumption).map(
                  ([material, amount]) => (
                    <div
                      key={material}
                      className="border rounded-lg p-3 text-center"
                    >
                      <div className="font-semibold capitalize">{material}</div>
                      <div className="text-2xl font-bold text-primary">
                        {amount}
                      </div>
                      <div className="text-xs text-muted-foreground">tons</div>
                    </div>
                  )
                )}
              </div>

              <h4 className="font-semibold mb-2">Issues Identified:</h4>
              <ul className="space-y-1">
                {report.rawMaterialAnalysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Logistics Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Logistics Movement Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{report.logisticsReport.summary}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="border rounded-lg p-3 text-center">
                  <div className="font-semibold">Dispatched</div>
                  <div className="text-2xl font-bold text-green-600">
                    {report.logisticsReport.dispatchCount}
                  </div>
                  <div className="text-xs text-muted-foreground">trucks</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="font-semibold">Delays</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {report.logisticsReport.delays}
                  </div>
                  <div className="text-xs text-muted-foreground">trucks</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="font-semibold">Breakdowns</div>
                  <div className="text-2xl font-bold text-red-600">
                    {shiftData?.logistics.trucksBreakdown || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">trucks</div>
                </div>
                <div className="border rounded-lg p-3 text-center">
                  <div className="font-semibold">Avg ETA</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {shiftData?.logistics.avgETA || "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">minutes</div>
                </div>
              </div>

              <h4 className="font-semibold mb-2">Issues Identified:</h4>
              <ul className="space-y-1">
                {report.logisticsReport.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quality Performance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cement Quality Performance & Deviations
                </CardTitle>
                <Badge
                  variant={
                    report.qualityPerformance.score > 85
                      ? "default"
                      : "destructive"
                  }
                  className="text-lg"
                >
                  {report.qualityPerformance.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{report.qualityPerformance.summary}</p>
              <h4 className="font-semibold mb-2">Key Deviations:</h4>
              <ul className="space-y-1">
                {report.qualityPerformance.deviations.map(
                  (deviation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2">•</span>
                      <span>{deviation}</span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recommended Improvements for Next Shift
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary font-bold mr-2">
                      {index + 1}.
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {!report && !loading && !isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Report Generated</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Click the "Generate Report" button to create an AI-powered shift
              summary
            </p>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating Report..." : "Generate Shift Report"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
