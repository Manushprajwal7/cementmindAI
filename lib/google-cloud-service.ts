import { useState, useEffect } from 'react';

// Types for the data returned from Google Cloud
export interface TelemetryData {
  timestamp: string;
  temperature: number;
  pressure: number;
  vibration: number;
  humidity: number;
  particleCount: number;
  flowRate: number;
  energyConsumption: number;
}

export interface QualityMetric {
  timestamp: string;
  strengthPsi: number;
  density: number;
  waterCementRatio: number;
  slumpInches: number;
  airContent: number;
  settingTime: number;
  qualityScore: number;
}

export interface LogisticsData {
  truckId: string;
  location: { lat: number; lng: number };
  status: 'loading' | 'in_transit' | 'delivering' | 'returning' | 'maintenance';
  capacity: number;
  currentLoad: number;
  estimatedArrival: string;
  driverId: string;
  route: { lat: number; lng: number }[];
}

export interface AnalyticsData {
  period: string;
  production: number;
  deliveries: number;
  qualityIssues: number;
  energyEfficiency: number;
  costPerTon: number;
  customerSatisfaction: number;
}

// Function to fetch telemetry data from BigQuery
export async function fetchTelemetryData(limit = 100): Promise<TelemetryData[]> {
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            TIMESTAMP_TRUNC(timestamp, MINUTE) as timestamp,
            AVG(temperature) as temperature,
            AVG(pressure) as pressure,
            AVG(vibration) as vibration,
            AVG(humidity) as humidity,
            AVG(particle_count) as particleCount,
            AVG(flow_rate) as flowRate,
            AVG(energy_consumption) as energyConsumption
          FROM \`your-project.cement_data.telemetry\`
          GROUP BY timestamp
          ORDER BY timestamp DESC
          LIMIT @limit
        `,
        params: { limit }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch telemetry data');
    }

    const data = await response.json();
    return data.rows.map((row: any) => ({
      timestamp: row.timestamp,
      temperature: row.temperature,
      pressure: row.pressure,
      vibration: row.vibration,
      humidity: row.humidity,
      particleCount: row.particleCount,
      flowRate: row.flowRate,
      energyConsumption: row.energyConsumption,
    }));
  } catch (error) {
    console.error('Error fetching telemetry data:', error);
    // Return mock data for development
    return generateMockTelemetryData(limit);
  }
}

// Function to fetch quality metrics from BigQuery
export async function fetchQualityMetrics(limit = 100): Promise<QualityMetric[]> {
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            timestamp,
            strength_psi as strengthPsi,
            density,
            water_cement_ratio as waterCementRatio,
            slump_inches as slumpInches,
            air_content as airContent,
            setting_time as settingTime,
            quality_score as qualityScore
          FROM \`your-project.cement_data.quality_metrics\`
          ORDER BY timestamp DESC
          LIMIT @limit
        `,
        params: { limit }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quality metrics');
    }

    const data = await response.json();
    return data.rows;
  } catch (error) {
    console.error('Error fetching quality metrics:', error);
    // Return mock data for development
    return generateMockQualityMetrics(limit);
  }
}

// Function to fetch logistics data
export async function fetchLogisticsData(limit = 20): Promise<LogisticsData[]> {
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            truck_id as truckId,
            location_lat as lat,
            location_lng as lng,
            status,
            capacity,
            current_load as currentLoad,
            estimated_arrival as estimatedArrival,
            driver_id as driverId,
            route
          FROM \`your-project.cement_data.logistics\`
          ORDER BY last_updated DESC
          LIMIT @limit
        `,
        params: { limit }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch logistics data');
    }

    const data = await response.json();
    return data.rows.map((row: any) => ({
      truckId: row.truckId,
      location: { lat: row.lat, lng: row.lng },
      status: row.status,
      capacity: row.capacity,
      currentLoad: row.currentLoad,
      estimatedArrival: row.estimatedArrival,
      driverId: row.driverId,
      route: JSON.parse(row.route || '[]'),
    }));
  } catch (error) {
    console.error('Error fetching logistics data:', error);
    // Return mock data for development
    return generateMockLogisticsData(limit);
  }
}

// Function to fetch analytics data
export async function fetchAnalyticsData(period = 'monthly', limit = 12): Promise<AnalyticsData[]> {
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            period,
            production,
            deliveries,
            quality_issues as qualityIssues,
            energy_efficiency as energyEfficiency,
            cost_per_ton as costPerTon,
            customer_satisfaction as customerSatisfaction
          FROM \`your-project.cement_data.analytics_${period}\`
          ORDER BY period DESC
          LIMIT @limit
        `,
        params: { limit }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }

    const data = await response.json();
    return data.rows;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return mock data for development
    return generateMockAnalyticsData(period, limit);
  }
}

