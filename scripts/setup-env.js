#!/usr/bin/env node

/**
 * Environment Setup Helper Script
 * This script helps you create the necessary environment files for Firebase
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Firebase Environment Setup Helper");
console.log("=====================================\n");

// Check if .env.local already exists
const envLocalPath = path.join(process.cwd(), ".env.local");
const envPath = path.join(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  console.log("✅ .env.local already exists");
} else if (fs.existsSync(envPath)) {
  console.log("✅ .env already exists");
} else {
  console.log("📝 Creating environment template...");

  const envTemplate = `# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour private key here\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GCP_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here`;

  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log("✅ Created .env file with template values");
  } catch (error) {
    console.log("❌ Could not create .env file:", error.message);
  }
}

console.log("\n📋 Next Steps:");
console.log("1. Go to https://console.firebase.google.com/");
console.log("2. Create a new Firebase project or select existing one");
console.log("3. Enable Authentication, Firestore, and Realtime Database");
console.log("4. Generate a service account key");
console.log("5. Update the .env file with your actual Firebase configuration");
console.log("6. Run: npx ts-node scripts/init-firebase.ts");

console.log("\n📚 Documentation:");
console.log("- FIREBASE_QUICK_START.md - Step-by-step setup guide");
console.log("- FIREBASE_SETUP.md - Comprehensive documentation");

console.log("\n🎉 Setup helper complete!");
