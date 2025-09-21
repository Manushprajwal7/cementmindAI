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
    const limit = parseInt(searchParams.get("limit") || "50");
    const reportType = searchParams.get("type");
    const status = searchParams.get("status");
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

    // Try to get real-time reports data from RTDB first
    try {
      if ((!section || section === "reports") && rtdb) {
        const rtdbReportsSnapshot = await rtdb
          .ref("generated_reports")
          .once("value");
        const rtdbReports = rtdbReportsSnapshot.val();
        if (rtdbReports) {
          result.reports = Object.entries(rtdbReports)
            .map(([id, data]: [string, any]) => ({
              id,
              ...data,
              createdAt: data.createdAt
                ? new Date(data.createdAt).toISOString()
                : new Date().toISOString(),
            }))
            .filter((report) => {
              if (reportType && report.type !== reportType) return false;
              if (status && report.status !== status) return false;
              return true;
            })
            .slice(0, limit);
        }
      }
    } catch (rtdbError) {
      console.error("Error fetching from Realtime Database:", rtdbError);
    }

    // Fallback to Firestore if no RTDB data
    if (!section || (section === "reports" && !result.reports)) {
      // Get generated reports
      let reportsQuery = db
        .collection("generated_reports")
        .orderBy("createdAt", "desc")
        .limit(limit);
      if (reportType) {
        reportsQuery = reportsQuery.where("type", "==", reportType);
      }
      if (status) {
        reportsQuery = reportsQuery.where("status", "==", status);
      }

      const reportsSnapshot = await reportsQuery.get();
      result.reports = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      }));
    }

    // Get report templates
    if (!section || section === "templates") {
      const templatesRef = db.collection("report_templates");
      const templatesSnapshot = await templatesRef.get();
      result.templates = templatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Get scheduled reports
    if (!section || section === "scheduled") {
      const scheduledRef = db
        .collection("scheduled_reports")
        .orderBy("nextRun", "asc");
      const scheduledSnapshot = await scheduledRef.get();
      result.scheduledReports = scheduledSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        nextRun: doc.data().nextRun?.toDate?.() || doc.data().nextRun,
      }));
    }

    // Get report sharing data
    if (!section || section === "sharing") {
      const sharingRef = db
        .collection("report_sharing")
        .orderBy("sharedAt", "desc")
        .limit(20);
      const sharingSnapshot = await sharingRef.get();
      result.sharedReports = sharingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sharedAt: doc.data().sharedAt?.toDate?.() || doc.data().sharedAt,
      }));
    }

    // Get custom report configurations
    if (!section || section === "configs") {
      const customRef = db.collection("custom_report_configs");
      const customSnapshot = await customRef.get();
      result.customConfigs = customSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Get report analytics from RTDB first, then fallback to Firestore
    if (!section || section === "analytics") {
      try {
        if (rtdb) {
          const rtdbAnalyticsSnapshot = await rtdb
            .ref("report_analytics")
            .once("value");
          const rtdbAnalytics = rtdbAnalyticsSnapshot.val();
          if (rtdbAnalytics) {
            result.reportAnalytics = rtdbAnalytics;
          }
        }
      } catch (rtdbError) {
        console.error("Error fetching analytics from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.reportAnalytics) {
        const analyticsRef = db.collection("report_analytics").doc("summary");
        const analyticsDoc = await analyticsRef.get();
        if (analyticsDoc.exists) {
          result.reportAnalytics = analyticsDoc.data();
        }
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reports data" },
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
      case "generate_report":
        const reportRef = await db.collection("generated_reports").add({
          ...data,
          createdAt: timestamp,
          status: "generating",
        });

        // Simulate report generation process
        setTimeout(async () => {
          await reportRef.update({
            status: "completed",
            completedAt: timestamp,
            downloadUrl: `https://storage.googleapis.com/your-bucket/reports/${reportRef.id}.pdf`,
          });
        }, 2000);

        return NextResponse.json({
          success: true,
          reportId: reportRef.id,
        });

      case "create_report_template":
        await db.collection("report_templates").add({
          ...data,
          createdAt: timestamp,
        });
        break;

      case "schedule_report":
        await db.collection("scheduled_reports").add({
          ...data,
          createdAt: timestamp,
          status: "active",
        });
        break;

      case "share_report":
        await db.collection("report_sharing").add({
          ...data,
          sharedAt: timestamp,
        });
        break;

      case "create_custom_config":
        await db.collection("custom_report_configs").add({
          ...data,
          createdAt: timestamp,
        });
        break;

      case "update_report_analytics":
        await db
          .collection("report_analytics")
          .doc("summary")
          .set(
            {
              ...data.analytics,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "export_report_data":
        await db.collection("report_exports").add({
          ...data,
          exportedAt: timestamp,
          status: "processing",
        });
        break;

      case "update_scheduled_report":
        await db
          .collection("scheduled_reports")
          .doc(data.scheduleId)
          .update({
            ...data.updates,
            updatedAt: timestamp,
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
    console.error("Reports POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update reports data" },
      { status: 500 }
    );
  }
}
