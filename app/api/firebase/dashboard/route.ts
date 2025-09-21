import { NextRequest, NextResponse } from "next/server";
import { getFirestoreAdmin } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const db = getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    // Get dashboard metrics from Firestore
    const metricsRef = db.collection("dashboard_metrics");
    const metricsSnapshot = await metricsRef.get();

    const metrics = metricsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get recent alerts
    const alertsRef = db
      .collection("alerts")
      .orderBy("timestamp", "desc")
      .limit(5);
    const alertsSnapshot = await alertsRef.get();

    const recentAlerts = alertsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get telemetry summary
    const telemetryRef = db.collection("telemetry_summary").doc("latest");
    const telemetryDoc = await telemetryRef.get();
    const telemetryData = telemetryDoc.exists ? telemetryDoc.data() : null;

    // Get quality metrics
    const qualityRef = db
      .collection("quality_metrics")
      .orderBy("timestamp", "desc")
      .limit(10);
    const qualitySnapshot = await qualityRef.get();

    const qualityMetrics = qualitySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        recentAlerts,
        telemetryData,
        qualityMetrics,
      },
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { metrics, startDate, endDate } = await req.json();
    const db = getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const { type, data } = { type: "update_metrics", data: metrics };

    const { FieldValue } = await import('firebase-admin/firestore');
    const timestamp = FieldValue.serverTimestamp();

    switch (type) {
      case "update_metrics":
        await db
          .collection("dashboard_metrics")
          .doc("kpi")
          .set(
            {
              ...data,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "log_activity":
        await db.collection("user_activities").add({
          ...data,
          timestamp,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid operation type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Dashboard POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update dashboard data" },
      { status: 500 }
    );
  }
}
