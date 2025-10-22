"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
import { useFirebaseAuth } from "@/hooks/use-firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // If not authenticated, redirect to landing page
      router.push("/landing");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <OverviewDashboard />
    </DashboardLayout>
  );
}