// Hook for real-time telemetry data
export function useTelemetryData(refreshInterval = 10000, limit = 100) {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchTelemetryData(limit);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [refreshInterval, limit]);

  return { data, loading, error };
}

// Hook for real-time quality metrics
export function useQualityMetrics(refreshInterval = 30000, limit = 100) {
  const [data, setData] = useState<QualityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchQualityMetrics(limit);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [refreshInterval, limit]);

  return { data, loading, error };
}

// Hook for real-time logistics data
export function useLogisticsData(refreshInterval = 5000, limit = 20) {
  const [data, setData] = useState<LogisticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchLogisticsData(limit);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [refreshInterval, limit]);

  return { data, loading, error };
}

// Hook for analytics data
export function useAnalyticsData(period = 'monthly', refreshInterval = 60000, limit = 12) {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchAnalyticsData(period, limit);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [period, refreshInterval, limit]);

  return { data, loading, error };
}

// Mock data generators for development
function generateMockTelemetryData(count: number): TelemetryData[] {
  const data: TelemetryData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: 70 + Math.random() * 30, // 70-100
      pressure: 40 + Math.random() * 20, // 40-60
      vibration: Math.random() * 5, // 0-5
      humidity: 30 + Math.random() * 40, // 30-70
      particleCount: Math.floor(Math.random() * 1000), // 0-1000
      flowRate: 10 + Math.random() * 10, // 10-20
      energyConsumption: 80 + Math.random() * 40, // 80-120
    });
  }
  
  return data;
}

function generateMockQualityMetrics(count: number): QualityMetric[] {
  const data: QualityMetric[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 3600000); // 1 hour intervals
    data.push({
      timestamp: timestamp.toISOString(),
      strengthPsi: 3000 + Math.random() * 2000, // 3000-5000
      density: 140 + Math.random() * 20, // 140-160
      waterCementRatio: 0.35 + Math.random() * 0.15, // 0.35-0.5
      slumpInches: 2 + Math.random() * 6, // 2-8
      airContent: 2 + Math.random() * 6, // 2-8
      settingTime: 30 + Math.random() * 30, // 30-60
      qualityScore: 70 + Math.random() * 30, // 70-100
    });
  }
  
  return data;
}

function generateMockLogisticsData(count: number): LogisticsData[] {
  const statuses: LogisticsData['status'][] = ['loading', 'in_transit', 'delivering', 'returning', 'maintenance'];
  const data: LogisticsData[] = [];
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + Math.random() * 3600000 * 8); // 0-8 hours from now
    
    data.push({
      truckId: `T-${1000 + i}`,
      location: { 
        lat: 37.7749 + (Math.random() - 0.5) * 0.2, 
        lng: -122.4194 + (Math.random() - 0.5) * 0.2 
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      capacity: 10 + Math.floor(Math.random() * 10), // 10-20
      currentLoad: Math.floor(Math.random() * 20), // 0-20
      estimatedArrival: arrivalTime.toISOString(),
      driverId: `D-${2000 + i}`,
      route: Array(Math.floor(3 + Math.random() * 5)).fill(0).map(() => ({
        lat: 37.7749 + (Math.random() - 0.5) * 0.2,
        lng: -122.4194 + (Math.random() - 0.5) * 0.2
      })),
    });
  }
  
  return data;
}

function generateMockAnalyticsData(period: string, count: number): AnalyticsData[] {
  const data: AnalyticsData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    let periodLabel: string;
    
    if (period === 'daily') {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      periodLabel = date.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      periodLabel = `Week ${date.getFullYear()}-${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
    } else if (period === 'monthly') {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      periodLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else { // yearly
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      periodLabel = date.getFullYear().toString();
    }
    
    data.push({
      period: periodLabel,
      production: 5000 + Math.random() * 3000, // 5000-8000
      deliveries: 100 + Math.floor(Math.random() * 100), // 100-200
      qualityIssues: Math.floor(Math.random() * 20), // 0-20
      energyEfficiency: 70 + Math.random() * 30, // 70-100
      costPerTon: 80 + Math.random() * 40, // 80-120
      customerSatisfaction: 70 + Math.random() * 30, // 70-100
    });
  }
  
  return data;
}