// Firebase client initialization and exports
// Uses environment variables prefixed with NEXT_PUBLIC_ for client usage

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let rtdb: Database | null = null;
let firestore: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (getApps().length) return getApps()[0];

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Require at minimum projectId and databaseURL for RTDB usage
  if (!config.projectId || !config.databaseURL) {
    return null;
  }

  app = initializeApp(config);
  return app;
}

export function getRealtimeDb(): Database | null {
  if (!app) app = getFirebaseApp();
  if (!app) return null;
  if (!rtdb) rtdb = getDatabase(app);
  return rtdb;
}

export function getFirestoreDb(): Firestore | null {
  if (!app) app = getFirebaseApp();
  if (!app) return null;
  if (!firestore) firestore = getFirestore(app);
  return firestore;
}
