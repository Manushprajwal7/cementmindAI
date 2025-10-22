import { useState, useEffect, useCallback } from "react";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";

// Types for our Firebase data
export interface TelemetryData {
  id: string;
  sensorId: string;
  value: number;
  unit: string;
  timestamp: Date;
  location?: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  status: "active" | "acknowledged" | "resolved";
  sensorId?: string;
}

export interface QualityMeasurement {
  id: string;
  batchId: string;
  parameter: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: "pass" | "fail" | "warning";
}

export interface DeliverySchedule {
  id: string;
  customerId: string;
  address: string;
  scheduledDate: Date;
  status: "scheduled" | "in_transit" | "delivered" | "cancelled";
  driverId: string;
  truckId: string;
}

export interface Report {
  id: string;
  type: string;
  title: string;
  createdAt: Date;
  status: "generating" | "completed" | "failed";
  downloadUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt?: Date;
  photoURL?: string;
  phoneNumber?: string;
  company?: string;
  department?: string;
  position?: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

export interface UserSettings {
  id: string;
  email: string;
  displayName: string;
  role: string;
  preferences: Record<string, any>;
}

// Custom hooks for Firebase operations
export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user profile from API
        try {
          const response = await fetch(`/api/firebase/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "get_user_profile",
              data: { uid: user.uid },
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setUserProfile(result.profile);

              // Update last login time
              await fetch(`/api/firebase/auth`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "update_last_login",
                  data: { uid: user.uid },
                }),
              });
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase Auth not initialized");

    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase Auth not initialized");

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }

      return result.user;
    },
    []
  );

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    await signOut(auth);
  }, []);

  const updateUserProfile = useCallback(
    async (uid: string, profileData: Partial<UserProfile>) => {
      try {
        const response = await fetch(`/api/firebase/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_user",
            data: { uid, ...profileData },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user profile");
        }

        const result = await response.json();

        // Update local profile state if successful
        if (result.success && userProfile) {
          setUserProfile({
            ...userProfile,
            ...profileData,
          });
        }

        return result;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    },
    [userProfile]
  );

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateUserProfile,
  };
}

export function useFirebaseData<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      const response = await fetch(`/api/firebase/${endpoint}?${searchParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useFirebaseMutation<T>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (type: string, data: any): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/firebase/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, data }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { mutate, loading, error };
}

// Specific hooks for each route
export function useDashboardData() {
  return useFirebaseData<{
    metrics: any[];
    recentAlerts: Alert[];
    telemetryData: any;
    qualityMetrics: QualityMeasurement[];
  }>("dashboard");
}

export function useTelemetryData(params?: {
  limit?: number;
  sensorId?: string;
  startTime?: string;
  endTime?: string;
}) {
  return useFirebaseData<{
    telemetryData: TelemetryData[];
    sensors: any[];
    thresholds: any[];
  }>("telemetry", params);
}

export function useAlertsData(params?: {
  limit?: number;
  status?: string;
  severity?: string;
}) {
  return useFirebaseData<{
    alerts: Alert[];
    statistics: any;
    correlationRules: any[];
    incidents: any[];
  }>("alerts", params);
}

export function useQualityData(params?: { limit?: number; batchId?: string }) {
  return useFirebaseData<{
    qualityData: QualityMeasurement[];
    standards: any[];
    trends: any[];
    corrections: any[];
    metricsSummary: any;
  }>("quality", params);
}

export function useLogisticsData(params?: {
  limit?: number;
  status?: string;
  driverId?: string;
}) {
  return useFirebaseData<{
    deliveries: DeliverySchedule[];
    trucks: any[];
    driverPerformance: any[];
    optimizedRoutes: any[];
    logisticsMetrics: any;
    maintenanceData: any[];
  }>("logistics", params);
}

export function useReportsData(params?: {
  limit?: number;
  type?: string;
  status?: string;
}) {
  return useFirebaseData<{
    reports: Report[];
    templates: any[];
    scheduledReports: any[];
    sharedReports: any[];
    customConfigs: any[];
    reportAnalytics: any;
  }>("reports", params);
}

export function useSettingsData(section?: string) {
  return useFirebaseData<{
    users: UserSettings[];
    integrations: any[];
    auditLogs: any[];
    settings: any[];
  }>("settings", section ? { section } : undefined);
}

// Mutation hooks for each route
export function useDashboardMutation() {
  return useFirebaseMutation("dashboard");
}

export function useTelemetryMutation() {
  return useFirebaseMutation("telemetry");
}

export function useAlertsMutation() {
  return useFirebaseMutation("alerts");
}

export function useQualityMutation() {
  return useFirebaseMutation("quality");
}

export function useLogisticsMutation() {
  return useFirebaseMutation("logistics");
}

export function useReportsMutation() {
  return useFirebaseMutation("reports");
}

export function useSettingsMutation() {
  return useFirebaseMutation("settings");
}

export function useAuthMutation() {
  return useFirebaseMutation("auth");
}
