import { NextRequest, NextResponse } from "next/server";
import { 
  getFirestoreAdmin, 
  getAdminAuthInstance,
  getFirebaseAdmin 
} from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const db = getFirestoreAdmin();
    const auth = getAdminAuthInstance();
    
    if (!db || !auth) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
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

          // Create user document in Firestore
          await db
            .collection("users")
            .doc(userRecord.uid)
            .set({
              email: data.email,
              displayName: data.displayName,
              role: data.role || "user",
              createdAt: timestamp,
              status: "active",
            });

          // Set custom claims
          await auth.setCustomUserClaims(userRecord.uid, {
            role: data.role || 'user',
            companyId: data.companyId || null,
          });

          return NextResponse.json({
            success: true,
            user: {
              uid: userRecord.uid,
              email: userRecord.email,
              displayName: userRecord.displayName,
            },
          });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "update_user":
        try {
          await auth.updateUser(data.uid, {
            ...(data.email && { email: data.email }),
            ...(data.displayName && { displayName: data.displayName }),
            ...(data.photoURL && { photoURL: data.photoURL }),
          });

          // Update user document in Firestore
          await db
            .collection("users")
            .doc(data.uid)
            .update({
              ...(data.displayName && { displayName: data.displayName }),
              ...(data.role && { role: data.role }),
              updatedAt: timestamp,
            });

          return NextResponse.json({ success: true });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "delete_user":
        try {
          await auth.deleteUser(data.uid);
          await db.collection("users").doc(data.uid).delete();
          return NextResponse.json({ success: true });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "set_custom_claims":
        try {
          await auth.setCustomUserClaims(data.uid, data.customClaims);
          return NextResponse.json({ success: true });
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

      case "revoke_refresh_tokens":
        try {
          await auth.revokeRefreshTokens(data.uid);
          return NextResponse.json({ success: true });
        } catch (error: any) {
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
      { error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
