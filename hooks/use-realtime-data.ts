'use client';

import { useEffect, useState } from 'react';
import { getRealtimeDb, getFirestoreDb } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { collection, onSnapshot, query as firestoreQuery, orderBy, limit } from 'firebase/firestore';

type KPIStatus = 'ok' | 'warn' | 'critical';

interface KPIData {
  id: string;
  title: string;
  value: number;
  delta: number;
  unit: string;
  sparkline: number[];
  status: KPIStatus;
}

export function useRealtimeKPI(metricId: string): KPIData | null {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);

  useEffect(() => {
    const db = getRealtimeDb();
    if (!db) return;

    // Reference to the specific metric in Realtime Database
    const metricRef = ref(db, `metrics/${metricId}`);
    
    // Set up real-time listener
    const unsubscribe = onValue(metricRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setKpiData({
          id: metricId,
          title: data.title || metricId.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          value: data.currentValue || 0,
          delta: data.delta || 0,
          unit: data.unit || '',
          sparkline: data.sparkline || [],
          status: (data.status || 'ok') as KPIStatus
        });
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [metricId]);

  return kpiData;
}

export function useRealtimeMetrics(metricIds: string[]): Record<string, KPIData | null> {
  const [metrics, setMetrics] = useState<Record<string, KPIData | null>>({});

  useEffect(() => {
    const db = getRealtimeDb();
    if (!db) return;

    const unsubscribeFns: (() => void)[] = [];
    const newMetrics: Record<string, KPIData | null> = {};

    metricIds.forEach(metricId => {
      newMetrics[metricId] = null;
      const metricRef = ref(db, `metrics/${metricId}`);
      
      const unsubscribe = onValue(metricRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMetrics(prev => ({
            ...prev,
            [metricId]: {
              id: metricId,
              title: data.title || metricId.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '),
              value: data.currentValue || 0,
              delta: data.delta || 0,
              unit: data.unit || '',
              sparkline: data.sparkline || [],
              status: (data.status || 'ok') as KPIStatus
            }
          }));
        }
      });

      unsubscribeFns.push(unsubscribe);
    });

    return () => {
      unsubscribeFns.forEach(unsubscribe => unsubscribe());
    };
  }, [metricIds]);

  return metrics;
}

export function useRealtimeChartData(metricKey: string, limitPoints: number = 50) {
  const [data, setData] = useState<{ timestamp: number; value: number }[]>([]);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) return;

    const q = firestoreQuery(
      collection(db, 'telemetry'),
      orderBy('timestamp', 'desc'),
      limit(limitPoints)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newData = querySnapshot.docs
        .map(doc => ({
          timestamp: doc.data().timestamp?.toDate().getTime() || 0,
          value: doc.data()[metricKey] || 0
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      setData(newData);
    });

    return () => unsubscribe();
  }, [metricKey, limitPoints]);

  return data;
}
