// Firebase client initialization and exports
// This file should only be used in the browser environment

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getDatabase, type Database } from 'firebase/database';

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Client-side Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only in the browser
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let database: Database | null = null;

// Initialize Firebase app
function initFirebase(): FirebaseApp | null {
  if (!isBrowser) {
    console.warn('Firebase should only be initialized in the browser');
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  try {
    firebaseApp = initializeApp(firebaseConfig);
    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
}

// Get Firebase Auth instance
export function getFirebaseAuth(): Auth | null {
  if (!isBrowser) return null;
  if (!auth) {
    const app = initFirebase();
    if (app) {
      auth = getAuth(app);
    }
  }
  return auth;
}

// Get Firestore instance
export function getFirestoreDb(): Firestore | null {
  if (!isBrowser) return null;
  if (!firestore) {
    const app = initFirebase();
    if (app) {
      firestore = getFirestore(app);
    }
  }
  return firestore;
}

// Get Storage instance
export function getFirebaseStorage(): FirebaseStorage | null {
  if (!isBrowser) return null;
  if (!storage) {
    const app = initFirebase();
    if (app) {
      storage = getStorage(app);
    }
  }
  return storage;
}

// Get Realtime Database instance
export function getRealtimeDb(): Database | null {
  if (!isBrowser) return null;
  if (!database) {
    const app = initFirebase();
    if (app) {
      database = getDatabase(app);
    }
  }
  return database;
}

// Get Firebase App instance
export function getFirebaseApp(): FirebaseApp | null {
  if (!isBrowser) return null;
  if (!firebaseApp) {
    firebaseApp = initFirebase();
  }
  return firebaseApp;
}

// This export is kept for backward compatibility but will be removed in the future
export const getFirebaseAdmin = () => {
  if (isBrowser) {
    console.error('Firebase Admin should not be used on the client side');
    return null;
  }
  // In a real implementation, this would be imported from './firebase-admin'
  // But we're keeping it null here to prevent client-side usage
  return null;
};
