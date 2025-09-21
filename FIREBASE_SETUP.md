# Firebase Backend Setup for CementMind AI

This document provides comprehensive instructions for setting up Firebase backend functionality for your CementMind AI

## 🚀 Quick Start

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Realtime Database** (optional)
   - **Storage** (optional)

### 2. Environment Variables

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

### 3. Install Dependencies

```bash
npm install firebase-admin
```

### 4. Initialize Database

Run the initialization script to set up collections and sample data:

```bash
npx ts-node scripts/init-firebase.ts
```

## 📊 Database Structure

### Collections Overview

| Collection             | Purpose                | Key Fields                                  |
| ---------------------- | ---------------------- | ------------------------------------------- |
| `dashboard_metrics`    | KPI and dashboard data | totalProduction, qualityScore, activeAlerts |
| `telemetry_data`       | Sensor readings        | sensorId, value, unit, timestamp            |
| `alerts`               | System alerts          | type, severity, message, status             |
| `quality_measurements` | Quality control data   | batchId, parameter, value, status           |
| `delivery_schedules`   | Logistics data         | customerId, address, status, driverId       |
| `generated_reports`    | Report data            | type, title, status, downloadUrl            |
| `users`                | User management        | email, displayName, role, status            |
| `system_settings`      | Configuration          | key, value, type                            |

### Detailed Schema

#### Telemetry Data

```typescript
{
  id: string;
  sensorId: string;
  value: number;
  unit: string;
  timestamp: Timestamp;
  location?: string;
}
```

#### Alerts

```typescript
{
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Timestamp;
  status: 'active' | 'acknowledged' | 'resolved';
  sensorId?: string;
}
```

#### Quality Measurements

```typescript
{
  id: string;
  batchId: string;
  parameter: string;
  value: number;
  unit: string;
  timestamp: Timestamp;
  status: "pass" | "fail" | "warning";
}
```

## 🔌 API Endpoints

### Dashboard API (`/api/firebase/dashboard`)

- **GET**: Fetch dashboard metrics, recent alerts, telemetry summary
- **POST**: Update metrics, log activities

### Telemetry API (`/api/firebase/telemetry`)

- **GET**: Fetch telemetry data with filters (sensorId, time range)
- **POST**: Add telemetry data, update sensor configs, calibrate sensors

### Alerts API (`/api/firebase/alerts`)

- **GET**: Fetch alerts with filters (status, severity, time range)
- **POST**: Create alerts, update status, bulk operations

### Quality API (`/api/firebase/quality`)

- **GET**: Fetch quality measurements, standards, trends
- **POST**: Add measurements, update standards, create corrections

### Logistics API (`/api/firebase/logistics`)

- **GET**: Fetch delivery schedules, truck fleet, driver performance
- **POST**: Create schedules, update status, optimize routes

### Reports API (`/api/firebase/reports`)

- **GET**: Fetch reports, templates, scheduled reports
- **POST**: Generate reports, create templates, schedule reports

### Settings API (`/api/firebase/settings`)

- **GET**: Fetch users, integrations, audit logs, system settings
- **POST**: Manage users, configure integrations, update settings

### Auth API (`/api/firebase/auth`)

- **POST**: Verify tokens, create users, update users, manage roles

## 🎣 React Hooks

### Authentication Hook

```typescript
import { useFirebaseAuth } from "@/hooks/use-firebase";

function LoginComponent() {
  const { user, loading, signIn, signUp, logout } = useFirebaseAuth();

  // Use authentication state and methods
}
```

### Data Fetching Hooks

```typescript
import {
  useDashboardData,
  useTelemetryData,
  useAlertsData,
} from "@/hooks/use-firebase";

function Dashboard() {
  const { data, loading, error } = useDashboardData();
  const { data: telemetryData } = useTelemetryData({ limit: 100 });
  const { data: alertsData } = useAlertsData({ status: "active" });

  // Use data in your components
}
```

### Mutation Hooks

```typescript
import { useTelemetryMutation, useAlertsMutation } from "@/hooks/use-firebase";

function TelemetryForm() {
  const { mutate: addTelemetry, loading } = useTelemetryMutation();
  const { mutate: createAlert } = useAlertsMutation();

  const handleSubmit = async (data) => {
    await addTelemetry("add_telemetry", data);
  };
}
```

## 🔐 Authentication Setup

### 1. Enable Authentication

1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"

### 2. Set Up User Roles

The initialization script creates default user roles:

- `admin`: Full access
- `operator`: Read/Write access
- `manager`: Read/Write + Reports
- `viewer`: Read-only access

### 3. Custom Claims

Use the auth API to set custom claims for role-based access:

```typescript
const { mutate } = useAuthMutation();
await mutate("set_custom_claims", {
  uid: "user_id",
  customClaims: { role: "admin" },
});
```

## 📈 Real-time Features

### Firestore Real-time Listeners

```typescript
import { useEffect, useState } from "react";
import { getFirestoreDb } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

function RealTimeAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
      const newAlerts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(newAlerts);
    });

    return () => unsubscribe();
  }, []);

  return <div>{/* Render alerts */}</div>;
}
```

## 🚨 Error Handling

### API Error Handling

```typescript
const { data, loading, error, refetch } = useTelemetryData();

if (error) {
  console.error("Failed to fetch telemetry data:", error);
  // Show error message to user
}

if (loading) {
  return <div>Loading...</div>;
}
```

### Retry Logic

```typescript
const handleRetry = async () => {
  try {
    await refetch();
  } catch (error) {
    console.error("Retry failed:", error);
  }
};
```

## 🔧 Development Tips

### 1. Firestore Rules

Set up proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Indexing

Create composite indexes for complex queries:

- Go to Firestore > Indexes
- Add indexes for queries with multiple where clauses

### 3. Monitoring

- Use Firebase Console > Performance Monitoring
- Monitor Firestore usage and costs
- Set up alerts for quota limits

## 🎯 Hackathon Integration

### Google Technologies Used

- ✅ **Firebase**: Authentication, Firestore, Real-time Database
- ✅ **Gemini**: AI Chat (already implemented)
- ✅ **Vertex AI**: AI/ML capabilities (API routes ready)
- ✅ **Cloud Vision**: Image analysis (API routes ready)
- ✅ **BigQuery**: Data warehouse (API routes ready)
- ✅ **Agent Builder**: Can be integrated with Firebase Functions

### Next Steps

1. Set up Firebase project and environment variables
2. Run initialization script
3. Test API endpoints
4. Integrate with existing components
5. Add real-time features
6. Implement role-based access control

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Admin not initialized**

   - Check environment variables
   - Ensure service account key is properly formatted

2. **Permission denied errors**

   - Check Firestore security rules
   - Verify user authentication

3. **CORS errors**

   - Ensure API routes are properly configured
   - Check Next.js API route setup

4. **Real-time updates not working**
   - Verify Firestore listeners are properly set up
   - Check network connectivity

### Support

- Firebase Documentation: https://firebase.google.com/docs
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
