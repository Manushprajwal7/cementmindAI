#!/usr/bin/env node

/**
 * Firebase Realtime Database Initialization Script
 * This script sets up the initial Realtime Database structure for telemetry and alerts
 * Run with: node scripts/init-firebase-realtime.js
 */

require('dotenv').config();
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
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
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

const db = firebaseAdmin.database();

async function initializeRealtimeDatabase() {
  console.log("🚀 Initializing Firebase Realtime Database...");

  try {
    // Initialize plant data structure
    const plantId = "plant-1";
    const plantRef = db.ref(`plants/${plantId}`);

    // Initialize telemetry data
    const telemetryRef = plantRef.child('telemetry');
    const now = Date.now();

    // Generate sample telemetry readings (last 24 hours, every 15 minutes)
    const telemetryPromises = [];
    for (let i = 0; i < 96; i++) { // 24 hours * 4 readings per hour
      const timestamp = new Date(now - (96 - i) * 15 * 60 * 1000); // Every 15 minutes
      const reading = {
        timestamp: timestamp.toISOString(),
        kiln_temperature: 1450 + Math.random() * 100,
        system_pressure: 4.0 + Math.random() * 0.8,
        material_flow_rate: 240 + Math.random() * 20,
        oxygen_level: 20 + Math.random() * 2,
        energy_consumption: 350 + Math.random() * 50,
      };
      telemetryPromises.push(telemetryRef.push(reading));
    }

    // Initialize alerts data
    const alertsRef = plantRef.child('alerts');
    const alertTypes = [
      "Temperature Spike", 
      "Pressure Drop", 
      "Flow Irregularity", 
      "Energy Anomaly", 
      "Quality Deviation"
    ];
    const severities = ["low", "medium", "high", "critical"];
    const statuses = ["new", "acknowledged", "investigating", "resolved"];

    // Generate sample alerts (10 alerts)
    const alertPromises = [];
    for (let i = 0; i < 10; i++) {
      const alertTimestamp = new Date(now - i * 60 * 60 * 1000); // Every hour
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const alert = {
        id: `alert-${i + 1}`,
        timestamp: alertTimestamp.toISOString(),
        type: alertType,
        severity,
        confidence: 0.6 + Math.random() * 0.4,
        status,
        affected_sensors: [
          {
            sensor: `Sensor-${Math.floor(Math.random() * 10) + 1}`,
            current_value: 1450 + Math.random() * 100,
            expected_range: [1400, 1500],
            deviation_percent: 5 + Math.random() * 15,
          },
        ],
        potential_causes: [
          "Equipment malfunction",
          "Process parameter drift",
          "Material quality variation",
          "Environmental factors",
        ],
        recommended_actions: [
          "Check equipment calibration",
          "Adjust process parameters",
          "Inspect material quality",
          "Monitor environmental conditions",
        ],
        description: `${alertType} detected in system monitoring with ${((0.6 + Math.random() * 0.4) * 100).toFixed(
          1,
        )}% confidence`,
        assignee: Math.random() > 0.5 ? "J. Smith" : null,
      };

      alertPromises.push(alertsRef.push(alert));
    }

    // Initialize analysis data
    const analysisRef = plantRef.child('analysis');
    
    // Generate multiple analysis entries (last 24 hours, every 3 hours)
    const analysisPromises = [];
    for (let i = 0; i < 8; i++) { // 24 hours / 3 = 8 readings
      const timestamp = new Date(now - (8 - i) * 3 * 60 * 60 * 1000); // Every 3 hours
      
      // Create quality control data with more detailed structure
      const qualityControl = {
        predicted_fineness: 3400 + Math.random() * 100,
        predicted_setting_time: 180 + Math.random() * 20,
        predicted_strength: 42 + Math.random() * 3,
        corrections: {
          process_adjustments: {
            kiln_temperature: 0.95 + Math.random() * 0.1,
            mill_speed: 1.02 + Math.random() * 0.06,
            separator_speed: 0.98 + Math.random() * 0.08,
            air_flow: 1.05 + Math.random() * 0.07,
          },
          material_adjustments: {
            limestone_percent: 78 + Math.random() * 4,
            clay_percent: 15 + Math.random() * 2,
            gypsum_percent: 4.2 + Math.random() * 0.5,
            additives_percent: 2.8 + Math.random() * 0.3,
          },
          estimated_impact: {
            quality_improvement: 2 + Math.random() * 3,
            energy_savings: 1 + Math.random() * 2,
            cost_reduction: 1.5 + Math.random() * 2.5,
            production_efficiency: 3 + Math.random() * 2,
          },
        },
      };
      
      // Create logistics data with more detailed structure
      const logistics = {
        truck_scheduling: {
          predicted_demand: Array.from(
            { length: 48 },
            () => 15 + Math.random() * 10
          ),
          optimal_schedule: Object.fromEntries(
            Array.from({ length: 24 }, (_, i) => [
              i,
              Math.floor(2 + Math.random() * 4),
            ])
          ),
          total_trucks_needed: 12 + Math.floor(Math.random() * 6),
          peak_demand_hours: [8, 9, 14, 15, 16],
        },
        performance_metrics: {
          current_supply_efficiency: 92 + Math.random() * 6,
          inventory_turnover: 4.2 + Math.random() * 0.8,
          average_delay: 15 + Math.random() * 10,
          fuel_efficiency: 8.5 + Math.random() * 1.5,
          delivery_accuracy: 94 + Math.random() * 5,
        },
        improvement_opportunities: [
          "Optimize route scheduling during peak hours",
          "Implement predictive maintenance for trucks",
          "Reduce idle time at loading stations",
          "Optimize fuel consumption with better routing",
        ],
      };
      
      const analysisData = {
        timestamp: timestamp.toISOString(),
        system_status: Math.random() > 0.9 ? "warning" : "normal",
        alerts: [],
        recommendations: {
          quality_control: qualityControl,
          logistics: logistics,
        },
        performance_metrics: {
          energy_efficiency: 85 + Math.random() * 10,
          material_flow_rate: 240 + Math.random() * 20,
          system_pressure: 4.0 + Math.random() * 0.8,
          kiln_temperature: 1450 + Math.random() * 100,
          quality_score: 90 + Math.random() * 8,
          anomaly_confidence: Math.random() * 0.3,
        },
      };
      
      analysisPromises.push(analysisRef.push(analysisData));
    }

    // Wait for all promises to resolve
    await Promise.all([...telemetryPromises, ...alertPromises, ...analysisPromises]);

    console.log("✅ Firebase Realtime Database initialized successfully!");
    console.log("📊 Data created:");
    console.log(`  - 96 telemetry readings for plant-${plantId}`);
    console.log(`  - 10 alerts for plant-${plantId}`);
    console.log(`  - 8 analysis entries with quality and logistics data for plant-${plantId}`);
  } catch (error) {
    console.error("❌ Error initializing Firebase Realtime Database:", error);
    process.exit(1);
  }
}

async function main() {
  console.log("🔥 Firebase Realtime Database Initialization");
  console.log("=====================================");

  await initializeRealtimeDatabase();

  console.log("\n🎉 Firebase Realtime Database setup complete!");
  console.log(
    "You can now start using the Firebase Realtime Database in your application."
  );

  process.exit(0);
}

main().catch(console.error);