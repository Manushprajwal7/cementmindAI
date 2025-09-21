#!/usr/bin/env node

/**
 * Firebase Setup Guide
 * Interactive guide to help set up Firebase credentials
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔥 Firebase Setup Guide");
console.log("======================\n");

console.log(
  "This guide will help you set up Firebase for your CementMind AI project.\n"
);

console.log("📋 Prerequisites:");
console.log("1. A Google account");
console.log("2. Access to Google Cloud Console\n");

console.log("🚀 Step 1: Create Firebase Project");
console.log("1. Go to: https://console.firebase.google.com/");
console.log("2. Click 'Create a project' or 'Add project'");
console.log("3. Enter project name: 'cementmind-ai' (or your preferred name)");
console.log("4. Enable Google Analytics (optional)");
console.log("5. Click 'Create project'\n");

console.log("🔧 Step 2: Enable Required Services");
console.log("1. In your Firebase project dashboard:");
console.log("   - Go to 'Authentication' → 'Get started' → 'Sign-in method'");
console.log("   - Enable 'Email/Password' provider");
console.log("2. Go to 'Firestore Database' → 'Create database'");
console.log("   - Choose 'Start in test mode' (for development)");
console.log("   - Select a location close to your users");
console.log("3. Go to 'Realtime Database' → 'Create database' (optional)");
console.log("   - Choose 'Start in test mode'\n");

console.log("🔑 Step 3: Generate Service Account Key");
console.log("1. Go to Project Settings (gear icon) → 'Service accounts'");
console.log("2. Click 'Generate new private key'");
console.log("3. Download the JSON file");
console.log("4. Keep this file secure - it contains sensitive credentials\n");

console.log("📝 Step 4: Get Web App Configuration");
console.log("1. In Project Settings → 'General' tab");
console.log("2. Scroll down to 'Your apps' section");
console.log("3. Click 'Web app' icon (</>)");
console.log("4. Register app with name: 'CementMind AI'");
console.log("5. Copy the Firebase configuration object\n");

console.log("⚙️ Step 5: Update Environment Variables");
console.log("You need to update your .env file with the following values:\n");

console.log("From Firebase Web App Config:");
console.log("- NEXT_PUBLIC_FIREBASE_API_KEY");
console.log("- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
console.log("- NEXT_PUBLIC_FIREBASE_DATABASE_URL");
console.log("- NEXT_PUBLIC_FIREBASE_PROJECT_ID");
console.log("- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
console.log("- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
console.log("- NEXT_PUBLIC_FIREBASE_APP_ID\n");

console.log("From Service Account JSON:");
console.log("- FIREBASE_PROJECT_ID (same as above)");
console.log("- FIREBASE_PRIVATE_KEY (the entire private_key value)");
console.log("- FIREBASE_CLIENT_EMAIL (client_email value)\n");

console.log("🧪 Step 6: Test Your Setup");
console.log("After updating your .env file, run:");
console.log("npx ts-node scripts/init-firebase.ts\n");

console.log("📚 Additional Resources:");
console.log("- FIREBASE_QUICK_START.md - Quick setup guide");
console.log("- FIREBASE_SETUP.md - Detailed documentation");
console.log("- https://firebase.google.com/docs - Official Firebase docs\n");

console.log("🎉 Once setup is complete, you can:");
console.log("- Run the initialization script to create database collections");
console.log("- Start your development server: npm run dev");
console.log("- Begin using Firebase features in your application\n");

rl.question("Press Enter to continue...", () => {
  console.log("\n✅ Setup guide complete!");
  console.log("Follow the steps above to configure Firebase for your project.");
  rl.close();
});
