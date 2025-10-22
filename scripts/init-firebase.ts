#!/usr/bin/env ts-node

/**
 * Firebase Database Initialization Script
 * This script sets up the initial Firestore collections and sample data
 * Run with: npx ts-node scripts/init-firebase.ts
 */

import * as admin from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

// Log environment variables for debugging
console.log("Environment variables being used:");
console.log(
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Found" : "❌ Missing"
);
console.log(
  "FIREBASE_PRIVATE_KEY:",
  process.env.FIREBASE_PRIVATE_KEY ? "✅ Found" : "❌ Missing"
);
console.log(
  "FIREBASE_CLIENT_EMAIL:",
  process.env.FIREBASE_CLIENT_EMAIL ? "✅ Found" : "❌ Missing"
);
console.log(
  "FIREBASE_CLIENT_ID:",
  process.env.FIREBASE_CLIENT_ID ? "✅ Found" : "❌ Missing"
);
console.log(
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL:",
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "✅ Found" : "❌ Missing"
);

// Initialize Firebase Admin SDK with service account
const serviceAccount = {
  type: "service_account",
  project_id:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL?.replace(
    "@",
    "%40"
  )}`,
  universe_domain: "googleapis.com",
};

// Verify required environment variables
const requiredEnvVars = [
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_CLIENT_ID",
];

// Check for project ID (either version is acceptable)
if (
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  !process.env.FIREBASE_PROJECT_ID
) {
  console.error(
    "❌ Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID or FIREBASE_PROJECT_ID"
  );
  process.exit(1);
}

// Check for database URL (only required if using Realtime Database)
if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
  console.warn(
    "⚠️ NEXT_PUBLIC_FIREBASE_DATABASE_URL not set. Some features may not work as expected."
  );
}

// Check for missing required variables
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingVars.join(", ")
  );
  console.log(
    "\nPlease make sure your .env file contains all required variables:"
  );
  console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id");
  console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."');
  console.log(
    "FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com"
  );
  console.log("FIREBASE_CLIENT_ID=your-client-id");
  process.exit(1);
}

let app;
try {
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log("✅ Firebase Admin initialized successfully");
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error);
  throw error;
}

const db = getFirestore(app);
const serverTimestamp = FieldValue.serverTimestamp;

async function initializeCollections() {
  console.log("🚀 Initializing Firebase collections...");

  try {
    // Initialize Dashboard Metrics
    await db.collection("dashboard_metrics").doc("kpi").set({
      totalProduction: 0,
      qualityScore: 0,
      activeAlerts: 0,
      deliveryOnTime: 0,
      lastUpdated: serverTimestamp(),
    });

    // Initialize Alert Thresholds
    const thresholds = [
      { parameter: "temperature", min: 100, max: 200, unit: "°C" },
      { parameter: "pressure", min: 50, max: 150, unit: "psi" },
      { parameter: "flow_rate", min: 1000, max: 2000, unit: "L/min" },
      { parameter: "vibration", min: 0, max: 10, unit: "mm/s" },
    ];

    for (const threshold of thresholds) {
      await db
        .collection("alert_thresholds")
        .doc(threshold.parameter)
        .set({
          ...threshold,
          createdAt: serverTimestamp(),
        });
    }

    // Initialize Report Templates
    const reportTemplates = [
      {
        name: "Daily Production Report",
        type: "production",
        frequency: "daily",
      },
      { name: "Quality Control Report", type: "quality", frequency: "weekly" },
      { name: "Logistics Summary", type: "logistics", frequency: "daily" },
      { name: "Alert Analysis Report", type: "alerts", frequency: "monthly" },
    ];

    for (const template of reportTemplates) {
      await db.collection("report_templates").add({
        ...template,
        createdAt: serverTimestamp(),
      });
    }

    // Initialize System Settings
    const systemSettings = [
      {
        key: "notification_email",
        value: "admin@cementmind.com",
        type: "string",
      },
      { key: "alert_retention_days", value: 30, type: "number" },
      { key: "data_backup_frequency", value: "daily", type: "string" },
      { key: "max_concurrent_users", value: 100, type: "number" },
    ];

    for (const setting of systemSettings) {
      await db
        .collection("system_settings")
        .doc(setting.key)
        .set({
          ...setting,
          updatedAt: serverTimestamp(),
        });
    }

    // Initialize User Roles
    const userRoles = [
      {
        name: "admin",
        permissions: ["read", "write", "delete", "manage_users"],
      },
      { name: "operator", permissions: ["read", "write"] },
      { name: "viewer", permissions: ["read"] },
      { name: "manager", permissions: ["read", "write", "generate_reports"] },
    ];

    for (const role of userRoles) {
      await db
        .collection("user_roles")
        .doc(role.name)
        .set({
          ...role,
          createdAt: serverTimestamp(),
        });
    }

    // Initialize Integrations
    const integrations = [
      {
        name: "BigQuery",
        type: "data_warehouse",
        status: "active",
        config: {},
      },
      { name: "Vertex AI", type: "ai_ml", status: "active", config: {} },
      {
        name: "Cloud Vision",
        type: "computer_vision",
        status: "active",
        config: {},
      },
      { name: "Gemini", type: "ai_chat", status: "active", config: {} },
    ];

    for (const integration of integrations) {
      await db
        .collection("integrations")
        .doc(integration.name.toLowerCase().replace(" ", "_"))
        .set({
          ...integration,
          createdAt: serverTimestamp(),
        });
    }

    console.log("✅ Firebase collections initialized successfully!");
    console.log("📊 Collections created:");
    console.log("  - dashboard_metrics");
    console.log("  - alert_thresholds");
    console.log("  - report_templates");
    console.log("  - system_settings");
    console.log("  - user_roles");
    console.log("  - integrations");
    console.log("  - users (will be created on signup)");
  } catch (error) {
    console.error("❌ Error initializing collections:", error);
    throw error;
  }
}

async function addSampleData() {
  console.log("📝 Adding sample data...");

  try {
    // Add sample telemetry data
    const sampleTelemetryData = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - i * 60000); // Every minute for last 50 minutes
      sampleTelemetryData.push({
        sensorId: `temp_001`,
        value: 25 + Math.random() * 10,
        unit: "°C",
        timestamp: admin.firestore.Timestamp.fromDate(timestamp),
        location: "Kiln 1",
      });
    }

    for (const data of sampleTelemetryData) {
      await db.collection("telemetry_data").add(data);
    }

    // Add sample alerts
    const sampleAlerts = [
      {
        type: "temperature_high",
        severity: "medium",
        message: "Temperature exceeded threshold in Kiln 1",
        sensorId: "temp_001",
        status: "active",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        type: "pressure_low",
        severity: "high",
        message: "Pressure below minimum threshold in Compressor 1",
        sensorId: "press_001",
        status: "acknowledged",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const alert of sampleAlerts) {
      await db.collection("alerts").add(alert);
    }

    // Add sample quality measurements
    const sampleQualityData = [];
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000); // Every hour for last 20 hours
      sampleQualityData.push({
        batchId: `BATCH_${String(i + 1).padStart(3, "0")}`,
        parameter: "compressive_strength",
        value: 30 + Math.random() * 10,
        unit: "MPa",
        status: Math.random() > 0.1 ? "pass" : "fail",
        timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      });
    }

    for (const data of sampleQualityData) {
      await db.collection("quality_measurements").add(data);
    }

    // Add sample delivery schedules
    const sampleDeliveries = [
      {
        customerId: "CUST_001",
        customerName: "ABC Construction",
        address: "123 Main St, City, State",
        scheduledDate: admin.firestore.Timestamp.fromDate(
          new Date(now.getTime() + 86400000)
        ), // Tomorrow
        status: "scheduled",
        driverId: "DRV_001",
        truckId: "TRK_001",
        productType: "Ready Mix Concrete",
        quantity: 10,
      },
      {
        customerId: "CUST_002",
        customerName: "XYZ Builders",
        address: "456 Oak Ave, City, State",
        scheduledDate: admin.firestore.Timestamp.fromDate(
          new Date(now.getTime() + 172800000)
        ), // Day after tomorrow
        status: "scheduled",
        driverId: "DRV_002",
        truckId: "TRK_002",
        productType: "Precast Concrete",
        quantity: 5,
      },
    ];

    for (const delivery of sampleDeliveries) {
      await db.collection("delivery_schedules").add(delivery);
    }

    console.log("✅ Sample data added successfully!");
    console.log("📊 Sample data includes:");
    console.log("  - 50 telemetry readings");
    console.log("  - 2 sample alerts");
    console.log("  - 20 quality measurements");
    console.log("  - 2 delivery schedules");
  } catch (error) {
    console.error("❌ Error adding sample data:", error);
  }
}

async function main() {
  console.log("🔥 Firebase Database Initialization");
  console.log("=====================================");

  await initializeCollections();
  await addSampleData();

  console.log("\n🎉 Firebase setup complete!");
  console.log(
    "You can now start using the Firebase backend in your application."
  );

  process.exit(0);
}

main().catch(console.error);
