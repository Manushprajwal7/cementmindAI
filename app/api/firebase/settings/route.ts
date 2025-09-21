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

    // Get user management data
    if (!section || section === "users") {
      // Try to get users from RTDB first
      try {
        if (rtdb) {
          const rtdbUsersSnapshot = await rtdb.ref("users").once("value");
          const rtdbUsers = rtdbUsersSnapshot.val();
          if (rtdbUsers) {
            result.users = Object.entries(rtdbUsers).map(
              ([id, data]: [string, any]) => ({
                id,
                ...data,
                lastLogin: data.lastLogin
                  ? new Date(data.lastLogin).toISOString()
                  : null,
              })
            );
          }
        }
      } catch (rtdbError) {
        console.error("Error fetching users from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.users) {
        const usersRef = db.collection("users");
        const usersSnapshot = await usersRef.get();
        result.users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Try to get roles from RTDB first
      try {
        const rtdbRolesSnapshot = await rtdb.ref("user_roles").once("value");
        const rtdbRoles = rtdbRolesSnapshot.val();
        if (rtdbRoles) {
          result.roles = Object.entries(rtdbRoles).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
            })
          );
        }
      } catch (rtdbError) {
        console.error("Error fetching roles from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.roles) {
        const rolesRef = db.collection("user_roles");
        const rolesSnapshot = await rolesRef.get();
        result.roles = rolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return NextResponse.json(result);
    }

    // Get integration settings
    if (section === "integrations") {
      // Try to get integrations from RTDB first
      try {
        const rtdbIntegrationsSnapshot = await rtdb
          .ref("integrations")
          .once("value");
        const rtdbIntegrations = rtdbIntegrationsSnapshot.val();
        if (rtdbIntegrations) {
          result.integrations = Object.entries(rtdbIntegrations).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated).toISOString()
                : null,
            })
          );
        }
      } catch (rtdbError) {
        console.error("Error fetching integrations from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.integrations) {
        const integrationsRef = db.collection("integrations");
        const integrationsSnapshot = await integrationsRef.get();
        result.integrations = integrationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return NextResponse.json(result);
    }

    // Get audit logs
    if (section === "audit") {
      const auditRef = db
        .collection("audit_logs")
        .orderBy("timestamp", "desc")
        .limit(100);
      const auditSnapshot = await auditRef.get();
      const auditLogs = auditSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        success: true,
        data: { auditLogs },
      });
    }

    // Get system settings
    if (section === "system") {
      // Try to get system settings from RTDB first
      try {
        const rtdbSettingsSnapshot = await rtdb
          .ref("system_settings")
          .once("value");
        const rtdbSettings = rtdbSettingsSnapshot.val();
        if (rtdbSettings) {
          result.settings = Object.entries(rtdbSettings).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated).toISOString()
                : null,
            })
          );
        }
      } catch (rtdbError) {
        console.error("Error fetching system settings from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.settings) {
        const settingsRef = db.collection("system_settings");
        const settingsSnapshot = await settingsRef.get();
        result.settings = settingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Try to get notification preferences from RTDB first
      try {
        const rtdbNotificationsSnapshot = await rtdb
          .ref("notification_preferences")
          .once("value");
        const rtdbNotifications = rtdbNotificationsSnapshot.val();
        if (rtdbNotifications) {
          result.notifications = Object.entries(rtdbNotifications).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated).toISOString()
                : null,
            })
          );
        }
      } catch (rtdbError) {
        console.error(
          "Error fetching notification preferences from RTDB:",
          rtdbError
        );
      }

      // Fallback to Firestore if no RTDB data
      if (!result.notifications) {
        const notificationsRef = db.collection("notification_preferences");
        const notificationsSnapshot = await notificationsRef.get();
        result.notifications = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return NextResponse.json(result);
    }

    // Get notification settings
    if (section === "notifications") {
      // Try to get notifications from RTDB first
      try {
        const rtdbNotificationsSnapshot = await rtdb
          .ref("notification_settings")
          .once("value");
        const rtdbNotifications = rtdbNotificationsSnapshot.val();
        if (rtdbNotifications) {
          result.notifications = Object.entries(rtdbNotifications).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated).toISOString()
                : null,
            })
          );
        }
      } catch (rtdbError) {
        console.error("Error fetching notifications from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.notifications) {
        const notificationsRef = db.collection("notification_settings");
        const notificationsSnapshot = await notificationsRef.get();
        result.notifications = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return NextResponse.json(result);
    }

    // Get user preferences
    if (section === "preferences") {
      // Try to get preferences from RTDB first
      try {
        const rtdbPreferencesSnapshot = await rtdb
          .ref("user_preferences")
          .once("value");
        const rtdbPreferences = rtdbPreferencesSnapshot.val();
        if (rtdbPreferences) {
          result.preferences = Object.entries(rtdbPreferences).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
              lastUpdated: data.lastUpdated
                ? new Date(data.lastUpdated).toISOString()
                : null,
            })
          );
        }
      } catch (rtdbError) {
        console.error("Error fetching preferences from RTDB:", rtdbError);
      }

      // Fallback to Firestore if no RTDB data
      if (!result.preferences) {
        const preferencesRef = db.collection("user_preferences");
        const preferencesSnapshot = await preferencesRef.get();
        result.preferences = preferencesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return NextResponse.json(result);
    }

    // Default: return all settings data
    const [
      usersSnapshot,
      integrationsSnapshot,
      auditSnapshot,
      settingsSnapshot,
    ] = await Promise.all([
      db.collection("users").get(),
      db.collection("integrations").get(),
      db.collection("audit_logs").orderBy("timestamp", "desc").limit(50).get(),
      db.collection("system_settings").get(),
    ]);

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const integrations = integrationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const auditLogs = auditSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const settings = settingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: { users, integrations, auditLogs, settings },
    });
  } catch (error: any) {
    console.error("Settings API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings data" },
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
      case "create_user":
        await db.collection("users").add({
          ...data,
          createdAt: timestamp,
          status: "active",
        });
        break;

      case "update_user":
        await db
          .collection("users")
          .doc(data.userId)
          .update({
            ...data.updates,
            updatedAt: timestamp,
          });
        break;

      case "update_user_role":
        await db.collection("users").doc(data.userId).update({
          role: data.role,
          updatedAt: timestamp,
        });
        break;

      case "configure_integration":
        await db
          .collection("integrations")
          .doc(data.integrationId)
          .set(
            {
              ...data.config,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "update_system_setting":
        await db
          .collection("system_settings")
          .doc(data.settingId)
          .set(
            {
              ...data.setting,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "update_notification_preferences":
        await db
          .collection("notification_preferences")
          .doc(data.userId)
          .set(
            {
              ...data.preferences,
              updatedAt: timestamp,
            },
            { merge: true }
          );
        break;

      case "log_audit_event":
        await db.collection("audit_logs").add({
          ...data,
          timestamp,
        });
        break;

      case "backup_settings":
        await db.collection("settings_backups").add({
          ...data,
          backedUpAt: timestamp,
        });
        break;

      case "restore_settings":
        await db
          .collection("system_settings")
          .doc(data.settingId)
          .update({
            ...data.restoredData,
            restoredAt: timestamp,
            restoredBy: data.userId,
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
    console.error("Settings POST API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings data" },
      { status: 500 }
    );
  }
}
