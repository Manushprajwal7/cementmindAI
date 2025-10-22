# Firebase Profile Setup Guide

This guide provides step-by-step instructions for configuring Firebase to work with the user profile system in CementMind AI.

## Prerequisites

- Firebase project created
- Firebase Admin SDK service account key
- Environment variables properly configured in `.env.local`

## Firebase Console Configuration Steps

### 1. Enable Authentication Providers

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following providers:
   - Email/Password
   - (Optional) Google, Facebook, or other social providers

### 2. Configure Firestore Database

1. In the Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in locked mode** (for production)
4. Select a location closest to your users
5. Click **Enable**

### 3. Set Up Firestore Security Rules

1. In the Firestore Database section, click on the **Rules** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own profile
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }

    // Other collections can be configured as needed
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

### 4. Create Firestore Indexes (if needed)

1. In the Firestore Database section, click on the **Indexes** tab
2. The required indexes will be automatically created when needed, or you can create them manually:
   - Collection: `users`
   - Fields: `uid` (Ascending)
   - Query scope: Collection

### 5. Verify Environment Variables

Ensure your `.env.local` file contains the correct values:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GCP_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Test the Profile System

1. Start your development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Sign up for a new account
4. Complete your profile information
5. Save the profile and verify you're redirected to the dashboard
6. Sign out and sign back in to verify returning users are redirected directly to the dashboard

## Troubleshooting

### Profile Update Errors

If you encounter errors when updating profiles:

1. Verify the user document exists in Firestore
2. Check that the user ID matches the authenticated user
3. Ensure Firestore security rules allow the update operation

### Authentication Issues

If authentication fails:

1. Verify API keys in environment variables
2. Check that the Firebase project is properly configured
3. Ensure the application domain is listed in authorized domains

### Environment Variable Issues

If environment variables aren't loading:

1. Confirm the `.env.local` file is in the root directory
2. Restart the development server after making changes
3. Check for proper escaping of special characters in private keys

## Profile Data Structure

User profiles are stored in Firestore with the following structure:

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  firstName: string,
  lastName: string,
  role: string,
  status: string,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  photoURL: string,
  phoneNumber: string,
  company: string,
  department: string,
  position: string,
  preferences: {
    theme: string,
    notifications: boolean,
    language: string
  },
  metadata: {
    creationTime: string,
    lastSignInTime: string
  }
}
```

This structure supports the profile management features and can be extended as needed for your application.
