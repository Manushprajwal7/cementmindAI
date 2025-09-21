import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { getDatabase } from "firebase-admin/database";
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
    const status = searchParams.get("status");
    const driverId = searchParams.get("driverId");
    const section = searchParams.get("section");

    const db = admin.firestore;
    const rtdb = getDatabase(admin.app);
    const result: any = {};

    if (!db) {
      return NextResponse.json(
        { error: "Firestore not initialized" },
        { status: 500 }
      );
    }

    // Get real-time truck data from Realtime Database if available
    try {
      if (!section || (section === "trucks" && rtdb)) {
        const rtdbTrucksSnapshot = await rtdb.ref("truck_fleet").once("value");
        const rtdbTrucks = rtdbTrucksSnapshot.val();
        if (rtdbTrucks) {
          result.trucks = Object.entries(rtdbTrucks).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              last_updated: data.last_updated
                ? new Date(data.last_updated).toISOString()
                : new Date().toISOString(),
            })
          );
        }
      }
    } catch (rtdbError) {
      console.error("Error fetching from Realtime Database:", rtdbError);
    }

    // Get delivery schedules from Firestore
    if (!section || section === "deliveries") {
      let deliveriesQuery = db
        .collection("delivery_schedules")
        .orderBy("scheduledDate", "desc")
        .limit(limit);
      if (status) {
        deliveriesQuery = deliveriesQuery.where("status", "==", status);
      }
      if (driverId) {
        deliveriesQuery = deliveriesQuery.where("driverId", "==", driverId);
      }

      const deliveriesSnapshot = await deliveriesQuery.get();
      result.deliveries = deliveriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate:
          doc.data().scheduledDate?.toDate?.() || doc.data().scheduledDate,
      }));
    }

    // Get truck fleet data from Firestore if not already fetched from RTDB
    if ((!section || section === "trucks") && !result.trucks) {
      const trucksRef = db.collection("truck_fleet");
      const trucksSnapshot = await trucksRef.get();
      result.trucks = trucksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Get driver performance data
    if (!section || section === "drivers") {
      const driversRef = db
        .collection("driver_performance")
        .orderBy("date", "desc")
        .limit(30);
      const driversSnapshot = await driversRef.get();
      result.drivers = driversSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
      }));
    }

    // Get route optimization data
    if (!section || section === "routes") {
      const routesRef = db
        .collection("optimized_routes")
        .orderBy("createdAt", "desc")
        .limit(20);
      const routesSnapshot = await routesRef.get();
      result.routes = routesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));
    }

    // Get logistics metrics
    if (!section || section === "metrics") {
      const metricsRef = db.collection("logistics_metrics").doc("summary");
      const metricsDoc = await metricsRef.get();
      result.metrics = metricsDoc.exists ? metricsDoc.data() : null;
    }

    // Get predictive maintenance data
    if (!section || section === "maintenance") {
      const maintenanceRef = db
        .collection("predictive_maintenance")
        .orderBy("predictedDate", "asc");
      const maintenanceSnapshot = await maintenanceRef.get();
      result.maintenance = maintenanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        predictedDate:
          doc.data().predictedDate?.toDate?.() || doc.data().predictedDate,
      }));
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Logistics API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch logistics data" },
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
      case "create_delivery_schedule":
        await db.collection("delivery_schedules").add({
          ...data,
          createdAt: timestamp,
          status: "scheduled",
        });
        break;

      case "update_delivery_status":
        await db
          .collection("delivery_schedules")
          .doc(data.deliveryId)
          .update({
            status: data.status,
            updatedAt: timestamp,
            ...(data.location && { currentLocation: data.location }),
            ...(data.notes && { notes: data.notes }),
          });
        break;

      case "confirm_delivery":
        await db.collection("delivery_confirmations").add({
          deliveryId: data.deliveryId,
          confirmedBy: data.userId,
          confirmationData: data.confirmationData,
          timestamp,
        });
        break;

      case "update_truck_status":
        await db
          .collection("truck_fleet")
          .doc(data.truckId)
          .update({
            status: data.status,
            lastUpdated: timestamp,
            ...(data.location && { currentLocation: data.location }),
            ...(data.maintenanceNotes && {
              maintenanceNotes: data.maintenanceNotes,
            }),
          });
        break;

      case "optimize_route":
        await db.collection("optimized_routes").add({
          ...data,
          createdAt: timestamp,
          status: "optimized",
        });
        break;

      case "update_driver_performance":
        await db.collection("driver_performance").add({
          ...data,
          date: timestamp,
        });
        break;

      case "schedule_maintenance":
        await db.collection("maintenance_schedules").add({
          ...data,
          scheduledAt: timestamp,
          status: "scheduled",
        });
        break;

      case "update_logistics_metrics":
        await db
          .collection("logistics_metrics")
          .doc("summary")
          .set(
            {
              ...data.metrics,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid operation type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Logistics POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update logistics data" },
      { status: 500 }
    );
  }
}
