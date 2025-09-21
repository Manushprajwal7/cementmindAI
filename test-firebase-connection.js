// Test Firebase connection
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Test connection to Firebase Realtime Database
console.log('Testing Firebase Realtime Database connection...');
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Not set',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Not set',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? '✓ Set' : '✗ Not set',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Not set',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Not set',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Not set',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Not set',
});

// Try to read data from the database
// Test multiple paths that we need for quality and logistics components
// Based on init-firebase-realtime.js, data is stored under plants/plant-1
const plantId = 'plant-1';
const telemetryRef = ref(db, `plants/${plantId}/telemetry`);
const alertsRef = ref(db, `plants/${plantId}/alerts`);
const analysisRef = ref(db, `plants/${plantId}/analysis`);

// First test telemetry data access
onValue(telemetryRef, (snapshot) => {
  console.log('Telemetry data connection successful!');
  console.log('Telemetry data received:', snapshot.exists() ? 'Yes' : 'No');
  if (snapshot.exists()) {
    console.log('Telemetry data structure:', Object.keys(snapshot.val()));
  }
  
  // Now test alerts data access
  onValue(alertsRef, (snapshot) => {
    console.log('Alerts data connection successful!');
    console.log('Alerts data received:', snapshot.exists() ? 'Yes' : 'No');
    if (snapshot.exists()) {
      console.log('Alerts data structure:', Object.keys(snapshot.val()));
    }
    
    // Finally test analysis data (contains quality and logistics info)
    onValue(analysisRef, (snapshot) => {
      console.log('Analysis data connection successful!');
      console.log('Analysis data received:', snapshot.exists() ? 'Yes' : 'No');
      if (snapshot.exists()) {
        console.log('Analysis data structure:', Object.keys(snapshot.val()));
      }
      console.log('All tests completed successfully!');
      process.exit(0);
    }, (error) => {
      console.error('Error connecting to Analysis data:', error);
      process.exit(1);
    });
  }, (error) => {
    console.error('Error connecting to Alerts data:', error);
    process.exit(1);
  });
}, (error) => {
  console.error('Error connecting to Telemetry data:', error);
  process.exit(1);
});

// Set a timeout in case the connection doesn't resolve
setTimeout(() => {
  console.error('Connection timed out after 10 seconds');
  process.exit(1);
}, 10000);