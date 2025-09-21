"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    // Reset analysis
    setAnalysis(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!file || !preview) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Extract base64 data from preview (remove data:image/jpeg;base64, prefix)
      const base64Data = preview.split(',')[1];
      
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          features: [
            { type: 'TEXT_DETECTION' },
            { type: 'LABEL_DETECTION' },
            { type: 'FACE_DETECTION' }
          ]
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Analysis with Cloud Vision
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <Button 
              onClick={analyzeImage} 
              disabled={!file || loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Analyze Image
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {preview && (
            <div className="mt-4 border rounded-md overflow-hidden max-w-md">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto object-contain"
              />
            </div>
          )}
          
          {analysis && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analysis Results
              </h3>
              
              {/* Text Detection */}
              {analysis.result?.textAnnotations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detected Text:</h4>
                  <p className="p-3 bg-muted rounded-md">
                    {analysis.result.textAnnotations[0].description}
                  </p>
                </div>
              )}
              
              {/* Label Detection */}
              {analysis.result?.labelAnnotations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Labels:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.result.labelAnnotations.map((label: any, i: number) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {label.description} ({Math.round(label.score * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Processing Metadata */}
              <div className="text-xs text-muted-foreground mt-4">
                Processed at: {analysis.metadata?.timestamp}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}