// Utility functions for working with Firebase in Next.js API routes
// This file provides type-safe access to Firebase Admin functionality

import { adminAuth, adminFirestore, adminStorage } from './firebase-admin';

// Export a type-safe version of the Firebase Admin Auth
export const getAdminAuth = () => {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized. Make sure you have the correct environment variables set.');
  }
  return adminAuth;
};

// Export a type-safe version of the Firestore database
export const getAdminFirestore = () => {
  if (!adminFirestore) {
    throw new Error('Firebase Admin Firestore is not initialized. Make sure you have the correct environment variables set.');
  }
  return adminFirestore;
};

// Export a type-safe version of the Storage
export const getAdminStorage = () => {
  if (!adminStorage) {
    throw new Error('Firebase Admin Storage is not initialized. Make sure you have the correct environment variables set.');
  }
  return adminStorage;
};

// Verify ID token from client
export const verifyIdToken = async (token: string) => {
  try {
    const auth = getAdminAuth();
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};

// Get user by UID
export const getUser = async (uid: string) => {
  try {
    const auth = getAdminAuth();
    return await auth.getUser(uid);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
