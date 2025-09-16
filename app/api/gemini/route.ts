import { NextRequest } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, system, model = "gemini-1.5-flash-002" } = body || {};

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
      });
    }

    const project =
      process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || "us-central1";
    if (!project) {
      return new Response(
        JSON.stringify({ error: "Missing GOOGLE_CLOUD_PROJECT env" }),
        { status: 500 }
      );
    }

    const vertex = new VertexAI({ project, location });
    const generativeModel = vertex.getGenerativeModel({ model });

    const request = {
      contents: [
        ...(system ? [{ role: "system", parts: [{ text: system }] }] : []),
        { role: "user", parts: [{ text: prompt }] },
      ],
    };

    const result = await generativeModel.generateContent(request as any);
    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
