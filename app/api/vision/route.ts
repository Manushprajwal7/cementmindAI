import { NextRequest } from "next/server";
import vision from "@google-cloud/vision";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, features = [{ type: "TEXT_DETECTION" }] } = body || {};
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
      });
    }

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.annotateImage({
      image: { content: imageBase64 },
      features: features.map((f: any) => ({ type: f.type })),
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
