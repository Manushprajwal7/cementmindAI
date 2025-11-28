"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Thermometer,
  Scale,
} from "lucide-react";

interface QualityInput {
  // Chemical composition percentages
  lime: number; // CaO
  silica: number; // SiO2
  alumina: number; // Al2O3
  iron: number; // Fe2O3
  gypsum: number;
  flyAsh: number;
  limestone: number;
  residue: number;
  loi: number; // Loss on Ignition

  // Physical properties
  blaineFineness: number;
  soundness: number;
  compressiveStrength: number;

  // Process parameters
  kilnTemp: number;
  millTemp: number;
}

interface QualityDeviation {
  identification: string;
  rootCause: string;
  correctiveAction: string;
  operationalModifications: string;
  expectedImprovement: string;
}

export function AIQualityEngineer() {
  const [inputData, setInputData] = useState<Partial<QualityInput>>({
    lime: 65.2,
    silica: 21.8,
    alumina: 4.2,
    iron: 3.1,
    gypsum: 4.8,
    flyAsh: 8.5,
    limestone: 82.3,
    residue: 1.2,
    loi: 2.8,
    blaineFineness: 3200,
    soundness: 12.5,
    compressiveStrength: 41.2,
    kilnTemp: 1450,
    millTemp: 95,
  });

  const [deviation, setDeviation] = useState<QualityDeviation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof QualityInput, value: string) => {
    const numValue = parseFloat(value);
    setInputData((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? "" : numValue,
    }));
  };

  const generateAIPrompt = (data: Partial<QualityInput>): string => {
    return `You are an expert Cement Quality Control Engineer AI.

GOAL:
When input quality parameters deviate from IS standards, 
you must generate correction steps, and material feed adjustments.

Input Data:
Chemical Composition (%):
- Lime (CaO): ${data.lime || "N/A"}
- Silica (SiO2): ${data.silica || "N/A"}
- Alumina (Al2O3): ${data.alumina || "N/A"}
- Iron (Fe2O3): ${data.iron || "N/A"}
- Gypsum: ${data.gypsum || "N/A"}
- Fly Ash: ${data.flyAsh || "N/A"}
- Limestone: ${data.limestone || "N/A"}
- Residue: ${data.residue || "N/A"}
- LOI: ${data.loi || "N/A"}

Physical Properties:
- Blaine Fineness: ${data.blaineFineness || "N/A"} cm²/g
- Soundness: ${data.soundness || "N/A"} mm
- Compressive Strength: ${data.compressiveStrength || "N/A"} MPa

Process Parameters:
- Kiln Temperature: ${data.kilnTemp || "N/A"} °C
- Mill Temperature: ${data.millTemp || "N/A"} °C

Output Format Required:
1. Identify quality deviation (1-2 sentences)
2. Root Cause Explanation
3. Corrective Action (raw material feed increase/decrease in %)
4. Operational modifications (temperature, feed rate, grinding pressure)
5. Final expected improvement after correction

Example output:
"Low CaO detected (↓2.3% below threshold). Increase limestone feed by 1.8% and reduce fly ash by 1.2%. Expected return to quality range in 25-40 mins."

Keep tone concise, actionable, plant-operator friendly. Respond only with the formatted output as shown in the example.`;
  };

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          system:
            "You are an expert Cement Quality Control Engineer AI specializing in IS standard compliance and cement quality optimization.",
          model: "gemini-2.5-flash",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API request failed: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      return data.text || "No response generated.";
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      throw new Error(
        `Failed to generate quality correction: ${error.message}`
      );
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setShowBanner(true);
    setError(null);
    setDeviation(null);

    try {
      // Validate required fields
      const missingFields = [];
      const requiredFields: (keyof QualityInput)[] = [
        "lime",
        "silica",
        "alumina",
        "iron",
        "gypsum",
        "flyAsh",
        "limestone",
        "residue",
        "loi",
        "blaineFineness",
        "soundness",
        "compressiveStrength",
        "kilnTemp",
        "millTemp",
      ];

      for (const field of requiredFields) {
        const value = inputData[field];
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value === "")
        ) {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Generate prompt and call AI
      const prompt = generateAIPrompt(inputData as QualityInput);
      const aiResponse = await callGeminiAPI(prompt);

      // Parse the AI response
      const parsedDeviation = parseAIResponse(aiResponse);
      setDeviation(parsedDeviation);
    } catch (err: any) {
      setError(err.message || "Failed to analyze quality data");
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowBanner(false), 3000); // Hide banner after 3 seconds
    }
  };

  const parseAIResponse = (response: string): QualityDeviation => {
    // This is a simplified parser - in a real implementation, you might want to use a more robust parsing approach
    const lines = response.split("\n").filter((line) => line.trim() !== "");

    return {
      identification: lines[0] || "Quality deviation identified",
      rootCause: lines[1] || "Root cause analysis pending",
      correctiveAction: lines[2] || "Corrective action recommendation pending",
      operationalModifications: lines[3] || "Operational modifications pending",
      expectedImprovement: lines[4] || "Expected improvement pending",
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Quality Control Engineer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Analyze quality parameters and get automated correction suggestions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Banner Popup */}
        <Dialog open={showBanner} onOpenChange={setShowBanner}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Quality
              </DialogTitle>
              <DialogDescription>
                Using Google Gemini AI to analyze cement quality parameters
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              <p>Processing quality data with AI...</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analyze Button - Moved to Top Center */}
        <div className="flex justify-center py-4">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            size="lg"
            className="px-8 py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Quality
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chemical Composition */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Chemical Composition (%)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">
                  Lime (CaO)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.lime || ""}
                  onChange={(e) => handleInputChange("lime", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Silica (SiO2)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.silica || ""}
                  onChange={(e) => handleInputChange("silica", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Alumina (Al2O3)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.alumina || ""}
                  onChange={(e) => handleInputChange("alumina", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Iron (Fe2O3)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.iron || ""}
                  onChange={(e) => handleInputChange("iron", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Gypsum</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.gypsum || ""}
                  onChange={(e) => handleInputChange("gypsum", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Fly Ash</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.flyAsh || ""}
                  onChange={(e) => handleInputChange("flyAsh", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Limestone
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.limestone || ""}
                  onChange={(e) =>
                    handleInputChange("limestone", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Residue</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.residue || ""}
                  onChange={(e) => handleInputChange("residue", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground">
                  LOI (Loss on Ignition)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.loi || ""}
                  onChange={(e) => handleInputChange("loi", e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className="space-y-2">
            <h3 className="font-semibold">Physical Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Blaine Fineness (cm²/g)
                </label>
                <input
                  type="number"
                  step="10"
                  value={inputData.blaineFineness || ""}
                  onChange={(e) =>
                    handleInputChange("blaineFineness", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Soundness (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.soundness || ""}
                  onChange={(e) =>
                    handleInputChange("soundness", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Compressive Strength (MPa)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputData.compressiveStrength || ""}
                  onChange={(e) =>
                    handleInputChange("compressiveStrength", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Process Parameters */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Process Parameters
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Kiln Temperature (°C)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputData.kilnTemp || ""}
                  onChange={(e) =>
                    handleInputChange("kilnTemp", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Mill Temperature (°C)
                </label>
                <input
                  type="number"
                  step="1"
                  value={inputData.millTemp || ""}
                  onChange={(e) =>
                    handleInputChange("millTemp", e.target.value)
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {deviation && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Quality Correction Recommendations
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  1. Quality Deviation
                </h4>
                <p className="text-sm">{deviation.identification}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  2. Root Cause
                </h4>
                <p className="text-sm">{deviation.rootCause}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  3. Corrective Action
                </h4>
                <p className="text-sm">{deviation.correctiveAction}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  4. Operational Modifications
                </h4>
                <p className="text-sm">{deviation.operationalModifications}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  5. Expected Improvement
                </h4>
                <p className="text-sm">{deviation.expectedImprovement}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                AI-Generated Recommendation
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
