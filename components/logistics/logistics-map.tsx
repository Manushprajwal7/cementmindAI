"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, AlertCircle } from "lucide-react";

interface LogisticsMapProps {
  fullSize?: boolean;
}

export function LogisticsMap({ fullSize = false }: LogisticsMapProps) {
  // Using a simpler Google Maps embed URL that should work without connection issues
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.019!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16094922c13d%3A0x95d8d8f9b6c1b2e0!2sJ%20K%20Cement%20Ltd!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin";

  return (
    <Card className={cn(fullSize && "col-span-full")}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>J K Cement Ltd - Bangalore</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-0 h-96 relative">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="J K Cement Ltd - Bangalore"
          ></iframe>
        </div>

        {/* Map Title */}
        <p className="mt-2 text-sm text-center text-gray-500">
          J K Cement Ltd - Bangalore
        </p>
      </CardContent>
    </Card>
  );
}
