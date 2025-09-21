import { NextRequest, NextResponse } from "next/server";
import { getFirestoreAdmin } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { plantId: string } }
) {
  try {
    const db = getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const plantId = params.plantId;
    const docRef = db.collection("plants").doc(plantId).collection("analysis");
    const snapshot = await docRef.get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No analysis data found" },
        { status: 404 }
      );
    }

    const analysisData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: analysisData });
  } catch (error: any) {
    console.error("Error fetching plant analysis:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch plant analysis" },
      { status: 500 }
    );
  }
}
