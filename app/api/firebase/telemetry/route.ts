import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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
    const sensorId = searchParams.get("sensorId");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    const db = admin.firestore;
    if (!db) {
      return NextResponse.json(
        { error: "Firestore not initialized" },
        { status: 500 }
      );
    }
    let query = db
      .collection("telemetry_data")
      .orderBy("timestamp", "desc")
      .limit(limit);

    // Apply filters
    if (sensorId) {
      query = query.where("sensorId", "==", sensorId);
    }
    if (startTime) {
      query = query.where("timestamp", ">=", new Date(startTime));
    }
    if (endTime) {
      query = query.where("timestamp", "<=", new Date(endTime));
    }

    const snapshot = await query.get();
    const telemetryData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get sensor configurations
    const sensorsRef = db.collection("sensor_configurations");
    const sensorsSnapshot = await sensorsRef.get();
    const sensors = sensorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get alert thresholds
    const thresholdsRef = db.collection("alert_thresholds");
    const thresholdsSnapshot = await thresholdsRef.get();
    const thresholds = thresholdsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        telemetryData,
        sensors,
        thresholds,
      },
    });
  } catch (error: any) {
    console.error("Telemetry API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch telemetry data" },
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
      case "add_telemetry":
        await db.collection("telemetry_data").add({
          ...data,
          timestamp,
        });
        break;

      case "update_sensor_config":
        await db
          .collection("sensor_configurations")
          .doc(data.sensorId)
          .set(
            {
              ...data.config,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "update_thresholds":
        await db
          .collection("alert_thresholds")
          .doc(data.sensorType)
          .set(
            {
              ...data.thresholds,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "calibrate_sensor":
        await db.collection("sensor_calibrations").add({
          sensorId: data.sensorId,
          calibrationData: data.calibrationData,
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
    console.error("Telemetry POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update telemetry data" },
      { status: 500 }
    );
  }
}
