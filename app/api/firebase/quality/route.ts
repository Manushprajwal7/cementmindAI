import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { getDatabase } from "firebase-admin/database";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  try {
    const admin = getFirebaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const batchId = searchParams.get("batchId");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const section = searchParams.get("section") || "all";

    const db = admin.firestore;
    if (!db) {
      return NextResponse.json(
        { error: "Firestore not initialized" },
        { status: 500 }
      );
    }
    const response: any = { success: true, data: {} };

    // Get quality measurements
    if (section === "all" || section === "measurements") {
      let query = db
        .collection("quality_measurements")
        .orderBy("timestamp", "desc")
        .limit(limit);

      // Apply filters
      if (batchId) {
        query = query.where("batchId", "==", batchId);
      }
      if (startTime) {
        query = query.where(
          "timestamp",
          ">=",
          Timestamp.fromDate(new Date(startTime))
        );
      }
      if (endTime) {
        query = query.where(
          "timestamp",
          "<=",
          Timestamp.fromDate(new Date(endTime))
        );
      }

      const snapshot = await query.get();
      const qualityData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp,
      }));

      response.data.qualityData = qualityData;
    }

    // Get quality standards
    if (section === "all" || section === "standards") {
      const standardsRef = db.collection("quality_standards");
      const standardsSnapshot = await standardsRef.get();
      const standards = standardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));

      response.data.standards = standards;
    }

    // Get quality trends
    if (section === "all" || section === "trends") {
      const trendsRef = db
        .collection("quality_trends")
        .orderBy("date", "desc")
        .limit(30);
      const trendsSnapshot = await trendsRef.get();
      const trends = trendsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
      }));

      response.data.trends = trends;
    }

    // Get correction suggestions
    if (section === "all" || section === "corrections") {
      const correctionsRef = db
        .collection("correction_suggestions")
        .orderBy("createdAt", "desc")
        .limit(20);
      const correctionsSnapshot = await correctionsRef.get();
      const corrections = correctionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));

      response.data.corrections = corrections;
    }

    // Get quality metrics summary
    if (section === "all" || section === "metrics") {
      const metricsRef = db.collection("quality_metrics_summary").doc("latest");
      const metricsDoc = await metricsRef.get();
      const metricsSummary = metricsDoc.exists
        ? {
            ...metricsDoc.data(),
            lastUpdated:
              metricsDoc.data()?.lastUpdated?.toDate?.() ||
              metricsDoc.data()?.lastUpdated,
          }
        : null;

      response.data.metricsSummary = metricsSummary;
    }

    // Get real-time quality control recommendations
    if (section === "all" || section === "recommendations") {
      // Try to get from Firestore first
      const recommendationsRef = db
        .collection("quality_recommendations")
        .doc("latest");
      const recommendationsDoc = await recommendationsRef.get();

      if (recommendationsDoc.exists) {
        response.data.recommendations = {
          ...recommendationsDoc.data(),
          timestamp:
            recommendationsDoc.data()?.timestamp?.toDate?.() ||
            recommendationsDoc.data()?.timestamp,
        };
      } else {
        // Fallback to Realtime Database if available
        const rtdb = getDatabase(admin.app);
        if (rtdb) {
          const rtdbSnapshot = await rtdb
            .ref("plants/plant-1/recommendations/quality_control")
            .once("value");
          if (rtdbSnapshot.exists()) {
            response.data.recommendations = rtdbSnapshot.val();
          }
        }
      }
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Quality API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch quality data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getFirebaseAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { type, data } = body;

    const db = admin.firestore;
    if (!db) {
      return NextResponse.json(
        { error: "Firestore not initialized" },
        { status: 500 }
      );
    }
    const timestamp = FieldValue.serverTimestamp();

    switch (type) {
      case "add_quality_measurement":
        await db.collection("quality_measurements").add({
          ...data,
          timestamp,
        });
        break;

      case "update_quality_standard":
        await db
          .collection("quality_standards")
          .doc(data.standardId)
          .set(
            {
              ...data.standard,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "create_correction_suggestion":
        await db.collection("correction_suggestions").add({
          ...data,
          createdAt: timestamp,
          status: "pending",
        });
        break;

      case "apply_correction":
        await db.collection("quality_corrections").add({
          ...data,
          appliedAt: timestamp,
          appliedBy: data.userId,
        });
        break;

      case "update_quality_metrics":
        await db
          .collection("quality_metrics_summary")
          .doc("latest")
          .set(
            {
              ...data.metrics,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "manual_adjustment":
        await db.collection("manual_adjustments").add({
          ...data,
          timestamp,
          type: "manual",
        });
        break;

      case "quality_impact_analysis":
        await db.collection("quality_impact_analyses").add({
          ...data,
          createdAt: timestamp,
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
    console.error("Quality POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update quality data" },
      { status: 500 }
    );
  }
}
