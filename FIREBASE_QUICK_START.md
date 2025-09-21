# Firebase Quick Start Guide

## 🚀 Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `cementmind-ai`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Required Services

1. **Authentication**: Go to Authentication > Get Started > Sign-in method > Enable Email/Password
2. **Firestore**: Go to Firestore Database > Create database > Start in test mode
3. **Storage**: Go to Storage > Get started > Start in test mode (optional)

### 3. Get Configuration Keys

1. Go to Project Settings (gear icon) > General tab
2. Scroll down to "Your apps" section
3. Click "Add app" > Web app (</>)
4. Register app name: `cementmind-web`
5. Copy the configuration object

### 4. Create Service Account

1. Go to Project Settings > Service accounts tab
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for environment variables

### 5. Set Up Environment Variables

Create a `.env.local` file in your project root with these values:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from service account JSON\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GCP_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1

# Gemini API (if you have it)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Initialize Database

Run the JavaScript version of the initialization script:

```bash
node scripts/init-firebase.js
```

### 7. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to your application
3. Check the browser console for any Firebase connection errors
4. Try using the authentication component

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase Admin not initialized"**

   - Check that all environment variables are set correctly
   - Ensure the private key is properly formatted with `\n` for newlines

2. **"Permission denied" errors**

   - Make sure Firestore is in test mode initially
   - Check that Authentication is enabled

3. **Module import errors**
   - Use the JavaScript version: `node scripts/init-firebase.js`
   - Make sure firebase-admin is installed: `npm install firebase-admin`

### Next Steps:

1. Set up Firestore security rules
2. Configure authentication providers
3. Test the API endpoints
4. Integrate with your frontend components

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

