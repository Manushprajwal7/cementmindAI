import { NextRequest, NextResponse } from "next/server";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  try {
    const db = getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    let query = db
      .collection("alerts")
      .orderBy("timestamp", "desc")
      .limit(limit);

    // Apply filters
    if (status) {
      query = query.where("status", "==", status);
    }
    if (severity) {
      query = query.where("severity", "==", severity);
    }
    if (startTime) {
      query = query.where("timestamp", ">=", new Date(startTime));
    }
    if (endTime) {
      query = query.where("timestamp", "<=", new Date(endTime));
    }

    const snapshot = await query.get();
    const alerts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get alert statistics
    const statsRef = db.collection("alert_statistics").doc("summary");
    const statsDoc = await statsRef.get();
    const statistics = statsDoc.exists ? statsDoc.data() : null;

    // Get alert correlation rules
    const correlationRef = db.collection("alert_correlation_rules");
    const correlationSnapshot = await correlationRef.get();
    const correlationRules = correlationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get incident timeline
    const incidentsRef = db
      .collection("incidents")
      .orderBy("createdAt", "desc")
      .limit(10);
    const incidentsSnapshot = await incidentsRef.get();
    const incidents = incidentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        statistics,
        correlationRules,
        incidents,
      },
    });
  } catch (error: any) {
    console.error("Alerts API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch alerts data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { type, data } = body;
    const timestamp = FieldValue.serverTimestamp();

    switch (type) {
      case "create_alert":
        await db.collection("alerts").add({
          ...data,
          timestamp,
          status: "active",
        });
        break;

      case "update_alert_status":
        await db
          .collection("alerts")
          .doc(data.alertId)
          .update({
            status: data.status,
            updatedAt: timestamp,
            ...(data.notes && { notes: data.notes }),
          });
        break;

      case "bulk_update_alerts":
        const batch = db.batch();
        data.alertIds.forEach((alertId: string) => {
          const alertRef = db.collection("alerts").doc(alertId);
          batch.update(alertRef, {
            status: data.status,
            updatedAt: timestamp,
          });
        });
        await batch.commit();
        break;

      case "create_incident":
        await db.collection("incidents").add({
          ...data,
          createdAt: timestamp,
          status: "open",
        });
        break;

      case "update_correlation_rule":
        await db
          .collection("alert_correlation_rules")
          .doc(data.ruleId)
          .set(
            {
              ...data.rule,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "acknowledge_alert":
        await db.collection("alerts").doc(data.alertId).update({
          status: "acknowledged",
          acknowledgedBy: data.userId,
          acknowledgedAt: timestamp,
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
    console.error("Alerts POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update alerts data" },
      { status: 500 }
    );
  }
}
