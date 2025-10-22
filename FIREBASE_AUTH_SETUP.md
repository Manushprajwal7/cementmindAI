# Firebase Authentication Setup Guide

This guide provides step-by-step instructions for setting up Firebase Authentication with email/password for your CementMind AI application.

## 🛠️ Step 1: Enable Email/Password Authentication

1. **Go to Firebase Console**

   - Navigate to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one if you haven't already)

2. **Navigate to Authentication**

   - In the left sidebar, click on **"Authentication"**
   - If this is your first time, click **"Get Started"**

3. **Enable Email/Password Sign-in**
   - Click on the **"Sign-in method"** tab
   - Find **"Email/Password"** provider in the list
   - Click on the **✏️ (Edit)** icon next to it
   - Toggle the **"Enable"** switch to **ON**
   - Optionally, enable **"Email link (passwordless sign-in)"** if you want passwordless authentication
   - Click **"Save"**

## 🔐 Step 2: Configure Authentication Rules

1. **Set up Firestore Security Rules**
   - In the Firebase Console, go to **Firestore Database**
   - Click on the **"Rules"** tab
   - Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Allow public read access to specific collections (if needed)
    match /public/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // User profiles - users can only read/write their own profile
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
```

2. **Click "Publish"** to save the rules

## 📋 Step 3: Create Test Users (Optional)

1. **Go to Authentication > Users**
2. **Click "Add user"**
3. **Enter email and password** for a test user
4. **Click "Add user"**
5. **Repeat** for additional test users

## ⚙️ Step 4: Configure Client-side Authentication

1. **Get Firebase Configuration**

   - In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
   - Select **"Project settings"**
   - Under **"General"** tab, scroll to **"Your apps"**
   - If you don't have a web app configured, click **"</>"** to add one
   - Register your app (give it a nickname like "CementMind AI")
   - Copy the Firebase configuration object

2. **Set Environment Variables**
   Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
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

## 🔑 Step 5: Set Up Firebase Admin SDK

1. **Generate Service Account Key**

   - In Firebase Console, go to **Project settings**
   - Click on the **"Service accounts"** tab
   - Click **"Generate new private key"**
   - Click **"Generate key"** - this will download a JSON file

2. **Configure Environment Variables**
   - Open the downloaded JSON file
   - Extract the following values:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the newlines as \n)
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - Add these to your `.env.local` file

## 🧪 Step 6: Test Authentication

1. **Start your development server**

   ```bash
   npm run dev
   ```

2. **Navigate to your app**
   - Open your browser to `http://localhost:3000`
   - Try signing up with a new email/password
   - Verify that the user is created in Firebase Authentication
   - Check that the user profile is created in Firestore under the "users" collection

## 🔒 Security Best Practices

1. **Password Policy**

   - In Firebase Console > Authentication > Sign-in method
   - Scroll to "Password policy" section
   - Enable "User password strength" and set to "Medium" or higher

2. **Email Verification**

   - In Firebase Console > Authentication > Sign-in method
   - Enable "Email verification" to require users to verify their email

3. **Rate Limiting**
   - Firebase automatically applies rate limiting to prevent abuse
   - Monitor the "Usage" tab in Authentication for unusual activity

## 🛠️ Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**

   - Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correctly set in your `.env.local`

2. **"Firebase: Error (auth/network-request-failed)"**

   - Check your internet connection
   - Ensure you're not behind a firewall blocking Firebase

3. **"PERMISSION_DENIED: Missing or insufficient permissions"**

   - Check your Firestore security rules
   - Ensure the user is authenticated before accessing data

4. **User profile not created in Firestore**
   - Check the API route in `app/api/firebase/auth/route.ts`
   - Verify the Firebase Admin SDK is properly configured

### Debugging Tips

1. **Check Firebase Console Logs**

   - Authentication > Sign-in method > Events tab
   - Look for failed sign-in attempts

2. **Enable Firebase Debug Mode**

   - Add `console.log` statements in your authentication functions
   - Check browser console for errors

3. **Test with Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase projects:list
   ```

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
