import { NextRequest, NextResponse } from "next/server";
import {
  getFirestoreAdmin,
  getAdminAuthInstance,
  getFirebaseAdmin,
} from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const db = getFirestoreAdmin();
    const auth = getAdminAuthInstance();

    // More detailed error reporting
    if (!db && !auth) {
      console.error(
        "Firebase Admin not initialized - Both DB and Auth are null"
      );
      return NextResponse.json(
        {
          error: "Firebase Admin not initialized",
          details: "Both Firestore and Auth services are unavailable",
        },
        { status: 500 }
      );
    }

    if (!db) {
      console.error("Firestore Admin not initialized");
      return NextResponse.json(
        {
          error: "Firebase Admin not initialized",
          details: "Firestore service is unavailable",
        },
        { status: 500 }
      );
    }

    if (!auth) {
      console.error("Firebase Auth Admin not initialized");
      return NextResponse.json(
        {
          error: "Firebase Admin not initialized",
          details: "Auth service is unavailable",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { type, data } = body;
    const timestamp = FieldValue.serverTimestamp();

    switch (type) {
      case "verify_token":
        try {
          const decodedToken = await auth.verifyIdToken(data.idToken);
          const userRecord = await auth.getUser(decodedToken.uid);

          // Get user data from Firestore
          const userDoc = await db
            .collection("users")
            .doc(decodedToken.uid)
            .get();
          const userData = userDoc.exists ? userDoc.data() : null;

          return NextResponse.json({
            success: true,
            user: {
              uid: decodedToken.uid,
              email: userRecord.email,
              displayName: userRecord.displayName,
              ...userData,
            },
          });
        } catch (error) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

      case "create_user":
        try {
          const userRecord = await auth.createUser({
            email: data.email,
            password: data.password,
            displayName: data.displayName,
            ...(data.photoURL && { photoURL: data.photoURL }),
          });

          // Enhanced user document in Firestore with comprehensive profile data
          const userProfile = {
            uid: userRecord.uid,
            email: data.email,
            displayName: data.displayName || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            role: data.role || "user",
            status: "active",
            createdAt: timestamp,
            lastLoginAt: null,
            photoURL: data.photoURL || "",
            phoneNumber: data.phoneNumber || "",
            company: data.company || "",
            department: data.department || "",
            position: data.position || "",
            preferences: {
              theme: "system",
              notifications: true,
              language: "en",
            },
            metadata: {
              creationTime: userRecord.metadata.creationTime,
              lastSignInTime: userRecord.metadata.lastSignInTime,
            },
          };

          // Create user document in Firestore
          await db.collection("users").doc(userRecord.uid).set(userProfile);

          // Set custom claims for role-based access control
          await auth.setCustomUserClaims(userRecord.uid, {
            role: data.role || "user",
            companyId: data.companyId || null,
          });

          // Return user data without duplicate properties
          const returnUser = {
            ...userProfile,
            // Firebase auth properties
            emailVerified: userRecord.emailVerified,
            disabled: userRecord.disabled,
          };

          return NextResponse.json({
            success: true,
            user: returnUser,
          });
        } catch (error: any) {
          console.error("Create user error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "update_user":
        try {
          // Update Firebase Auth user record
          await auth.updateUser(data.uid, {
            ...(data.email && { email: data.email }),
            ...(data.displayName && { displayName: data.displayName }),
            ...(data.photoURL && { photoURL: data.photoURL }),
          });

          // Prepare update data for Firestore user document
          const updateData: any = {
            updatedAt: timestamp,
          };

          // Add any provided profile fields to update
          if (data.displayName !== undefined)
            updateData.displayName = data.displayName;
          if (data.firstName !== undefined)
            updateData.firstName = data.firstName;
          if (data.lastName !== undefined) updateData.lastName = data.lastName;
          if (data.role !== undefined) updateData.role = data.role;
          if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;
          if (data.phoneNumber !== undefined)
            updateData.phoneNumber = data.phoneNumber;
          if (data.company !== undefined) updateData.company = data.company;
          if (data.department !== undefined)
            updateData.department = data.department;
          if (data.position !== undefined) updateData.position = data.position;

          // Update preferences if provided
          if (data.preferences) {
            updateData.preferences = {
              ...data.preferences,
            };
          }

          // Check if user document exists, create if it doesn't
          const userDoc = await db.collection("users").doc(data.uid).get();

          if (userDoc.exists) {
            // Update existing user document
            await db.collection("users").doc(data.uid).update(updateData);
          } else {
            // Create new user document with basic info
            const basicUserData = {
              uid: data.uid,
              email: data.email || "",
              displayName: data.displayName || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              role: data.role || "user",
              status: "active",
              createdAt: timestamp,
              lastLoginAt: null,
              photoURL: data.photoURL || "",
              phoneNumber: data.phoneNumber || "",
              company: data.company || "",
              department: data.department || "",
              position: data.position || "",
              preferences: {
                theme: "system",
                notifications: true,
                language: "en",
                ...data.preferences,
              },
              metadata: {
                creationTime: new Date().toISOString(),
                lastSignInTime: new Date().toISOString(),
              },
            };

            // Merge with updateData to ensure all provided fields are included
            const userData = {
              ...basicUserData,
              ...updateData,
            };

            await db.collection("users").doc(data.uid).set(userData);
          }

          return NextResponse.json({ success: true });
        } catch (error: any) {
          console.error("Update user error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "delete_user":
        try {
          await auth.deleteUser(data.uid);
          await db.collection("users").doc(data.uid).delete();
          return NextResponse.json({ success: true });
        } catch (error: any) {
          console.error("Delete user error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "set_custom_claims":
        try {
          await auth.setCustomUserClaims(data.uid, data.customClaims);
          return NextResponse.json({ success: true });
        } catch (error: any) {
          console.error("Set custom claims error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "revoke_refresh_tokens":
        try {
          await auth.revokeRefreshTokens(data.uid);
          return NextResponse.json({ success: true });
        } catch (error: any) {
          console.error("Revoke refresh tokens error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "update_last_login":
        try {
          // Update last login timestamp in user document
          await db.collection("users").doc(data.uid).update({
            lastLoginAt: timestamp,
            "metadata.lastSignInTime": new Date().toISOString(),
          });

          return NextResponse.json({ success: true });
        } catch (error: any) {
          console.error("Update last login error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "get_user_profile":
        try {
          // Get user profile from Firestore
          const userDoc = await db.collection("users").doc(data.uid).get();

          if (!userDoc.exists) {
            return NextResponse.json(
              { error: "User profile not found" },
              { status: 404 }
            );
          }

          const userProfile = userDoc.data();

          return NextResponse.json({
            success: true,
            profile: userProfile,
          });
        } catch (error: any) {
          console.error("Get user profile error:", error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      default:
        return NextResponse.json(
          { error: "Invalid operation type" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Authentication failed",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
