// Server-side Firebase Admin SDK initialization
import {
  ServiceAccount,
  getApps,
  initializeApp,
  getApp,
  cert,
  App,
} from "firebase-admin/app";
import { getAuth as getAdminAuth, Auth } from "firebase-admin/auth";
import {
  getFirestore as getAdminFirestore,
  Firestore,
} from "firebase-admin/firestore";
import { getStorage as getAdminStorage, Storage } from "firebase-admin/storage";
import {
  getDatabase as getAdminDatabase,
  Database,
} from "firebase-admin/database";

// Check if we're running on the server
const isServer = typeof window === "undefined";

// Initialize Firebase Admin
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminFirestore: Firestore | null = null;
let adminStorage: Storage | null = null;
let adminDatabase: Database | null = null;

const initializeFirebaseAdmin = () => {
  if (!isServer) {
    console.warn("Firebase Admin should only be used on the server side");
    return null;
  }

  // Check if app already exists
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    adminAuth = getAdminAuth(adminApp);
    adminFirestore = getAdminFirestore(adminApp);
    adminStorage = getAdminStorage(adminApp);
    adminDatabase = getAdminDatabase(adminApp);

    return {
      app: adminApp,
      auth: adminAuth,
      firestore: adminFirestore,
      storage: adminStorage,
      database: adminDatabase,
    };
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

    if (!projectId || !privateKey || !clientEmail) {
      console.error("❌ Missing Firebase Admin SDK environment variables");
      if (!projectId) console.error("  - FIREBASE_PROJECT_ID is required");
      if (!privateKey) console.error("  - FIREBASE_PRIVATE_KEY is required");
      if (!clientEmail) console.error("  - FIREBASE_CLIENT_EMAIL is required");
      return null;
    }

    const serviceAccount: ServiceAccount = {
      projectId,
      privateKey,
      clientEmail,
    };

    const appOptions: any = {
      credential: cert(serviceAccount),
      storageBucket: `${projectId}.appspot.com`,
    };

    // Add databaseURL if available
    if (databaseURL) {
      appOptions.databaseURL = databaseURL;
    }

    adminApp = initializeApp(appOptions);

    adminAuth = getAdminAuth(adminApp);
    adminFirestore = getAdminFirestore(adminApp);
    adminStorage = getAdminStorage(adminApp);
    adminDatabase = getAdminDatabase(adminApp);

    return {
      app: adminApp,
      auth: adminAuth,
      firestore: adminFirestore,
      storage: adminStorage,
      database: adminDatabase,
    };
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
};

// Initialize Firebase Admin on module load
const firebaseAdmin = initializeFirebaseAdmin();

// Export the initialized instances
export const getFirebaseAdmin = () => firebaseAdmin;
export const getAdminApp = () => adminApp;
export const getAdminAuthInstance = () => adminAuth;
export const getFirestoreAdmin = () => adminFirestore;
export const getStorageAdmin = () => adminStorage;
export const getDatabase = () => adminDatabase;

export default firebaseAdmin;

export { adminAuth, adminFirestore, adminStorage, adminDatabase };
