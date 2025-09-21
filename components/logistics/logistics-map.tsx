"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, AlertCircle } from "lucide-react";

interface LogisticsMapProps {
  fullSize?: boolean;
}

export function LogisticsMap({ fullSize = false }: LogisticsMapProps) {
  // Path to the local map image
  const mapImageUrl = "/images/bengluru map.png";

  return (
    <Card className={cn(fullSize && "col-span-full")}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Bengaluru Plant Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "relative bg-white rounded-lg overflow-hidden border border-gray-200",
          fullSize ? "h-96" : "h-64"
        )}>
          <img 
            src={mapImageUrl} 
            alt="Bengaluru Map" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.alt = "Map image failed to load";
              target.className = "w-full h-full bg-gray-100 flex items-center justify-center";
              target.innerHTML = '<span class="text-gray-500">Map not available</span>';
            }}
          />
        </div>
        
        {/* Map Title */}
        <p className="mt-2 text-sm text-center text-gray-500">Bengaluru Plant Location</p>
      </CardContent>
    </Card>
  );
}
