#!/usr/bin/env node

/**
 * Firebase Database Initialization Script
 * This script sets up the initial Firestore collections and sample data
 * Run with: node scripts/init-firebase.js
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin
function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

if (!firebaseAdmin) {
  console.error(
    "Firebase Admin not initialized. Please check your environment variables."
  );
  process.exit(1);
}

const db = firebaseAdmin.firestore();

async function initializeCollections() {
  console.log("🚀 Initializing Firebase collections...");

  try {
    // Initialize Dashboard Metrics
    await db.collection("dashboard_metrics").doc("kpi").set({
      totalProduction: 0,
      qualityScore: 0,
      activeAlerts: 0,
      deliveryOnTime: 0,
      lastUpdated: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    // Initialize Alert Thresholds
    const alertThresholds = [
      { sensorType: "temperature", min: 20, max: 80, unit: "°C" },
      { sensorType: "pressure", min: 0, max: 100, unit: "PSI" },
      { sensorType: "humidity", min: 30, max: 70, unit: "%" },
      { sensorType: "vibration", min: 0, max: 5, unit: "g" },
    ];

    for (const threshold of alertThresholds) {
      await db
        .collection("alert_thresholds")
        .doc(threshold.sensorType)
        .set({
          ...threshold,
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
    }

    // Initialize Sensor Configurations
    const sensorConfigs = [
      {
        id: "temp_001",
        type: "temperature",
        location: "Kiln 1",
        status: "active",
      },
      {
        id: "press_001",
        type: "pressure",
        location: "Compressor 1",
        status: "active",
      },
      {
        id: "humid_001",
        type: "humidity",
        location: "Storage Area",
        status: "active",
      },
      {
        id: "vib_001",
        type: "vibration",
        location: "Motor 1",
        status: "active",
      },
    ];

    for (const config of sensorConfigs) {
      await db
        .collection("sensor_configurations")
        .doc(config.id)
        .set({
          ...config,
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
    }

    // Initialize Quality Standards
    const qualityStandards = [
      { parameter: "compressive_strength", min: 25, max: 50, unit: "MPa" },
      { parameter: "slump", min: 75, max: 150, unit: "mm" },
      { parameter: "air_content", min: 3, max: 6, unit: "%" },
      { parameter: "temperature", min: 15, max: 30, unit: "°C" },
    ];

    for (const standard of qualityStandards) {
      await db
        .collection("quality_standards")
        .doc(standard.parameter)
        .set({
          ...standard,
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
          updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
    }

    console.log("✅ Firebase collections initialized successfully!");
    console.log("📊 Collections created:");
    console.log("  - dashboard_metrics");
    console.log("  - alert_thresholds");
    console.log("  - sensor_configurations");
    console.log("  - quality_standards");
    console.log("  - report_templates");
    console.log("  - system_settings");
    console.log("  - user_roles");
    console.log("  - integrations");
  } catch (error) {
    console.error("❌ Error initializing Firebase collections:", error);
    process.exit(1);
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
        sensorId: "temp_001",
        value: 25 + Math.random() * 10,
        unit: "°C",
        timestamp: firebaseAdmin.firestore.Timestamp.fromDate(timestamp),
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
        timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      },
      {
        type: "pressure_low",
        severity: "high",
        message: "Pressure below minimum threshold in Compressor 1",
        sensorId: "press_001",
        status: "acknowledged",
        timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
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
        timestamp: firebaseAdmin.firestore.Timestamp.fromDate(timestamp),
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
        scheduledDate: firebaseAdmin.firestore.Timestamp.fromDate(
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
        scheduledDate: firebaseAdmin.firestore.Timestamp.fromDate(
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

