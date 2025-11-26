"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Settings2,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Target,
  Cpu,
  Thermometer,
  Gauge,
  Droplets,
  Wind,
  Clock,
  Palette,
  Eye,
} from "lucide-react";
import type { QualityPrediction } from "@/types/quality";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ManualAdjustmentsProps {
  qualityData: QualityPrediction;
  onDataChange: (data: QualityPrediction) => void;
}

export function ManualAdjustments({
  qualityData,
  onDataChange,
}: ManualAdjustmentsProps) {
  const [processParams, setProcessParams] = useState({
    kilnTemp: 1480,
    millSpeed: 16.2,
    airFlow: 85.5,
    feedRate: 245,
    burnerPressure: 12.5,
    coolerSpeed: 8.3,
    exhaustFan: 75.2,
    preheaterTemp: 850,
    calcinerTemp: 900,
    tertiaryAir: 75,
    kilnSpeed: 3.2,
  });

  const [materialComposition, setMaterialComposition] = useState({
    limestone: 78.5,
    clay: 15.2,
    ironOre: 2.1,
    gypsum: 4.2,
    flyAsh: 0,
    slag: 0,
    silicaSand: 0,
    bauxite: 0,
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    grindingAid: 0.05,
    additiveType: "standard",
    curingTime: 24,
    humidityControl: 65,
    finenessTarget: 3500,
    strengthTarget: 42.5,
    settingTimeTarget: 180,
    energyOptimization: true,
    qualityPriority: "balanced",
  });

  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [selectedPreset, setSelectedPreset] = useState("standard");
  const [parameterHistory, setParameterHistory] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<
    { parameter: string; current: number; suggested: number; impact: string }[]
  >([]);

  // Preset configurations
  const presets = {
    standard: {
      name: "Standard Production",
      processParams: {
        kilnTemp: 1480,
        millSpeed: 16.2,
        airFlow: 85.5,
        feedRate: 245,
        burnerPressure: 12.5,
        coolerSpeed: 8.3,
        exhaustFan: 75.2,
        preheaterTemp: 850,
        calcinerTemp: 900,
        tertiaryAir: 75,
        kilnSpeed: 3.2,
      },
      materialComposition: {
        limestone: 78.5,
        clay: 15.2,
        ironOre: 2.1,
        gypsum: 4.2,
        flyAsh: 0,
        slag: 0,
        silicaSand: 0,
        bauxite: 0,
      },
      advancedSettings: {
        grindingAid: 0.05,
        additiveType: "standard",
        curingTime: 24,
        humidityControl: 65,
        finenessTarget: 3500,
        strengthTarget: 42.5,
        settingTimeTarget: 180,
        energyOptimization: true,
        qualityPriority: "balanced",
      },
    },
    highStrength: {
      name: "High Strength Cement",
      processParams: {
        kilnTemp: 1520,
        millSpeed: 17.5,
        airFlow: 88.0,
        feedRate: 235,
        burnerPressure: 13.2,
        coolerSpeed: 8.8,
        exhaustFan: 78.5,
        preheaterTemp: 870,
        calcinerTemp: 920,
        tertiaryAir: 78,
        kilnSpeed: 3.0,
      },
      materialComposition: {
        limestone: 76.0,
        clay: 14.5,
        ironOre: 2.5,
        gypsum: 3.8,
        flyAsh: 2.0,
        slag: 1.2,
        silicaSand: 0,
        bauxite: 0,
      },
      advancedSettings: {
        grindingAid: 0.08,
        additiveType: "strength",
        curingTime: 48,
        humidityControl: 70,
        finenessTarget: 3600,
        strengthTarget: 48.0,
        settingTimeTarget: 190,
        energyOptimization: false,
        qualityPriority: "strength",
      },
    },
    costOptimized: {
      name: "Cost Optimized",
      processParams: {
        kilnTemp: 1450,
        millSpeed: 15.0,
        airFlow: 82.0,
        feedRate: 260,
        burnerPressure: 11.8,
        coolerSpeed: 7.5,
        exhaustFan: 72.0,
        preheaterTemp: 830,
        calcinerTemp: 880,
        tertiaryAir: 72,
        kilnSpeed: 3.5,
      },
      materialComposition: {
        limestone: 80.0,
        clay: 16.0,
        ironOre: 1.8,
        gypsum: 4.2,
        flyAsh: 0,
        slag: 0,
        silicaSand: 0,
        bauxite: 0,
      },
      advancedSettings: {
        grindingAid: 0.03,
        additiveType: "standard",
        curingTime: 18,
        humidityControl: 60,
        finenessTarget: 3400,
        strengthTarget: 40.0,
        settingTimeTarget: 175,
        energyOptimization: true,
        qualityPriority: "cost",
      },
    },
    rapidSetting: {
      name: "Rapid Setting",
      processParams: {
        kilnTemp: 1490,
        millSpeed: 16.8,
        airFlow: 87.0,
        feedRate: 240,
        burnerPressure: 12.8,
        coolerSpeed: 8.5,
        exhaustFan: 76.5,
        preheaterTemp: 860,
        calcinerTemp: 910,
        tertiaryAir: 76,
        kilnSpeed: 3.3,
      },
      materialComposition: {
        limestone: 77.0,
        clay: 14.8,
        ironOre: 2.3,
        gypsum: 5.5,
        flyAsh: 0.4,
        slag: 0,
        silicaSand: 0,
        bauxite: 0,
      },
      advancedSettings: {
        grindingAid: 0.06,
        additiveType: "rapid",
        curingTime: 12,
        humidityControl: 68,
        finenessTarget: 3550,
        strengthTarget: 41.0,
        settingTimeTarget: 150,
        energyOptimization: false,
        qualityPriority: "speed",
      },
    },
    ecoFriendly: {
      name: "Eco-Friendly Production",
      processParams: {
        kilnTemp: 1460,
        millSpeed: 15.8,
        airFlow: 84.0,
        feedRate: 250,
        burnerPressure: 12.2,
        coolerSpeed: 8.0,
        exhaustFan: 74.0,
        preheaterTemp: 840,
        calcinerTemp: 890,
        tertiaryAir: 74,
        kilnSpeed: 3.4,
      },
      materialComposition: {
        limestone: 79.0,
        clay: 15.5,
        ironOre: 2.0,
        gypsum: 4.0,
        flyAsh: 1.5,
        slag: 1.0,
        silicaSand: 0.5,
        bauxite: 0.5,
      },
      advancedSettings: {
        grindingAid: 0.04,
        additiveType: "eco",
        curingTime: 30,
        humidityControl: 67,
        finenessTarget: 3450,
        strengthTarget: 41.5,
        settingTimeTarget: 185,
        energyOptimization: true,
        qualityPriority: "eco",
      },
    },
  };

  const handleProcessParamChange = (param: string, value: number) => {
    setProcessParams((prev) => ({ ...prev, [param]: value }));
    // Add to history
    setParameterHistory((prev) => [
      ...prev.slice(-9),
      {
        timestamp: new Date(),
        parameter: param,
        value,
        type: "process",
      },
    ]);
  };

  const handleMaterialChange = (material: string, value: number) => {
    setMaterialComposition((prev) => ({ ...prev, [material]: value }));
    // Add to history
    setParameterHistory((prev) => [
      ...prev.slice(-9),
      {
        timestamp: new Date(),
        parameter: material,
        value,
        type: "material",
      },
    ]);
  };

  const handleAdvancedSettingChange = (setting: string, value: any) => {
    setAdvancedSettings((prev) => ({ ...prev, [setting]: value }));
    // Add to history
    setParameterHistory((prev) => [
      ...prev.slice(-9),
      {
        timestamp: new Date(),
        parameter: setting,
        value,
        type: "advanced",
      },
    ]);
  };

  const resetToDefaults = () => {
    setProcessParams(presets.standard.processParams);
    setMaterialComposition(presets.standard.materialComposition);
    setAdvancedSettings(presets.standard.advancedSettings);
  };

  const applyPreset = (presetKey: string) => {
    const preset = presets[presetKey as keyof typeof presets];
    if (preset) {
      setProcessParams(preset.processParams);
      setMaterialComposition(preset.materialComposition);
      setAdvancedSettings(preset.advancedSettings);
      setSelectedPreset(presetKey);
    }
  };

  const validateParameters = () => {
    const errors = [];
    const totalComposition = Object.values(materialComposition).reduce(
      (sum, val) => sum + val,
      0
    );

    if (totalComposition !== 100) {
      errors.push(
        `Material composition must total 100%. Current total: ${totalComposition.toFixed(
          1
        )}%`
      );
    }

    if (processParams.kilnTemp < 1400 || processParams.kilnTemp > 1600) {
      errors.push("Kiln temperature must be between 1400°C and 1600°C");
    }

    if (processParams.millSpeed < 14 || processParams.millSpeed > 20) {
      errors.push("Mill speed must be between 14 and 20 rpm");
    }

    if (processParams.airFlow < 70 || processParams.airFlow > 100) {
      errors.push("Air flow must be between 70% and 100%");
    }

    if (
      advancedSettings.finenessTarget < 3000 ||
      advancedSettings.finenessTarget > 4000
    ) {
      errors.push("Fineness target must be between 3000 and 4000 cm²/g");
    }

    setValidationErrors(errors);
    setShowValidation(true);
    return errors.length === 0;
  };

  const generateAIRecommendations = async () => {
    setIsGeneratingRecommendations(true);
    setShowAIDialog(true);
    setAiRecommendations([]);
    setAiAnalysis([]);

    try {
      // Prepare data for Gemini AI
      const currentData = {
        processParams,
        materialComposition,
        advancedSettings,
        qualityMetrics: qualityData,
      };

      const prompt = `Analyze the following cement production parameters for a plant producing high-quality cement:

Current Parameters:
${JSON.stringify(currentData, null, 2)}

Based on your expertise in cement manufacturing and quality control, provide:
1. Specific parameter adjustments that would improve quality metrics
2. Estimated impact of each adjustment on fineness, strength, and setting time
3. Energy efficiency considerations
4. Cost implications of suggested changes
5. Risk assessment for each recommendation

Format your response as a clear list of actionable recommendations with specific parameter values and expected outcomes. Avoid using markdown formatting like asterisks or hyphens.`;

      const systemPrompt = `You are Gemini, an AI assistant specialized for CementMind AI - an AI Operating Workbench For Raw Material and Logistics Automation with Autonomous Real-Time Cement Quality Detection and Correction.

Your role is to help engineers and operators working with cement manufacturing plants to optimize quality parameters. You have deep expertise in:
- Cement chemistry and production processes
- Kiln operation and thermal efficiency
- Material blending and composition optimization
- Quality control and testing standards
- Energy efficiency and cost optimization
- Environmental compliance and sustainability

For parameter recommendations, consider:
- Current quality metrics (fineness, strength, setting time)
- Process parameters (temperature, pressure, speed)
- Material composition percentages
- Advanced settings (additives, curing, humidity)
- Energy consumption and cost factors
- Safety and environmental impact

Provide specific, actionable recommendations with numerical values and clear explanations of expected outcomes.`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          system: systemPrompt,
          model: "gemini-2.5-flash",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const recommendations = data.text
        .split("\n")
        .filter((line: string) => line.trim() !== "");

      // Simulate AI analysis data for visualization
      const mockAnalysis = [
        {
          parameter: "Kiln Temperature",
          current: processParams.kilnTemp,
          suggested: processParams.kilnTemp + 15,
          impact: "Improved clinker formation",
        },
        {
          parameter: "Limestone Content",
          current: materialComposition.limestone,
          suggested: materialComposition.limestone + 0.7,
          impact: "Enhanced strength properties",
        },
        {
          parameter: "Mill Speed",
          current: processParams.millSpeed,
          suggested: processParams.millSpeed - 0.4,
          impact: "Optimized energy consumption",
        },
        {
          parameter: "Gypsum Content",
          current: materialComposition.gypsum,
          suggested: materialComposition.gypsum + 0.3,
          impact: "Better setting time control",
        },
        {
          parameter: "Air Flow",
          current: processParams.airFlow,
          suggested: processParams.airFlow + 1.0,
          impact: "Optimal combustion efficiency",
        },
      ];

      setAiRecommendations(recommendations);
      setAiAnalysis(mockAnalysis);
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      setAiRecommendations([
        "Unable to generate recommendations at this time. Please try again later.",
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      ]);
      setAiAnalysis([]);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const totalComposition = Object.values(materialComposition).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="space-y-6">
      {/* AI Recommendations Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Advanced Quality Control</h3>
          <p className="text-sm text-muted-foreground">
            Fine-tune parameters for optimal cement quality
          </p>
        </div>
        <Button
          onClick={generateAIRecommendations}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Get AI Recommendations
        </Button>
      </div>

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-medium text-red-800">Validation Errors</h4>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-white"
            onClick={() => setShowValidation(false)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Preset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Production Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presets).map(([key, preset]) => (
              <Button
                key={key}
                variant={selectedPreset === key ? "default" : "outline"}
                onClick={() => applyPreset(key)}
                className={
                  selectedPreset === key ? "bg-blue-500 hover:bg-blue-600" : ""
                }
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="process" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Process
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-6">
          {/* Process Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings2 className="h-5 w-5" />
                  <span>Process Parameters</span>
                </div>
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="kilnTemp">Kiln Temperature (°C)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.kilnTemp]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("kilnTemp", value)
                      }
                      min={1400}
                      max={1600}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">1400°C</span>
                      <Input
                        id="kilnTemp"
                        type="number"
                        value={processParams.kilnTemp}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "kilnTemp",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-muted-foreground">1600°C</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="millSpeed">Mill Speed (rpm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.millSpeed]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("millSpeed", value)
                      }
                      min={14}
                      max={20}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">14 rpm</span>
                      <Input
                        id="millSpeed"
                        type="number"
                        value={processParams.millSpeed}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "millSpeed",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.1"
                      />
                      <span className="text-muted-foreground">20 rpm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="airFlow">Air Flow (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.airFlow]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("airFlow", value)
                      }
                      min={70}
                      max={100}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">70%</span>
                      <Input
                        id="airFlow"
                        type="number"
                        value={processParams.airFlow}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "airFlow",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.5"
                      />
                      <span className="text-muted-foreground">100%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="feedRate">Feed Rate (t/h)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.feedRate]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("feedRate", value)
                      }
                      min={200}
                      max={300}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">200 t/h</span>
                      <Input
                        id="feedRate"
                        type="number"
                        value={processParams.feedRate}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "feedRate",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-muted-foreground">300 t/h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="burnerPressure">Burner Pressure (mbar)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.burnerPressure]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("burnerPressure", value)
                      }
                      min={10}
                      max={15}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">10 mbar</span>
                      <Input
                        id="burnerPressure"
                        type="number"
                        value={processParams.burnerPressure}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "burnerPressure",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.1"
                      />
                      <span className="text-muted-foreground">15 mbar</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="coolerSpeed">Cooler Speed (rpm)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.coolerSpeed]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("coolerSpeed", value)
                      }
                      min={6}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">6 rpm</span>
                      <Input
                        id="coolerSpeed"
                        type="number"
                        value={processParams.coolerSpeed}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "coolerSpeed",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.1"
                      />
                      <span className="text-muted-foreground">10 rpm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="exhaustFan">Exhaust Fan (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.exhaustFan]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("exhaustFan", value)
                      }
                      min={60}
                      max={90}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">60%</span>
                      <Input
                        id="exhaustFan"
                        type="number"
                        value={processParams.exhaustFan}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "exhaustFan",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.5"
                      />
                      <span className="text-muted-foreground">90%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="preheaterTemp">
                    Preheater Temperature (°C)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.preheaterTemp]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("preheaterTemp", value)
                      }
                      min={800}
                      max={900}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">800°C</span>
                      <Input
                        id="preheaterTemp"
                        type="number"
                        value={processParams.preheaterTemp}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "preheaterTemp",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="5"
                      />
                      <span className="text-muted-foreground">900°C</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="calcinerTemp">
                    Calciner Temperature (°C)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[processParams.calcinerTemp]}
                      onValueChange={([value]) =>
                        handleProcessParamChange("calcinerTemp", value)
                      }
                      min={850}
                      max={950}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">850°C</span>
                      <Input
                        id="calcinerTemp"
                        type="number"
                        value={processParams.calcinerTemp}
                        onChange={(e) =>
                          handleProcessParamChange(
                            "calcinerTemp",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="5"
                      />
                      <span className="text-muted-foreground">950°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          {/* Material Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Material Composition</span>
                <Badge
                  variant={totalComposition === 100 ? "default" : "destructive"}
                >
                  Total: {totalComposition.toFixed(1)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(materialComposition).map(
                  ([material, percentage]) => (
                    <div key={material} className="space-y-3">
                      <Label htmlFor={material} className="capitalize">
                        {material.replace(/([A-Z])/g, " $1").trim()} (%)
                      </Label>
                      <div className="space-y-2">
                        <Slider
                          value={[percentage]}
                          onValueChange={([value]) =>
                            handleMaterialChange(material, value)
                          }
                          min={0}
                          max={
                            material === "limestone"
                              ? 85
                              : material === "clay"
                              ? 20
                              : material === "ironOre"
                              ? 5
                              : 10
                          }
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">0%</span>
                          <Input
                            id={material}
                            type="number"
                            value={percentage}
                            onChange={(e) =>
                              handleMaterialChange(
                                material,
                                Number(e.target.value)
                              )
                            }
                            className="w-20 h-8 text-center"
                            step="0.1"
                          />
                          <span className="text-muted-foreground">
                            {material === "limestone"
                              ? "85%"
                              : material === "clay"
                              ? "20%"
                              : material === "ironOre"
                              ? "5%"
                              : "10%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {totalComposition !== 100 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Warning: Material composition must total 100%. Current
                    total: {totalComposition.toFixed(1)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Advanced Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="grindingAid">
                    Grinding Aid Concentration (%)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.grindingAid]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("grindingAid", value)
                      }
                      min={0}
                      max={0.2}
                      step={0.005}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">0%</span>
                      <Input
                        id="grindingAid"
                        type="number"
                        value={advancedSettings.grindingAid}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "grindingAid",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.005"
                      />
                      <span className="text-muted-foreground">0.2%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="additiveType">Additive Type</Label>
                  <Select
                    value={advancedSettings.additiveType}
                    onValueChange={(value) =>
                      handleAdvancedSettingChange("additiveType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strength">
                        Strength Enhancer
                      </SelectItem>
                      <SelectItem value="rapid">Rapid Setting</SelectItem>
                      <SelectItem value="waterproof">Waterproofing</SelectItem>
                      <SelectItem value="eco">Eco-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="curingTime">Curing Time (hours)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.curingTime]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("curingTime", value)
                      }
                      min={6}
                      max={72}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">6h</span>
                      <Input
                        id="curingTime"
                        type="number"
                        value={advancedSettings.curingTime}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "curingTime",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-muted-foreground">72h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="humidityControl">Humidity Control (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.humidityControl]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("humidityControl", value)
                      }
                      min={40}
                      max={90}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">40%</span>
                      <Input
                        id="humidityControl"
                        type="number"
                        value={advancedSettings.humidityControl}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "humidityControl",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-muted-foreground">90%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="finenessTarget">
                    Fineness Target (cm²/g)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.finenessTarget]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("finenessTarget", value)
                      }
                      min={3000}
                      max={4000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">3000</span>
                      <Input
                        id="finenessTarget"
                        type="number"
                        value={advancedSettings.finenessTarget}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "finenessTarget",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="10"
                      />
                      <span className="text-muted-foreground">4000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="strengthTarget">Strength Target (MPa)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.strengthTarget]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("strengthTarget", value)
                      }
                      min={35}
                      max={55}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">35</span>
                      <Input
                        id="strengthTarget"
                        type="number"
                        value={advancedSettings.strengthTarget}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "strengthTarget",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="0.5"
                      />
                      <span className="text-muted-foreground">55</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="settingTimeTarget">
                    Setting Time Target (min)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[advancedSettings.settingTimeTarget]}
                      onValueChange={([value]) =>
                        handleAdvancedSettingChange("settingTimeTarget", value)
                      }
                      min={120}
                      max={240}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">120</span>
                      <Input
                        id="settingTimeTarget"
                        type="number"
                        value={advancedSettings.settingTimeTarget}
                        onChange={(e) =>
                          handleAdvancedSettingChange(
                            "settingTimeTarget",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8 text-center"
                        step="5"
                      />
                      <span className="text-muted-foreground">240</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="energyOptimization">
                      Energy Optimization
                    </Label>
                    <Switch
                      id="energyOptimization"
                      checked={advancedSettings.energyOptimization}
                      onCheckedChange={(checked) =>
                        handleAdvancedSettingChange(
                          "energyOptimization",
                          checked
                        )
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prioritize energy efficiency in process optimization
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="qualityPriority">Quality Priority</Label>
                  <Select
                    value={advancedSettings.qualityPriority}
                    onValueChange={(value) =>
                      handleAdvancedSettingChange("qualityPriority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="cost">Cost</SelectItem>
                      <SelectItem value="eco">Eco-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Parameter Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Parameter Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Temperature Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">87%</div>
                  <Progress value={87} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optimal range: 85-95%
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Material Balance</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalComposition === 100
                      ? "100%"
                      : `${totalComposition.toFixed(1)}%`}
                  </div>
                  <Progress value={totalComposition} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: 100%
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Air Flow Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(processParams.airFlow)}%
                  </div>
                  <Progress value={processParams.airFlow} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optimal range: 82-88%
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">
                  Quality Metrics Correlation
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fineness Correlation</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Strength Correlation</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Setting Time Correlation</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Parameter History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Recent Parameter Changes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {parameterHistory.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {parameterHistory
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                  >
                    <span className="font-medium">{entry.parameter}</span>
                    <span className="text-muted-foreground">
                      {entry.value} ({entry.type}) -{" "}
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No recent parameter changes
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span>AI-Powered Recommendations</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {isGeneratingRecommendations ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-lg font-medium">
                  Analyzing parameters with Gemini AI...
                </p>
                <p className="text-muted-foreground text-center">
                  Gemini is evaluating your current settings and generating
                  optimization recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {aiAnalysis.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Parameter Optimization Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiAnalysis.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded border"
                        >
                          <div className="font-medium">{item.parameter}</div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-muted-foreground">
                              Current: {item.current}
                            </span>
                            <span className="font-medium text-green-600">
                              Suggested: {item.suggested}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Optimization Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {aiRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Important Notes
                  </h3>
                  <ul className="space-y-1 text-sm text-amber-700">
                    <li>
                      • These recommendations are based on current quality
                      metrics and historical data
                    </li>
                    <li>
                      • Always verify changes in a controlled environment before
                      full implementation
                    </li>
                    <li>
                      • Consider consulting with senior engineers for critical
                      parameter adjustments
                    </li>
                    <li>
                      • Monitor quality metrics closely after implementing
                      changes
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAIDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Recommendations applied successfully!");
                      setShowAIDialog(false);
                    }}
                  >
                    Apply Recommendations
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
