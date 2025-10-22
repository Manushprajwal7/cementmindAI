# Firebase Environment Variables Setup Guide

This guide will help you properly configure the environment variables needed for Firebase authentication and the Admin SDK to work correctly in your CementMind AI application.

## 📋 Required Environment Variables

Your application requires the following environment variables in your `.env.local` file:

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

## 🔧 Step-by-Step Setup Instructions

### 1. Get Firebase Client Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview" and select "Project settings"
4. Under the "General" tab, scroll to "Your apps"
5. If you don't have a web app configured, click **"</>"** to add one
6. Register your app (give it a nickname like "CementMind AI")
7. Copy the `firebaseConfig` object values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `databaseURL` → `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 2. Generate and Configure Firebase Admin SDK Credentials

1. In Firebase Console, go to **Project settings**
2. Click on the **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** - this will download a JSON file
5. Open the downloaded JSON file and extract the following values:
   - `project_id` → `FIREBASE_PROJECT_ID` and `GOOGLE_CLOUD_PROJECT` and `GCP_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (IMPORTANT: Keep the `\n` characters)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 3. Configure the .env.local File

1. Open your `.env.local` file in the project root
2. Replace all placeholder values with your actual Firebase project credentials
3. For the `FIREBASE_PRIVATE_KEY`, make sure to:
   - Keep all `\n` characters as they are (these represent newlines in the private key)
   - Keep the entire value in quotes
   - Example:
     ```env
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7n...\n-----END PRIVATE KEY-----\n"
     ```

### 4. Gemini API Key (Optional but Recommended)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Copy the key to `GEMINI_API_KEY` in your `.env.local` file

## 🧪 Testing the Configuration

After updating your `.env.local` file:

1. **Restart your development server**:

   ```bash
   # Stop the current server (Ctrl+C)
   # Then start it again
   npm run dev
   ```

2. **Test authentication**:

   - Navigate to `http://localhost:3000`
   - Try signing up with a new account
   - Check that the user is created in Firebase Authentication
   - Verify that the user profile is created in Firestore

3. **Test profile updates**:
   - Sign in to your account
   - Navigate to the profile page
   - Fill in profile details and click "Save Changes"
   - Check that the data is saved to Firestore

## 🔍 Troubleshooting Common Issues

### "Firebase Admin not initialized" Error

This error occurs when the Firebase Admin SDK cannot be initialized, usually due to:

1. **Missing environment variables**:

   - Check that all required variables are present in `.env.local`
   - Ensure there are no typos in variable names

2. **Incorrect private key format**:

   - Make sure the `FIREBASE_PRIVATE_KEY` value includes all `\n` characters
   - Ensure the key is enclosed in quotes

3. **Permissions issues**:
   - Verify that the service account has the necessary permissions
   - The service account should have "Firebase Admin" role

### Profile Updates Not Saving

If profile updates are failing:

1. **Check browser console** for detailed error messages
2. **Check server logs** for API error details
3. **Verify Firestore rules** allow users to update their own profiles

### Environment Variables Not Loading

1. **Restart the development server** after changing `.env.local`
2. **Check for syntax errors** in the `.env.local` file
3. **Ensure the file is named exactly `.env.local`** (not `.env.local.txt`)

## 🔐 Security Best Practices

1. **Never commit `.env.local` to version control**

   - The `.gitignore` file should already exclude `.env.local`
   - Double-check that it's not in your repository

2. **Use different credentials for development and production**

   - Create separate Firebase projects for dev and prod environments

3. **Regularly rotate service account keys**
   - Generate new keys periodically and update your `.env.local`

## 📚 Additional Resources

- [Firebase Environment Configuration](https://firebase.google.com/docs/functions/config-env)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
